import { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  Table,
  Input,
  Container,
  Grid,
} from "@chakra-ui/react";
import { Plus, GraduationCap, LayoutGrid, UserCircle } from "lucide-react";
import api from "../api";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [division, setDivision] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await api.get("students/");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("students/", { name, grade_level: gradeLevel, division });
      setName("");
      setGradeLevel("");
      setDivision("");
      fetchStudents();
      alert("Student added successfully!");
    } catch (error) {
      alert("Error adding student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spaceY={10} align="stretch">
        <HStack justify="space-between">
          <Heading color="var(--primary-dark)">Teacher Dashboard</Heading>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </Button>
        </HStack>

        <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={8}>
          {/* Add Student Form */}
          <Box
            p={6}
            borderRadius="xl"
            bg="white"
            shadow="md"
            border="1px solid"
            borderColor="var(--light-gray)"
          >
            <VStack spaceY={4} align="stretch">
              <Heading size="md">Add New Student</Heading>
              <form onSubmit={handleAddStudent}>
                <VStack spaceY={4}>
                  <Box w="100%">
                    <Text mb={1} size="sm">
                      Name
                    </Text>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Box>
                  <Box w="100%">
                    <Text mb={1} size="sm">
                      Class
                    </Text>
                    <Input
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      required
                    />
                  </Box>
                  <Box w="100%">
                    <Text mb={1} size="sm">
                      Division
                    </Text>
                    <Input
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      required
                    />
                  </Box>
                  <Button
                    type="submit"
                    bg="var(--primary)"
                    color="white"
                    _hover={{ bg: "var(--primary-dark)" }}
                    w="100%"
                    loading={loading}
                  >
                    Add Student
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>

          {/* Students list */}
          <Box
            p={6}
            borderRadius="xl"
            bg="white"
            shadow="md"
            border="1px solid"
            borderColor="gray.100"
          >
            <VStack spaceY={4} align="stretch">
              <Heading size="md">Student List</Heading>
              <Box overflowX="auto">
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Name</Table.ColumnHeader>
                      <Table.ColumnHeader>Class</Table.ColumnHeader>
                      <Table.ColumnHeader>Division</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {students.map((student) => (
                      <Table.Row key={student.id}>
                        <Table.Cell>{student.name}</Table.Cell>
                        <Table.Cell>{student.grade_level}</Table.Cell>
                        <Table.Cell>{student.division}</Table.Cell>
                      </Table.Row>
                    ))}
                    {students.length === 0 && (
                      <Table.Row>
                        <Table.Cell colSpan={3} textAlign="center">
                          No students added yet.
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>
            </VStack>
          </Box>
        </Grid>
      </VStack>
    </Container>
  );
};

export default Dashboard;
