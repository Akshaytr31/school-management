import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  Text,
  VStack,
  Input,
  Stack,
  Textarea,
  Separator,
  IconButton,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  User,
  Trash2,
  ChevronRight,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../ui/dialog";

const MotionBox = motion.create(Box);

const TeachersTab = ({
  teachers,
  allSubjects,
  loading,
  handleAddTeacher,
  handleDeleteTeacher,
  handleSubjectChange,
  // Form states
  newUsername,
  setNewUsername,
  newPassword,
  setNewPassword,
  newFullName,
  setNewFullName,
  newEmail,
  setNewEmail,
  phoneNumber,
  setPhoneNumber,
  qualification,
  setQualification,
  gender,
  setGender,
  dob,
  setDob,
  experience,
  setExperience,
  joiningDate,
  setJoiningDate,
  address,
  setAddress,
  selectedSubjects,
  isOpen,
  setIsOpen,
  isEditMode,
  onCardClick,
}) => {
  return (
    <MotionBox
      key="teachers"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <VStack align="stretch" gap={6}>
        {/* Header & Stats Section */}
        <Box
          p={6}
          borderRadius="2xl"
          className="glass-card"
          bg="linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)"
          color="white"
        >
          <HStack justify="space-between" flexWrap="wrap" gap={6}>
            <VStack align="start" gap={2} flex={1}>
              <HStack gap={3}>
                <Box bg="whiteAlpha.200" p={2} borderRadius="lg">
                  <Users size={24} />
                </Box>
                <Heading size="lg">Teacher Directory</Heading>
              </HStack>
              <Text opacity={0.9} maxW="600px">
                Manage your academic staff, their credentials, and subject
                assignments from this central hub.
              </Text>
              <HStack gap={8} pt={2}>
                <VStack align="start" gap={0}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {teachers.length}
                  </Text>
                  <Text
                    fontSize="xs"
                    opacity={0.7}
                    fontWeight="medium"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Registered Teachers
                  </Text>
                </VStack>
                <Separator
                  orientation="vertical"
                  h="40px"
                  borderColor="whiteAlpha.300"
                />
                <VStack align="start" gap={0}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {allSubjects.length}
                  </Text>
                  <Text
                    fontSize="xs"
                    opacity={0.7}
                    fontWeight="medium"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Active Subjects
                  </Text>
                </VStack>
              </HStack>
            </VStack>
            <Button
              size="lg"
              bg="white"
              color="var(--primary)"
              px={8}
              borderRadius="xl"
              fontWeight="bold"
              onClick={() => setIsOpen(true)}
              _hover={{ bg: "gray.100", transform: "translateY(-2px)" }}
              _active={{ transform: "translateY(0)" }}
            >
              <HStack gap={2}>
                <UserPlus size={20} />
                <Text>Add New Teacher</Text>
              </HStack>
            </Button>
          </HStack>
        </Box>

        {/* Teachers Grid */}
        <Box
          p={6}
          borderRadius="2xl"
          className="glass-card"
          minH="calc(100vh - 350px)"
        >
          <VStack align="stretch" gap={6}>
            <Heading size="md" color="gray.700">
              Detailed Faculty List
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
              {teachers.map((teacher, idx) => (
                <MotionBox
                  key={teacher.id}
                  p={5}
                  borderRadius="2xl"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.100"
                  boxShadow="sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  cursor="pointer"
                  onClick={() => onCardClick(teacher)}
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "md",
                    borderColor: "var(--primary-light)",
                  }}
                >
                  <VStack align="stretch" gap={4}>
                    <HStack justify="space-between">
                      <HStack gap={3}>
                        <Box
                          w={12}
                          h={12}
                          borderRadius="full"
                          bg="blue.50"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <User size={24} color="#3182CE" />
                        </Box>
                        <VStack align="start" gap={0}>
                          <Text fontWeight="bold" fontSize="md" noOfLines={1}>
                            {teacher.profile?.full_name || teacher.username}
                          </Text>
                          <Badge size="xs" colorPalette="blue" variant="subtle">
                            ID: #{teacher.id}
                          </Badge>
                        </VStack>
                      </HStack>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        color="red.500"
                        _hover={{ bg: "red.50" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTeacher(teacher.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </HStack>

                    <Separator />

                    <VStack align="start" gap={2}>
                      <HStack gap={2} color="gray.600">
                        <Mail size={14} />
                        <Text fontSize="xs" noOfLines={1}>
                          {teacher.email}
                        </Text>
                      </HStack>
                      <HStack gap={2} color="gray.600">
                        <Phone size={14} />
                        <Text fontSize="xs">
                          {teacher.profile?.phone_number || "N/A"}
                        </Text>
                      </HStack>
                      <HStack gap={2} color="gray.600">
                        <GraduationCap size={14} />
                        <Text fontSize="xs" noOfLines={1}>
                          {teacher.profile?.qualification || "N/A"}
                        </Text>
                      </HStack>
                    </VStack>

                    <HStack justify="flex-end" pt={2}>
                      <Button size="xs" variant="ghost" color="var(--primary)">
                        <HStack gap={1}>
                          <Text>View Profile</Text>
                          <ChevronRight size={14} />
                        </HStack>
                      </Button>
                    </HStack>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>
      </VStack>
    </MotionBox>
  );
};

export default TeachersTab;
