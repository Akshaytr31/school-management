import { useState } from "react";
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
  SimpleGrid,
  Spinner,
  Separator,
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogActionTrigger,
} from "../ui/dialog";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Users,
} from "lucide-react";

const MotionBox = motion.create(Box);

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
  isOpen,
  setIsOpen,
  isEditMode,
  onCardClick,
}) => {
  const handleSubmit = (e) => {
    handleAddClass(e);
  };

  return (
    <MotionBox
      key="classes"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {!viewingStudents ? (
        <VStack align="stretch" gap={6}>
          {/* Classes Content */}
          <Box
            p={6}
            borderRadius="2xl"
            className="glass-card"
            minH="calc(100vh - 120px)"
          >
            <VStack align="stretch" gap={6} w="100%">
              <HStack justify="space-between" flexWrap="wrap" gap={4}>
                <HStack gap={3}>
                  <Box bg="blue.50" p={2} borderRadius="lg" color="blue.500">
                    <GraduationCap size={20} />
                  </Box>
                  <VStack align="start" gap={0}>
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
                <HStack gap={4}>
                  <Badge
                    colorPalette="blue"
                    variant="subtle"
                    borderRadius="lg"
                    px={3}
                    py={1}
                  >
                    {selectedClassGroup
                      ? classes.filter(
                          (c) => c.class_name === selectedClassGroup,
                        ).length
                      : classes.length}{" "}
                    Total
                  </Badge>
                  <Button
                    size="sm"
                    bg="var(--primary)"
                    color="white"
                    onClick={() => setIsOpen(true)}
                    borderRadius="xl"
                    px={6}
                    _hover={{
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(70, 101, 193, 0.2)",
                    }}
                  >
                    <Plus size={16} /> Add Class
                  </Button>
                </HStack>
              </HStack>

              <Box w="100%" overflowX="hidden">
                {(selectedClassGroup
                  ? classes.filter((c) => c.class_name === selectedClassGroup)
                  : classes
                ).length > 0 ? (
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(3, 1fr)",
                      xl: "repeat(4, 1fr)",
                    }}
                    gap={6}
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
                        p={5}
                        borderRadius="2xl"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.100"
                        _hover={{
                          borderColor: "var(--primary)",
                          transform: "translateY(-4px)",
                          boxShadow: "2xl",
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        cursor="pointer"
                        onClick={() => onCardClick(cls)}
                      >
                        <VStack align="stretch" gap={4}>
                          <HStack justify="space-between">
                            <Box
                              p={2}
                              bg="blue.50"
                              borderRadius="xl"
                              color="blue.500"
                            >
                              <GraduationCap size={18} />
                            </Box>
                            <IconButton
                              size="xs"
                              variant="ghost"
                              color="red.400"
                              _hover={{ bg: "red.50", color: "red.600" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClass(cls.id);
                              }}
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </HStack>

                          <VStack align="start" gap={1}>
                            <Heading
                              size="xs"
                              color="gray.800"
                              fontWeight="bold"
                              letterSpacing="tight"
                            >
                              {cls.class_name}
                            </Heading>
                            <HStack gap={2}>
                              <Badge
                                colorPalette="blue"
                                variant="subtle"
                                fontSize="10px"
                                px={2}
                              >
                                Division {cls.division || "N/A"}
                              </Badge>
                              <Badge
                                colorPalette="purple"
                                variant="subtle"
                                fontSize="10px"
                                px={2}
                              >
                                {cls.category}
                              </Badge>
                            </HStack>
                          </VStack>

                          <HStack
                            justify="space-between"
                            pt={3}
                            borderTop="1px solid"
                            borderColor="gray.50"
                          >
                            <Text
                              fontSize="10px"
                              color="gray.400"
                              fontWeight="medium"
                            >
                              ID: #{cls.id}
                            </Text>
                            <Button
                              size="xs"
                              variant="ghost"
                              color="var(--primary)"
                              fontWeight="bold"
                              fontSize="xs"
                              h="auto"
                              p={0}
                              _hover={{
                                bg: "transparent",
                                color: "var(--primary-dark)",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClass(cls);
                                fetchClassStudents(cls.id);
                              }}
                            >
                              View Students <ChevronRight size={12} />
                            </Button>
                          </HStack>
                        </VStack>
                      </MotionBox>
                    ))}
                  </Grid>
                ) : (
                  <Flex
                    direction="column"
                    align="center"
                    py={20}
                    bg="gray.50"
                    borderRadius="2xl"
                  >
                    <Users size={64} color="#CBD5E0" />
                    <Heading size="sm" mt={6} color="gray.500">
                      No Divisions Found
                    </Heading>
                    <Text color="gray.400" mt={2}>
                      This category currently has no divisions set up.
                    </Text>
                  </Flex>
                )}
              </Box>
            </VStack>
          </Box>
        </VStack>
      ) : (
        <Box
          p={8}
          borderRadius="2xl"
          className="glass-card"
          minH="calc(100vh - 120px)"
        >
          <VStack align="stretch" gap={8} w="100%">
            <HStack justify="space-between">
              <HStack gap={4}>
                <Button
                  variant="ghost"
                  p={0}
                  _hover={{ bg: "transparent", color: "var(--primary)" }}
                  onClick={() => setViewingStudents(false)}
                >
                  <ChevronLeft size={24} />
                </Button>
                <Separator orientation="vertical" h="30px" />
                <VStack align="start" gap={0}>
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

            <Box w="100%" overflowX="hidden">
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
