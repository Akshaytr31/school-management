import React from "react";
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Badge,
  Heading,
} from "@chakra-ui/react";
import { BookOpen, LayoutGrid, Users, GraduationCap } from "lucide-react";
import BaseDetailView from "./BaseDetailView";

const SubjectDetail = ({
  subject,
  classes,
  teachers,
  departments,
  onBack,
  onEdit,
  onDelete,
}) => {
  if (!subject) return null;

  const department = departments.find((d) => d.id === subject.department);
  const subjectClasses = classes.filter((c) => subject.classes?.includes(c.id));
  const subjectTeachers = teachers.filter((t) =>
    t.subjects?.includes(subject.id),
  );

  return (
    <BaseDetailView
      title={subject.subject_name}
      subtitle={`${department?.department_name || "Unknown Department"} | ${subject.subject_type}`}
      onBack={onBack}
      onEdit={() => onEdit(subject)}
      onDelete={() => onDelete(subject.id)}
      icon={BookOpen}
    >
      <SimpleGrid columns={{ base: 1, lg: "1.5fr 1fr" }} gap={8}>
        {/* Classes Section */}
        <VStack align="stretch" gap={6}>
          <Box p={6} borderRadius="3xl" className="glass-card" bg="white">
            <VStack align="stretch" gap={4}>
              <Heading size="md">Assigned Teachers</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {subjectTeachers.map((teacher) => (
                  <HStack
                    key={teacher.id}
                    p={3}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.100"
                    bg="gray.50"
                  >
                    <Box p={2} borderRadius="lg" bg="white" color="green.500">
                      <Users size={16} />
                    </Box>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="bold" fontSize="sm">
                        {teacher.profile?.full_name || teacher.username}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {teacher.email}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
                {subjectTeachers.length === 0 && (
                  <Text color="gray.500" fontStyle="italic">
                    No teachers assigned to this subject yet.
                  </Text>
                )}
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>

        {/* Sidebar / Metadata */}
        <VStack align="stretch" gap={6}>
          <Box
            p={6}
            borderRadius="3xl"
            bg="purple.500"
            color="white"
            boxShadow="xl"
          >
            <VStack align="start" gap={4}>
              <Heading size="sm">Academic Specs</Heading>
              <VStack align="stretch" w="100%" gap={3}>
                <HStack justify="space-between">
                  <Text opacity={0.8} fontSize="sm">
                    Subject Type
                  </Text>
                  <Text fontWeight="bold">{subject.subject_type}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text opacity={0.8} fontSize="sm">
                    Department
                  </Text>
                  <Text fontWeight="bold">
                    {department?.department_name || "N/A"}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          <Box
            p={6}
            borderRadius="3xl"
            border="1px solid"
            borderColor="gray.200"
            bg="gray.50"
          >
            <VStack align="start" gap={3}>
              <HStack gap={2} color="purple.600">
                <GraduationCap size={20} />
                <Heading size="xs">Curriculum Focus</Heading>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                This subject covers core academic standards for the{" "}
                {subjectClasses[0]?.category || "assigned"} category. Syllabus
                status: <strong>Up to date</strong>.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </SimpleGrid>
    </BaseDetailView>
  );
};

export default SubjectDetail;
