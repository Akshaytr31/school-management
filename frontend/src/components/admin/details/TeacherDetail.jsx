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
} from "@chakra-ui/react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  MapPin,
  Briefcase,
  BookOpen,
} from "lucide-react";
import BaseDetailView from "./BaseDetailView";

const InfoCard = ({ icon: Icon, label, value, color = "blue.500" }) => (
  <HStack gap={4} p={4} borderRadius="2xl" bg="gray.50" flex={1}>
    <Box p={2} borderRadius="xl" bg="white" color={color} boxShadow="sm">
      <Icon size={20} />
    </Box>
    <VStack align="start" gap={0}>
      <Text
        fontSize="xs"
        color="gray.500"
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {label}
      </Text>
      <Text fontWeight="bold" color="gray.800">
        {value || "N/A"}
      </Text>
    </VStack>
  </HStack>
);

const TeacherDetail = ({ teacher, allSubjects, onBack, onEdit, onDelete }) => {
  if (!teacher) return null;

  const profile = teacher.profile || {};

  // Filter subjects assigned to this teacher
  const assignedSubjects = allSubjects.filter((sub) =>
    teacher.subjects?.includes(sub.id),
  );

  return (
    <BaseDetailView
      title={profile.full_name || teacher.username}
      subtitle={`Teacher ID: #${teacher.id}`}
      onBack={onBack}
      onEdit={() => onEdit(teacher)}
      onDelete={() => onDelete(teacher.id)}
      icon={User}
    >
      <SimpleGrid columns={{ base: 1, lg: "2fr 1fr" }} gap={8}>
        {/* Profile Info */}
        <VStack align="stretch" gap={6}>
          <Box p={6} borderRadius="3xl" className="glass-card" bg="white">
            <VStack align="stretch" gap={6}>
              <Heading size="md">Professional Information</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <InfoCard
                  icon={Mail}
                  label="Email Address"
                  value={teacher.email}
                />
                <InfoCard
                  icon={Phone}
                  label="Phone Number"
                  value={profile.phone_number}
                />
                <InfoCard
                  icon={GraduationCap}
                  label="Qualification"
                  value={profile.qualification}
                />
                <InfoCard
                  icon={Briefcase}
                  label="Experience"
                  value={profile.experience}
                />
                <InfoCard
                  icon={Calendar}
                  label="Date of Birth"
                  value={profile.dob}
                />
                <InfoCard
                  icon={Calendar}
                  label="Joining Date"
                  value={profile.joining_date}
                />
              </SimpleGrid>

              <Separator />

              <VStack align="start" gap={2}>
                <HStack gap={2} color="gray.600">
                  <MapPin size={18} />
                  <Text fontWeight="bold">Resident Address</Text>
                </HStack>
                <Text color="gray.700" pl={7}>
                  {profile.address || "No address provided"}
                </Text>
              </VStack>
            </VStack>
          </Box>

          <Box p={6} borderRadius="3xl" className="glass-card" bg="white">
            <VStack align="stretch" gap={4}>
              <HStack justify="space-between">
                <Heading size="md">Subject Assignments</Heading>
                <Badge colorPalette="blue" variant="solid">
                  {assignedSubjects.length} Subjects
                </Badge>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {assignedSubjects.map((sub) => (
                  <HStack
                    key={sub.id}
                    p={3}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.100"
                    bg="gray.50"
                  >
                    <Box p={2} borderRadius="lg" bg="white" color="blue.500">
                      <BookOpen size={16} />
                    </Box>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="bold" fontSize="sm">
                        {sub.subject_name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Code: {sub.subject_code || "N/A"}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
                {assignedSubjects.length === 0 && (
                  <Text color="gray.500" fontStyle="italic">
                    No subjects assigned yet.
                  </Text>
                )}
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>

        {/* Stats / Quick Actions Sidebar */}
        <VStack align="stretch" gap={6}>
          <Box
            p={6}
            borderRadius="3xl"
            bg="var(--primary)"
            color="white"
            boxShadow="xl"
          >
            <VStack align="start" gap={4}>
              <Heading size="sm">Account Summary</Heading>
              <VStack align="stretch" w="100%" gap={3}>
                <HStack justify="space-between">
                  <Text opacity={0.8} fontSize="sm">
                    Username
                  </Text>
                  <Text fontWeight="bold">{teacher.username}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text opacity={0.8} fontSize="sm">
                    Status
                  </Text>
                  <Badge
                    bg="green.400"
                    color="white"
                    borderRadius="full"
                    px={3}
                  >
                    Active
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text opacity={0.8} fontSize="sm">
                    Last Login
                  </Text>
                  <Text fontWeight="bold">Today</Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          <Box
            p={6}
            borderRadius="3xl"
            className="glass-card"
            border="1px dashed"
            borderColor="gray.300"
          >
            <VStack align="center" gap={3} py={4}>
              <Box p={3} borderRadius="full" bg="gray.100" color="gray.400">
                <BookOpen size={32} />
              </Box>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Detailed academic performance metrics will appear here once
                synchronized.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </SimpleGrid>
    </BaseDetailView>
  );
};

export default TeacherDetail;
