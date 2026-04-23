import React from "react";
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Badge,
  Separator,
  Heading,
  Table,
} from "@chakra-ui/react";
import {
  Users,
  BookOpen,
  UserCheck,
  GraduationCap,
  LayoutGrid,
  Calendar,
} from "lucide-react";
import BaseDetailView from "./BaseDetailView";

const StatCard = ({ label, value, icon: Icon, color = "blue.500" }) => (
  <Box
    p={5}
    borderRadius="2xl"
    bg="white"
    border="1px solid"
    borderColor="gray.100"
    boxShadow="sm"
  >
    <HStack justify="space-between" mb={2}>
      <Text
        fontSize="xs"
        color="gray.500"
        fontWeight="bold"
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Box color={color}>
        <Icon size={18} />
      </Box>
    </HStack>
    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
      {value}
    </Text>
  </Box>
);

const ClassDetail = ({
  classData,
  admissions,
  departments,
  teachers = [],
  onBack,
  onEdit,
  onDelete,
}) => {
  if (!classData) return null;

  const department = departments.find((d) => d.id === classData.department);
  const classStudents = admissions.filter((a) => a.class_name === classData.id);
  const classTeacher = teachers.find((t) => t.id === classData.class_teacher);

  const boys = classStudents.filter((s) => s.gender === "Male").length;
  const girls = classStudents.filter((s) => s.gender === "Female").length;

  return (
    <BaseDetailView
      title={`${classData.class_name} ${classData.division ? `- ${classData.division}` : ""}`}
      subtitle={`${department?.department_name || "Unknown Department"} | ${classData.category}`}
      onBack={onBack}
      onEdit={() => onEdit(classData)}
      onDelete={() => onDelete(classData.id)}
      icon={LayoutGrid}
    >
      <VStack align="stretch" gap={8}>
        {/* Quick Stats */}
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
          <StatCard
            label="Total Students"
            value={classStudents.length}
            icon={Users}
          />
          <StatCard label="Boys" value={boys} icon={Users} color="blue.400" />
          <StatCard label="Girls" value={girls} icon={Users} color="pink.400" />
          <StatCard
            label="Attendance Rate"
            value="98%"
            icon={UserCheck}
            color="green.400"
          />
        </SimpleGrid>

        {/* Student Roster */}
        <Box p={6} borderRadius="3xl" className="glass-card" bg="white">
          <VStack align="stretch" gap={6}>
            <HStack justify="space-between">
              <VStack align="start" gap={0}>
                <Heading size="md">Student Roster</Heading>
                <Text fontSize="sm" color="gray.500">
                  List of all students currently enrolled in this class.
                </Text>
              </VStack>
              <Badge colorPalette="blue" px={4} py={1} borderRadius="full">
                Session 2024-25
              </Badge>
            </HStack>

            <Box overflowX="auto">
              <Table.Root size="sm" variant="outline">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Adm No</Table.ColumnHeader>
                    <Table.ColumnHeader>Student Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Gender</Table.ColumnHeader>
                    <Table.ColumnHeader>Guardian</Table.ColumnHeader>
                    <Table.ColumnHeader>Contact</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {classStudents.map((student) => (
                    <Table.Row key={student.id} _hover={{ bg: "gray.50" }}>
                      <Table.Cell fontWeight="bold">
                        {student.admission_number}
                      </Table.Cell>
                      <Table.Cell>
                        {student.first_name} {student.last_name}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          size="xs"
                          colorPalette={
                            student.gender === "Male" ? "blue" : "pink"
                          }
                        >
                          {student.gender}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>{student.father_name}</Table.Cell>
                      <Table.Cell>{student.father_mobile}</Table.Cell>
                    </Table.Row>
                  ))}
                  {classStudents.length === 0 && (
                    <Table.Row>
                      <Table.Cell
                        colSpan={5}
                        textAlign="center"
                        py={10}
                        color="gray.500"
                      >
                        No students enrolled in this class yet.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>
          </VStack>
        </Box>

        {/* Additional Info placeholders */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
          <Box p={6} borderRadius="3xl" className="glass-card" bg="white">
            <Heading size="md" mb={6} color="gray.800">
              Class Teacher
            </Heading>
            {classTeacher ? (
              <HStack gap={4} align="center">
                <Box
                  w={12}
                  h={12}
                  borderRadius="full"
                  bg="var(--primary)"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xl"
                  fontWeight="bold"
                >
                  {(classTeacher.profile?.full_name || "T").charAt(0)}
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontWeight="bold" fontSize="lg">
                    {classTeacher.profile?.full_name || classTeacher.username}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {classTeacher.email}
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    Ph: {classTeacher.profile?.phone_number || "N/A"}
                  </Text>
                </VStack>
              </HStack>
            ) : (
              <VStack align="stretch" gap={3}>
                <Text color="gray.500" fontSize="sm" fontStyle="italic">
                  No class teacher has been assigned to this class yet.
                </Text>
              </VStack>
            )}
          </Box>
          <Box p={6} borderRadius="3xl" className="glass-card" bg="white">
            <Heading size="md" mb={4}>
              Recent Activities
            </Heading>
            <VStack align="stretch" gap={4}>
              <HStack gap={3}>
                <Box p={2} borderRadius="lg" bg="green.50" color="green.500">
                  <Calendar size={16} />
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontSize="sm" fontWeight="bold">
                    Term 1 Exams Finished
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    2 days ago
                  </Text>
                </VStack>
              </HStack>
              <HStack gap={3}>
                <Box p={2} borderRadius="lg" bg="blue.50" color="blue.500">
                  <BookOpen size={16} />
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontSize="sm" fontWeight="bold">
                    New Subject Assigned: Physics
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    1 week ago
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </BaseDetailView>
  );
};

export default ClassDetail;
