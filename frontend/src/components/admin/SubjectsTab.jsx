import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  Text,
  VStack,
  Input,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Book, Trash2, ChevronRight } from "lucide-react";

const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

const SubjectsTab = ({
  allSubjects,
  departments,
  classes,
  loading,
  handleAddSubject,
  handleDeleteSubject,
  // Form states
  newSubjectName,
  setNewSubjectName,
  newSubjectType,
  setNewSubjectType,
  newSubjectDept,
  setNewSubjectDept,
  newSubjectClass,
  setNewSubjectClass,
}) => {
  return (
    <MotionBox
      key="subjects"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Grid templateColumns={{ base: "1fr", lg: "0.4fr 0.6fr" }} gap={8}>
        {/* Add Subject Form */}
        <Box p={6} borderRadius="2xl" className="glass-card">
          <VStack align="stretch" spaceY={6}>
            <HStack spaceX={3}>
              <Box bg="purple.50" p={2} borderRadius="lg" color="purple.500">
                <Plus size={20} />
              </Box>
              <Heading size="md">Add New Subject</Heading>
            </HStack>
            <form onSubmit={handleAddSubject}>
              <VStack spaceY={4}>
                <VStack align="start" w="100%" spaceY={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Subject Name
                  </Text>
                  <Input
                    placeholder="e.g. Mathematics"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    variant="subtle"
                    bg="white"
                    borderRadius="xl"
                    py={6}
                    required
                  />
                </VStack>

                <VStack align="start" w="100%" spaceY={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Subject Type
                  </Text>
                  <Input
                    placeholder="e.g. Core, Elective"
                    value={newSubjectType}
                    onChange={(e) => setNewSubjectType(e.target.value)}
                    variant="subtle"
                    bg="white"
                    borderRadius="xl"
                    py={6}
                    required
                  />
                </VStack>

                <VStack align="start" w="100%" spaceY={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Department
                  </Text>
                  <select
                    value={newSubjectDept}
                    onChange={(e) => setNewSubjectDept(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid var(--glass-border)",
                      background: "white",
                    }}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                </VStack>

                <VStack align="start" w="100%" spaceY={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Class
                  </Text>
                  <select
                    value={newSubjectClass}
                    onChange={(e) => setNewSubjectClass(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid var(--glass-border)",
                      background: "white",
                    }}
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name} - {cls.division}
                      </option>
                    ))}
                  </select>
                </VStack>

                <Button
                  type="submit"
                  bg="var(--primary)"
                  color="white"
                  w="100%"
                  py={6}
                  borderRadius="xl"
                  isLoading={loading}
                >
                  Create Subject
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>

        {/* Subjects List */}
        <Box p={6} borderRadius="2xl" className="glass-card">
          <VStack align="stretch" spaceY={6}>
            <HStack justify="space-between">
              <HStack spaceX={3}>
                <Box bg="purple.50" p={2} borderRadius="lg" color="purple.500">
                  <BookOpen size={20} />
                </Box>
                <Heading size="md">All Subjects</Heading>
              </HStack>
              <Badge colorPalette="purple" variant="subtle" borderRadius="lg">
                {allSubjects.length} Total
              </Badge>
            </HStack>

            <Box overflowY="auto" maxH="600px">
              {allSubjects.map((sub, idx) => (
                <MotionHStack
                  key={sub.id}
                  p={4}
                  borderRadius="xl"
                  _hover={{ bg: "rgba(0,0,0,0.02)" }}
                  justify="space-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  borderBottom="1px solid"
                  borderColor="gray.50"
                >
                  <HStack spaceX={4}>
                    <Box bg="gray.50" p={2} borderRadius="lg">
                      <Book size={18} color="#6B46C1" />
                    </Box>
                    <VStack align="start" spaceY={0}>
                      <Text fontWeight="bold">{sub.subject_name}</Text>
                      <HStack>
                        <Badge size="sm" variant="outline" colorPalette="gray">
                          {sub.subject_type}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          ID: #{sub.id}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  <HStack>
                    <IconButton
                      size="xs"
                      variant="ghost"
                      color="red.500"
                      _hover={{ bg: "red.50" }}
                      onClick={() => handleDeleteSubject(sub.id)}
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
        </Box>
      </Grid>
    </MotionBox>
  );
};

export default SubjectsTab;
