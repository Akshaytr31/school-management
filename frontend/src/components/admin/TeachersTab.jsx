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
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Users, UserPlus, User, Trash2, ChevronRight } from "lucide-react";

const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

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
}) => {
  return (
    <MotionBox
      key="teachers"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Grid templateColumns={{ base: "1fr", lg: "0.6fr 0.4fr" }} gap={8}>
        {/* Add Teacher Form */}
        <Box p={6} borderRadius="2xl" className="glass-card">
          <VStack align="stretch" spaceY={6}>
            <HStack spaceX={3}>
              <Box bg="blue.50" p={2} borderRadius="lg" color="blue.500">
                <UserPlus size={20} />
              </Box>
              <Heading size="md">Register Teacher</Heading>
            </HStack>

            <form onSubmit={handleAddTeacher}>
              <VStack spaceY={4}>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  w="100%"
                  spaceX={4}
                >
                  <VStack align="start" flex={1} spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Username
                    </Text>
                    <Input
                      placeholder="e.g. johndoe"
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      required
                    />
                  </VStack>
                  <VStack align="start" flex={1} spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Password
                    </Text>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </VStack>
                </Stack>

                <Stack
                  direction={{ base: "column", md: "row" }}
                  w="100%"
                  spaceX={4}
                >
                  <VStack align="start" flex={1} spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Full Name
                    </Text>
                    <Input
                      placeholder="e.g. John Doe"
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      required
                    />
                  </VStack>
                  <VStack align="start" flex={1} spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Email
                    </Text>
                    <Input
                      type="email"
                      placeholder="john@school.com"
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </VStack>
                </Stack>

                <Stack
                  direction={{ base: "column", md: "row" }}
                  w="100%"
                  spaceX={4}
                >
                  <VStack align="start" flex={1} spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Qualification
                    </Text>
                    <Input
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      required
                    />
                  </VStack>
                  <VStack align="start" flex={1} spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Phone
                    </Text>
                    <Input
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </VStack>
                </Stack>

                <Stack
                  direction={{ base: "column", md: "row" }}
                  w="100%"
                  spaceX={4}
                >
                  <VStack align="start" flex={1} spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Gender
                    </Text>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "12px",
                        border: "none",
                        background: "white",
                        fontSize: "14px",
                        color: "#4A5568",
                      }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </VStack>
                  <VStack align="start" flex={1} spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Date of Birth
                    </Text>
                    <Input
                      type="date"
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </VStack>
                </Stack>

                <Stack
                  direction={{ base: "column", md: "row" }}
                  w="100%"
                  spaceX={4}
                >
                  <VStack align="start" flex={1} spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Experience
                    </Text>
                    <Input
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 5 Years"
                    />
                  </VStack>
                  <VStack align="start" flex={1} spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Joining Date
                    </Text>
                    <Input
                      type="date"
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                    />
                  </VStack>
                </Stack>

                <VStack align="start" w="100%" spaceY={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Address
                  </Text>
                  <Textarea
                    variant="subtle"
                    bg="white"
                    borderRadius="xl"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full Residence Address"
                    rows={3}
                  />
                </VStack>

                <Box w="100%">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.600"
                    mb={2}
                  >
                    Select Subjects
                  </Text>
                  <Box
                    border="1px solid var(--glass-border)"
                    borderRadius="xl"
                    p={3}
                    maxH="120px"
                    overflowY="auto"
                    bg="white"
                  >
                    {allSubjects.map((sub) => (
                      <HStack key={sub.id} mb={1}>
                        <input
                          type="checkbox"
                          id={`teacher-sub-${sub.id}`}
                          checked={selectedSubjects.includes(sub.id)}
                          onChange={() => handleSubjectChange(sub.id)}
                        />
                        <label
                          htmlFor={`teacher-sub-${sub.id}`}
                          style={{ fontSize: "13px" }}
                        >
                          {sub.subject_name}
                        </label>
                      </HStack>
                    ))}
                  </Box>
                </Box>

                <Button
                  type="submit"
                  bg="var(--primary)"
                  color="white"
                  w="100%"
                  py={6}
                  borderRadius="xl"
                  isLoading={loading}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(70, 101, 193, 0.2)",
                  }}
                >
                  Create Account
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>

        {/* Teacher Stats/List */}
        <VStack spaceY={6} align="stretch">
          <Box
            p={6}
            borderRadius="2xl"
            className="glass-card"
            bg="linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)"
            color="white"
          >
            <VStack align="start" spaceY={4}>
              <Heading size="md">Teacher Directory</Heading>
              <Text opacity={0.8}>
                Manage all registered teachers and their access credentials from
                this panel.
              </Text>
              <HStack spaceX={4}>
                <VStack align="center">
                  <Heading size="lg">{teachers.length}</Heading>
                  <Text fontSize="xs" opacity={0.7}>
                    Active Teachers
                  </Text>
                </VStack>
                <Separator orientation="vertical" h="40px" />
                <VStack align="center">
                  <Heading size="lg">{allSubjects.length}</Heading>
                  <Text fontSize="xs" opacity={0.7}>
                    Subjects Offered
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          <Box p={6} borderRadius="2xl" className="glass-card">
            <Heading size="sm" mb={4}>
              Detailed List
            </Heading>
            {teachers.map((teacher, idx) => (
              <MotionHStack
                key={teacher.id}
                p={3}
                borderRadius="xl"
                _hover={{ bg: "rgba(0,0,0,0.02)" }}
                justify="space-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <HStack spaceX={3}>
                  <Box
                    w={10}
                    h={10}
                    borderRadius="full"
                    bg="gray.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <User size={20} color="gray" />
                  </Box>
                  <VStack align="start" spaceY={0}>
                    <Text fontWeight="bold" fontSize="sm">
                      {teacher.profile?.full_name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {teacher.email}
                    </Text>
                  </VStack>
                </HStack>
                <HStack spaceX={1}>
                  <IconButton
                    size="xs"
                    variant="ghost"
                    color="red.500"
                    _hover={{ bg: "red.50" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTeacher(teacher.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                  <IconButton size="xs" variant="ghost">
                    <ChevronRight size={14} />
                  </IconButton>
                </HStack>
              </MotionHStack>
            ))}
          </Box>
        </VStack>
      </Grid>
    </MotionBox>
  );
};

export default TeachersTab;
