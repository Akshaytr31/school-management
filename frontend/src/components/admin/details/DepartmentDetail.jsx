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
import { Building2, LayoutGrid, BookOpen, Users } from "lucide-react";
import BaseDetailView from "./BaseDetailView";

const EntityCard = ({ icon: Icon, title, subtitle, count, color = "blue" }) => (
  <HStack
    p={4}
    borderRadius="2xl"
    border="1px solid"
    borderColor="gray.100"
    bg="white"
    _hover={{ boxShadow: "md", borderColor: `${color}.200` }}
    transition="0.2s"
    justify="space-between"
    cursor="pointer"
  >
    <HStack gap={4}>
      <Box p={2} borderRadius="xl" bg={`${color}.50`} color={`${color}.500`}>
        <Icon size={20} />
      </Box>
      <VStack align="start" gap={0}>
        <Text fontWeight="bold" color="gray.800">
          {title}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {subtitle}
        </Text>
      </VStack>
    </HStack>
    {count !== undefined && (
      <Badge colorPalette={color} variant="subtle" borderRadius="full px-3">
        {count}
      </Badge>
    )}
  </HStack>
);

const DepartmentDetail = ({
  department,
  classes,
  subjects,
  onBack,
  onEdit,
  onDelete,
}) => {
  if (!department) return null;

  const departmentClasses = classes.filter(
    (c) => c.department === department.id,
  );
  const departmentSubjects = subjects.filter(
    (s) => s.department === department.id,
  );

  return (
    <BaseDetailView
      title={department.department_name}
      subtitle={`Created on ${new Date(department.created_at).toLocaleDateString()}`}
      onBack={onBack}
      onEdit={() => onEdit(department)}
      onDelete={() => onDelete(department.id)}
      icon={Building2}
    >
      <VStack align="stretch" gap={10}>
        {/* Classes Section */}
        <Box>
          <HStack justify="space-between" mb={6}>
            <VStack align="start" gap={0}>
              <Heading size="md">Associated Classes</Heading>
              <Text fontSize="sm" color="gray.500">
                Classes currently operating under this department.
              </Text>
            </VStack>
            <Badge
              colorPalette="green"
              variant="solid"
              px={3}
              py={1}
              borderRadius="full"
            >
              {departmentClasses.length} Total
            </Badge>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {departmentClasses.map((cls) => (
              <EntityCard
                key={cls.id}
                icon={LayoutGrid}
                title={cls.class_name}
                subtitle={cls.category}
                color="blue"
              />
            ))}
            {departmentClasses.length === 0 && (
              <Box
                gridColumn="span 3"
                py={10}
                textAlign="center"
                borderRadius="2xl"
                border="1px dashed"
                borderColor="gray.200"
              >
                <Text color="gray.400">
                  No classes found in this department.
                </Text>
              </Box>
            )}
          </SimpleGrid>
        </Box>

        {/* Subjects Section */}
        <Box>
          <HStack justify="space-between" mb={6}>
            <VStack align="start" gap={0}>
              <Heading size="md">Departmental Subjects</Heading>
              <Text fontSize="sm" color="gray.500">
                Curriculum items registered to this department.
              </Text>
            </VStack>
            <Badge
              colorPalette="purple"
              variant="solid"
              px={3}
              py={1}
              borderRadius="full"
            >
              {departmentSubjects.length} Total
            </Badge>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {departmentSubjects.map((sub) => (
              <EntityCard
                key={sub.id}
                icon={BookOpen}
                title={sub.subject_name}
                subtitle={sub.subject_type}
                color="purple"
              />
            ))}
            {departmentSubjects.length === 0 && (
              <Box
                gridColumn="span 3"
                py={10}
                textAlign="center"
                borderRadius="2xl"
                border="1px dashed"
                borderColor="gray.200"
              >
                <Text color="gray.400">
                  No subjects found in this department.
                </Text>
              </Box>
            )}
          </SimpleGrid>
        </Box>
      </VStack>
    </BaseDetailView>
  );
};

export default DepartmentDetail;
