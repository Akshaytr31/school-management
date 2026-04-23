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
  Flex,
  Table,
  Spinner,
  Separator,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Users,
} from "lucide-react";

const MotionBox = motion(Box);

const ClassesTab = ({
  classes,
  departments,
  selectedClass,
  setSelectedClass,
  selectedClassStudents,
  viewingStudents,
  setViewingStudents,
  selectedClassGroup,
  loadingStudents,
  loading,
  handleAddClass,
  handleDeleteClass,
  fetchClassStudents,
  // Form states
  newClassName,
  setNewClassName,
  newClassDept,
  setNewClassDept,
  newClassDivision,
  setNewClassDivision,
  newClassCategory,
  setNewClassCategory,
}) => {
  return (
    <MotionBox
      key="classes"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {!viewingStudents ? (
        <Grid templateColumns={{ base: "1fr", lg: "0.6fr 0.4fr" }} gap={8}>
          {/* Classes Content */}
          <Box p={6} borderRadius="2xl" className="glass-card">
            <VStack align="stretch" spaceY={6}>
              <HStack justify="space-between">
                <HStack spaceX={3}>
                  <Box bg="blue.50" p={2} borderRadius="lg" color="blue.500">
                    <GraduationCap size={20} />
                  </Box>
                  <VStack align="start" spaceY={0}>
                    <Heading size="md">
                      {selectedClassGroup
                        ? `${selectedClassGroup} Divisions`
                        : "All Classes"}
                    </Heading>
                    {selectedClassGroup && (
                      <Text fontSize="xs" color="gray.500">
                        Select a division to view students
                      </Text>
                    )}
                  </VStack>
                </HStack>
                <Badge colorPalette="blue" variant="subtle" borderRadius="lg">
                  {selectedClassGroup
                    ? classes.filter((c) => c.class_name === selectedClassGroup)
                        .length
                    : classes.length}{" "}
                  Total
                </Badge>
              </HStack>

              <Box overflowX="auto" w="100%">
                {(selectedClassGroup
                  ? classes.filter((c) => c.class_name === selectedClassGroup)
                  : classes
                ).length > 0 ? (
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    }}
                    gap={4}
                    w="100%"
                  >
                    {(selectedClassGroup
                      ? classes.filter(
                          (c) => c.class_name === selectedClassGroup,
                        )
                      : classes
                    ).map((cls) => (
                      <MotionBox
                        key={cls.id}
                        p={4}
                        borderRadius="xl"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.100"
                        _hover={{
                          borderColor: "var(--primary)",
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                        }}
                        transition="0.3s"
                        cursor="pointer"
                        onClick={() => {
                          setSelectedClass(cls);
                          fetchClassStudents(cls.id);
                        }}
                      >
                        <VStack align="stretch" spaceY={3}>
                          <HStack justify="space-between">
                            <Box
                              p={1.5}
                              bg="blue.50"
                              borderRadius="md"
                              color="blue.500"
                            >
                              <GraduationCap size={16} />
                            </Box>
                            <IconButton
                              size="xs"
                              variant="ghost"
                              color="red.500"
                              _hover={{ bg: "red.50" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClass(cls.id);
                              }}
                            >
                              <Trash2 size={12} />
                            </IconButton>
                          </HStack>

                          <VStack align="start" spaceY={0.5}>
                            <Heading
                              size="xs"
                              color="gray.700"
                              fontWeight="bold"
                            >
                              {cls.class_name}
                            </Heading>
                            <HStack spaceX={1}>
                              <Badge
                                colorPalette="blue"
                                variant="subtle"
                                fontSize="10px"
                              >
                                Div: {cls.division || "N/A"}
                              </Badge>
                              <Badge
                                colorPalette="purple"
                                variant="subtle"
                                fontSize="10px"
                              >
                                {cls.category || "Primary"}
                              </Badge>
                            </HStack>
                          </VStack>

                          <HStack
                            justify="space-between"
                            pt={1.5}
                            borderTop="1px solid"
                            borderColor="gray.50"
                          >
                            <Text fontSize="10px" color="gray.400">
                              ID: #{cls.id}
                            </Text>
                            <Button
                              size="xs"
                              variant="ghost"
                              color="var(--primary)"
                              fontWeight="semibold"
                              fontSize="xs"
                              h="auto"
                              p={0}
                            >
                              View <ChevronRight size={10} />
                            </Button>
                          </HStack>
                        </VStack>
                      </MotionBox>
                    ))}
                  </Grid>
                ) : (
                  <Flex direction="column" align="center" py={12}>
                    <Users size={48} color="#CBD5E0" />
                    <Text color="gray.400" mt={4}>
                      No classes found in this category.
                    </Text>
                  </Flex>
                )}
              </Box>
            </VStack>
          </Box>

          {/* Add Class Form */}
          <Box p={8} borderRadius="2xl" className="glass-card">
            <VStack align="stretch" spaceY={6}>
              <HStack spaceX={3}>
                <Box bg="blue.50" p={2} borderRadius="lg" color="blue.500">
                  <Plus size={20} />
                </Box>
                <Heading size="md">Add New Class</Heading>
              </HStack>
              <form onSubmit={handleAddClass}>
                <VStack spaceY={4}>
                  <VStack align="start" w="100%" spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Class Name
                    </Text>
                    <Input
                      placeholder="e.g. Class 10th"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      py={6}
                      required
                    />
                  </VStack>

                  <VStack align="start" w="100%" spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Division
                    </Text>
                    <Input
                      placeholder="e.g. A"
                      value={newClassDivision}
                      onChange={(e) => setNewClassDivision(e.target.value)}
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      py={6}
                      required
                    />
                  </VStack>

                  <VStack align="start" w="100%" spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Class Category
                    </Text>
                    <select
                      value={newClassCategory}
                      onChange={(e) => setNewClassCategory(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        border: "1px solid var(--glass-border)",
                        background: "white",
                      }}
                    >
                      <option value="Senior Secondary">Senior Secondary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Middle">Middle</option>
                      <option value="Primary">Primary</option>
                      <option value="Pre Primary">Pre Primary</option>
                    </select>
                  </VStack>

                  <VStack align="start" w="100%" spaceY={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Department
                    </Text>
                    <select
                      value={newClassDept}
                      onChange={(e) => setNewClassDept(e.target.value)}
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
                    Create Class
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        </Grid>
      ) : (
        <Box p={8} borderRadius="2xl" className="glass-card">
          <VStack align="stretch" spaceY={8}>
            <HStack justify="space-between">
              <HStack spaceX={4}>
                <Button
                  variant="ghost"
                  p={0}
                  _hover={{ bg: "transparent", color: "var(--primary)" }}
                  onClick={() => setViewingStudents(false)}
                >
                  <ChevronLeft size={24} />
                </Button>
                <Separator orientation="vertical" h="30px" />
                <VStack align="start" spaceY={0}>
                  <HStack>
                    <Heading size="lg" color="var(--primary-dark)">
                      {selectedClass?.class_name}
                    </Heading>
                    <Badge colorPalette="blue" variant="subtle" size="lg">
                      Division {selectedClass?.division}
                    </Badge>
                  </HStack>
                  <Text color="gray.500" fontSize="sm">
                    Student Enrollment Records
                  </Text>
                </VStack>
              </HStack>
              <Badge
                colorPalette="green"
                variant="solid"
                borderRadius="full"
                px={4}
                py={1}
              >
                {selectedClassStudents.length} Students Enrolled
              </Badge>
            </HStack>

            <Box overflowX="auto">
              {loadingStudents ? (
                <Flex justify="center" py={20}>
                  <Spinner size="xl" color="var(--primary)" thickness="4px" />
                </Flex>
              ) : selectedClassStudents.length > 0 ? (
                <Table.Root variant="simple">
                  <Table.Header>
                    <Table.Row borderBottom="2px solid var(--glass-border)">
                      <Table.ColumnHeader color="gray.600">
                        Admission No
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color="gray.600">
                        Full Name
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color="gray.600">
                        Gender
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color="gray.600">
                        Category
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {selectedClassStudents.map((student) => (
                      <Table.Row
                        key={student.id}
                        _hover={{ bg: "rgba(70, 101, 193, 0.05)" }}
                        transition="0.2s"
                      >
                        <Table.Cell fontWeight="bold" color="var(--primary)">
                          {student.admission_number}
                        </Table.Cell>
                        <Table.Cell fontWeight="medium">
                          {student.first_name} {student.last_name}
                        </Table.Cell>
                        <Table.Cell>{student.gender}</Table.Cell>
                        <Table.Cell>
                          <Badge colorPalette="blue" variant="outline">
                            {student.category || "Regular"}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              ) : (
                <Flex direction="column" align="center" py={20}>
                  <Users size={64} color="#CBD5E0" />
                  <Text fontSize="lg" color="gray.400" mt={4}>
                    No students found in this class.
                  </Text>
                </Flex>
              )}
            </Box>
          </VStack>
        </Box>
      )}
    </MotionBox>
  );
};

export default ClassesTab;
