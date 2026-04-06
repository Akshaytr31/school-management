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
import api from "../api";

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async () => {
    try {
      const response = await api.get("teachers/");
      setTeachers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("teachers/", { username, password, email });
      setUsername("");
      setPassword("");
      setEmail("");
      fetchTeachers();
      alert("Teacher account created successfully!");
    } catch (error) {
      alert("Error creating teacher account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spaceY={10} align="stretch">
        <HStack justify="space-between">
          <Heading color="var(--primary-dark)">Admin Dashboard</Heading>
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
          {/* Add Teacher Form */}
          <Box
            p={6}
            borderRadius="xl"
            bg="white"
            shadow="md"
            border="1px solid"
            borderColor="var(--light-gray)"
          >
            <VStack spaceY={4} align="stretch">
              <Heading size="md">Create Teacher Account</Heading>
              <form onSubmit={handleAddTeacher}>
                <VStack spaceY={4}>
                  <Box w="100%">
                    <Text mb={1} size="sm">
                      Username
                    </Text>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Box>
                  <Box w="100%">
                    <Text mb={1} size="sm">
                      Email
                    </Text>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Box>
                  <Box w="100%">
                    <Text mb={1} size="sm">
                      Password
                    </Text>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    Create Teacher
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>

          {/* Teachers list */}
          <Box
            p={6}
            borderRadius="xl"
            bg="white"
            shadow="md"
            border="1px solid"
            borderColor="gray.100"
          >
            <VStack spaceY={4} align="stretch">
              <Heading size="md">Teacher Accounts</Heading>
              <Box overflowX="auto">
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Username</Table.ColumnHeader>
                      <Table.ColumnHeader>Email</Table.ColumnHeader>
                      <Table.ColumnHeader>Actions</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {teachers.map((teacher) => (
                      <Table.Row key={teacher.id}>
                        <Table.Cell>{teacher.username}</Table.Cell>
                        <Table.Cell>{teacher.email}</Table.Cell>
                        <Table.Cell>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="var(--primary)"
                            _hover={{ bg: "var(--primary)", color: "white" }}
                            onClick={() => {
                              const newPassword = prompt(
                                "Enter new password for " + teacher.username,
                              );
                              if (newPassword) {
                                api
                                  .patch(`teachers/${teacher.id}/`, {
                                    password: newPassword,
                                  })
                                  .then(() => alert("Password updated"))
                                  .catch(() =>
                                    alert("Error updating password"),
                                  );
                              }
                            }}
                          >
                            Reset Password
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                    {teachers.length === 0 && (
                      <Table.Row>
                        <Table.Cell colSpan={3} textAlign="center">
                          No teachers added yet.
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

export default AdminDashboard;
