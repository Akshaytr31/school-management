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
  IconButton,
  Badge,
  Spinner,
  Separator,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  Plus,
  Search,
  Settings,
  Key,
  Calendar,
  Phone,
  Mail,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  ChevronRight,
  UserPlus,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import api from "../api";

const MotionBox = motion(Box);
const MotionHStack = motion(HStack);
const MotionVStack = motion(VStack);

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [qualification, setQualification] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [experience, setExperience] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Subject creation fields
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectType, setNewSubjectType] = useState("");
  const [newSubjectDept, setNewSubjectDept] = useState("");
  const [newSubjectClass, setNewSubjectClass] = useState("");

  // Class creation fields
  const [newClassName, setNewClassName] = useState("");
  const [newClassDept, setNewClassDept] = useState("");

  // Department creation fields
  const [newDeptName, setNewDeptName] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const response = await api.get("teachers/");
      setTeachers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("subjects/");
      setAllSubjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("departments/");
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get("classes/");
      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setFetchLoading(true);
      await Promise.all([
        fetchTeachers(),
        fetchSubjects(),
        fetchDepartments(),
        fetchClasses(),
      ]);
      setFetchLoading(false);
    };
    loadData();
  }, []);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    const teacherData = {
      username,
      password,
      email,
      profile: {
        full_name: fullName,
        qualification,
        phone_number: phoneNumber,
        address,
        gender,
        date_of_birth: dob,
        experience,
        joining_date: joiningDate,
        subjects: selectedSubjects,
      },
    };
    try {
      await api.post("teachers/", teacherData);
      setUsername("");
      setPassword("");
      setEmail("");
      setFullName("");
      setQualification("");
      setPhoneNumber("");
      setAddress("");
      setGender("Male");
      setDob("");
      setExperience("");
      setJoiningDate("");
      setSelectedSubjects([]);
      fetchTeachers();
      alert("Teacher account created successfully!");
    } catch (error) {
      alert("Error creating teacher account");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("subjects/", {
        subject_name: newSubjectName,
        subject_type: newSubjectType,
        department: newSubjectDept,
        class_name: newSubjectClass,
      });
      setNewSubjectName("");
      setNewSubjectType("");
      setNewSubjectDept("");
      setNewSubjectClass("");
      fetchSubjects();
      alert("Subject created successfully!");
    } catch (error) {
      alert("Error creating subject");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("classes/", {
        class_name: newClassName,
        department: newClassDept,
      });
      setNewClassName("");
      setNewClassDept("");
      fetchClasses();
      alert("Class created successfully!");
    } catch (error) {
      alert("Error creating class");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;
    try {
      await api.delete(`teachers/${id}/`);
      fetchTeachers();
      alert("Teacher deleted successfully!");
    } catch (error) {
      if (error.response?.status === 404) {
        alert("This teacher has already been deleted.");
        fetchTeachers();
      } else {
        alert("Error deleting teacher");
      }
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;
    try {
      await api.delete(`subjects/${id}/`);
      fetchSubjects();
      alert("Subject deleted successfully!");
    } catch (error) {
      if (error.response?.status === 404) {
        alert("This subject has already been deleted.");
        fetchSubjects();
      } else {
        alert("Error deleting subject");
      }
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await api.delete(`classes/${id}/`);
      fetchClasses();
      alert("Class deleted successfully!");
    } catch (error) {
      if (error.response?.status === 404) {
        alert("This class has already been deleted.");
        fetchClasses();
      } else {
        alert("Error deleting class");
      }
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("departments/", {
        department_name: newDeptName,
      });
      setNewDeptName("");
      fetchDepartments();
      alert("Department created successfully!");
    } catch (error) {
      alert("Error creating department");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;
    try {
      await api.delete(`departments/${id}/`);
      fetchDepartments();
      alert("Department deleted successfully!");
    } catch (error) {
      if (error.response?.status === 404) {
        alert("This department has already been deleted.");
        fetchDepartments();
      } else {
        alert("Error deleting department");
      }
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "classes", label: "Classes", icon: GraduationCap },
    { id: "departments", label: "Departments", icon: Briefcase },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (fetchLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <VStack>
          <Spinner size="xl" color="var(--primary)" thickness="4px" />
          <Text fontWeight="medium" color="var(--primary-dark)">
            Loading Dashboard...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" display="flex">
      {/* Sidebar */}
      <MotionBox
        w="280px"
        bg="rgba(255, 255, 255, 0.4)"
        backdropFilter="blur(20px)"
        borderRight="1px solid var(--glass-border)"
        p={6}
        display={{ base: "none", lg: "flex" }}
        flexDirection="column"
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <VStack align="stretch" spaceY={8} h="100%">
          <HStack spaceX={3}>
            <Box bg="var(--primary)" p={2} borderRadius="xl" color="white">
              <GraduationCap size={24} />
            </Box>
            <Heading size="md" fontWeight="bold" color="var(--primary-dark)">
              School Admin
            </Heading>
          </HStack>

          <VStack align="stretch" spaceY={2} flex={1}>
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "solid" : "ghost"}
                bg={activeTab === item.id ? "var(--primary)" : "transparent"}
                color={activeTab === item.id ? "white" : "var(--gray)"}
                _hover={{
                  bg:
                    activeTab === item.id
                      ? "var(--primary)"
                      : "rgba(70, 101, 193, 0.1)",
                  color: activeTab === item.id ? "white" : "var(--primary)",
                }}
                justifyContent="flex-start"
                spaceX={3}
                py={6}
                borderRadius="xl"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon size={20} />
                <Text fontWeight="medium">{item.label}</Text>
              </Button>
            ))}
          </VStack>

          <Button
            variant="ghost"
            color="red.500"
            _hover={{ bg: "red.50" }}
            justifyContent="flex-start"
            spaceX={3}
            py={6}
            borderRadius="xl"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <Text fontWeight="medium">Logout</Text>
          </Button>
        </VStack>
      </MotionBox>

      {/* Main Content */}
      <Box flex={1} p={{ base: 4, lg: 8 }} overflowY="auto">
        <Container maxW="container.xl">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <MotionBox
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HStack justify="space-between" mb={8}>
                  <VStack align="start" spaceY={1}>
                    <Heading size="lg" color="var(--primary-dark)">
                      Dashboard Overview
                    </Heading>
                    <Text color="gray.500">Welcome back, Admin</Text>
                  </VStack>
                  <HStack>
                    <Button
                      bg="var(--primary)"
                      color="white"
                      _hover={{ bg: "var(--primary-dark)" }}
                      borderRadius="xl"
                      spaceX={2}
                    >
                      <Plus size={18} />
                      <Text>Quick Action</Text>
                    </Button>
                  </HStack>
                </HStack>

                {/* Stats Grid */}
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                  gap={6}
                  mb={10}
                >
                  {[
                    {
                      label: "Total Teachers",
                      value: teachers.length,
                      icon: Users,
                      color: "blue",
                    },
                    {
                      label: "Total Subjects",
                      value: allSubjects.length,
                      icon: BookOpen,
                      color: "purple",
                    },
                    {
                      label: "Departments",
                      value: departments.length,
                      icon: Briefcase,
                      color: "orange",
                    },
                  ].map((stat, i) => (
                    <MotionBox
                      key={i}
                      p={6}
                      borderRadius="2xl"
                      className="glass-card"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <HStack justify="space-between">
                        <VStack align="start" spaceY={1}>
                          <Text color="gray.500" fontWeight="medium">
                            {stat.label}
                          </Text>
                          <Heading size="xl">{stat.value}</Heading>
                        </VStack>
                        <Box
                          p={4}
                          bg={`${stat.color}.50`}
                          color={`${stat.color}.500`}
                          borderRadius="2xl"
                        >
                          <stat.icon size={28} />
                        </Box>
                      </HStack>
                    </MotionBox>
                  ))}
                </Grid>

                <Grid
                  templateColumns={{ base: "1fr", lg: "1.2fr 0.8fr" }}
                  gap={8}
                >
                  {/* Recent Teachers Table */}
                  <Box p={6} borderRadius="2xl" className="glass-card">
                    <HStack justify="space-between" mb={6}>
                      <Heading size="md">Teacher Accounts</Heading>
                      <Button variant="link" color="var(--primary)" size="sm">
                        View All
                      </Button>
                    </HStack>
                    <Box overflowX="auto">
                      <Table.Root variant="simple">
                        <Table.Header>
                          <Table.Row borderBottom="2px solid var(--glass-border)">
                            <Table.ColumnHeader color="gray.600">
                              Full Name
                            </Table.ColumnHeader>
                            <Table.ColumnHeader color="gray.600">
                              Username
                            </Table.ColumnHeader>
                            <Table.ColumnHeader color="gray.600">
                              Subjects
                            </Table.ColumnHeader>
                            <Table.ColumnHeader color="gray.600">
                              Actions
                            </Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {teachers.slice(0, 5).map((teacher) => (
                            <Table.Row
                              key={teacher.id}
                              _hover={{ bg: "rgba(70, 101, 193, 0.05)" }}
                              transition="0.2s"
                            >
                              <Table.Cell>
                                <HStack spaceX={3}>
                                  <Box
                                    w={8}
                                    h={8}
                                    borderRadius="full"
                                    bg="var(--primary)"
                                    display="flex"
                                    alignItems="center"
                                    justify="center"
                                    color="white"
                                    fontWeight="bold"
                                    fontSize="xs"
                                  >
                                    {(teacher.profile?.full_name || "N").charAt(
                                      0,
                                    )}
                                  </Box>
                                  <Text fontWeight="medium">
                                    {teacher.profile?.full_name || "N/A"}
                                  </Text>
                                </HStack>
                              </Table.Cell>
                              <Table.Cell>{teacher.username}</Table.Cell>
                              <Table.Cell>
                                <HStack wrap="wrap" gap={1}>
                                  {teacher.profile?.subject_details
                                    ?.slice(0, 2)
                                    .map((s) => (
                                      <Badge
                                        key={s.id}
                                        variant="subtle"
                                        colorPalette="blue"
                                        borderRadius="md"
                                        textTransform="none"
                                      >
                                        {s.subject_name}
                                      </Badge>
                                    ))}
                                  {(teacher.profile?.subject_details?.length ||
                                    0) > 2 && (
                                    <Badge
                                      variant="ghost"
                                      colorPalette="gray"
                                      borderRadius="md"
                                    >
                                      +
                                      {(teacher.profile?.subject_details
                                        ?.length || 0) - 2}
                                    </Badge>
                                  )}
                                </HStack>
                              </Table.Cell>
                              <Table.Cell>
                                <IconButton
                                  size="sm"
                                  variant="ghost"
                                  color="var(--primary)"
                                  aria-label="Reset Password"
                                  onClick={() => {
                                    const newPassword = prompt(
                                      `New password for ${teacher.username}`,
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
                                  <Key size={16} />
                                </IconButton>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </Box>
                  </Box>

                  {/* Creation Forms */}
                  <VStack spaceY={6} align="stretch">
                    <Box p={6} borderRadius="2xl" className="glass-card">
                      <VStack align="stretch" spaceY={4}>
                        <HStack spaceX={3}>
                          <Box
                            bg="purple.50"
                            p={2}
                            borderRadius="lg"
                            color="purple.500"
                          >
                            <BookOpen size={20} />
                          </Box>
                          <Heading size="md">Quick Subject</Heading>
                        </HStack>
                        <form onSubmit={handleAddSubject}>
                          <VStack spaceY={3}>
                            <Input
                              placeholder="Subject Name"
                              value={newSubjectName}
                              onChange={(e) =>
                                setNewSubjectName(e.target.value)
                              }
                              variant="subtle"
                              bg="white"
                              borderRadius="xl"
                              required
                            />
                            <Input
                              placeholder="Subject Type (e.g. Core)"
                              value={newSubjectType}
                              onChange={(e) =>
                                setNewSubjectType(e.target.value)
                              }
                              variant="subtle"
                              bg="white"
                              borderRadius="xl"
                              required
                            />
                            <select
                              value={newSubjectDept}
                              onChange={(e) =>
                                setNewSubjectDept(e.target.value)
                              }
                              required
                              style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "12px",
                                border: "none",
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
                            <select
                              value={newSubjectClass}
                              onChange={(e) =>
                                setNewSubjectClass(e.target.value)
                              }
                              required
                              style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "12px",
                                border: "none",
                                background: "white",
                              }}
                            >
                              <option value="">Select Class</option>
                              {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                  {cls.class_name}
                                </option>
                              ))}
                            </select>
                            <Button
                              type="submit"
                              bg="var(--primary)"
                              color="white"
                              w="100%"
                              borderRadius="xl"
                              isLoading={loading}
                              _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              }}
                            >
                              Create Subject
                            </Button>
                          </VStack>
                        </form>
                      </VStack>
                    </Box>
                  </VStack>
                </Grid>
              </MotionBox>
            )}

            {activeTab === "teachers" && (
              <MotionBox
                key="teachers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Grid
                  templateColumns={{ base: "1fr", lg: "0.4fr 0.6fr" }}
                  gap={8}
                >
                  {/* Create Teacher Form */}
                  <Box p={8} borderRadius="2xl" className="glass-card">
                    <VStack align="stretch" spaceY={6}>
                      <HStack spaceX={3}>
                        <Box
                          bg="blue.50"
                          p={2}
                          borderRadius="lg"
                          color="blue.500"
                        >
                          <UserPlus size={20} />
                        </Box>
                        <Heading size="md">Register New Teacher</Heading>
                      </HStack>
                      <form onSubmit={handleAddTeacher}>
                        <VStack spaceY={4}>
                          <Stack
                            direction={{ base: "column", md: "row" }}
                            w="100%"
                            spaceX={4}
                          >
                            <VStack align="start" flex={1} spaceY={1}>
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.600"
                              >
                                Username
                              </Text>
                              <Input
                                variant="subtle"
                                bg="white"
                                borderRadius="xl"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                              />
                            </VStack>
                            <VStack align="start" flex={1} spaceY={1}>
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.600"
                              >
                                Full Name
                              </Text>
                              <Input
                                variant="subtle"
                                bg="white"
                                borderRadius="xl"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
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
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.600"
                              >
                                Email
                              </Text>
                              <Input
                                type="email"
                                variant="subtle"
                                bg="white"
                                borderRadius="xl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </VStack>
                            <VStack align="start" flex={1} spaceY={1}>
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.600"
                              >
                                Password
                              </Text>
                              <Input
                                type="password"
                                variant="subtle"
                                bg="white"
                                borderRadius="xl"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.600"
                              >
                                Qualification
                              </Text>
                              <Input
                                variant="subtle"
                                bg="white"
                                borderRadius="xl"
                                value={qualification}
                                onChange={(e) =>
                                  setQualification(e.target.value)
                                }
                                required
                              />
                            </VStack>
                            <VStack align="start" flex={1} spaceY={1}>
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.600"
                              >
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
                          Manage all registered teachers and their access
                          credentials from this panel.
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
                              justify="center"
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
            )}

            {activeTab === "subjects" && (
              <MotionBox
                key="subjects"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Grid
                  templateColumns={{ base: "1fr", lg: "0.6fr 0.4fr" }}
                  gap={8}
                >
                  {/* Subjects List */}
                  <Box p={6} borderRadius="2xl" className="glass-card">
                    <VStack align="stretch" spaceY={6}>
                      <HStack justify="space-between">
                        <HStack spaceX={3}>
                          <Box
                            bg="purple.50"
                            p={2}
                            borderRadius="lg"
                            color="purple.500"
                          >
                            <BookOpen size={20} />
                          </Box>
                          <Heading size="md">All Subjects</Heading>
                        </HStack>
                        <Badge
                          colorPalette="purple"
                          variant="subtle"
                          borderRadius="lg"
                        >
                          {allSubjects.length} Total
                        </Badge>
                      </HStack>

                      <Box overflowX="auto">
                        <Table.Root variant="simple">
                          <Table.Header>
                            <Table.Row borderBottom="2px solid var(--glass-border)">
                              <Table.ColumnHeader color="gray.600">
                                Subject Name
                              </Table.ColumnHeader>
                              <Table.ColumnHeader color="gray.600">
                                Type
                              </Table.ColumnHeader>
                              <Table.ColumnHeader color="gray.600">
                                Department
                              </Table.ColumnHeader>
                              <Table.ColumnHeader color="gray.600">
                                Class
                              </Table.ColumnHeader>
                              <Table.ColumnHeader color="gray.600">
                                Action
                              </Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {allSubjects.map((subject) => (
                              <Table.Row
                                key={subject.id}
                                _hover={{ bg: "rgba(128, 90, 213, 0.05)" }}
                                transition="0.2s"
                              >
                                <Table.Cell fontWeight="medium">
                                  {subject.subject_name}
                                </Table.Cell>
                                <Table.Cell>
                                  <Badge
                                    variant="outline"
                                    colorPalette="gray"
                                    fontSize="xs"
                                  >
                                    {subject.subject_type}
                                  </Badge>
                                </Table.Cell>
                                <Table.Cell fontSize="sm">
                                  {departments.find(
                                    (d) => d.id === subject.department,
                                  )?.department_name || "N/A"}
                                </Table.Cell>
                                <Table.Cell fontSize="sm">
                                  {classes.find(
                                    (c) => c.id === subject.class_name,
                                  )?.class_name || "N/A"}
                                </Table.Cell>
                                <Table.Cell>
                                  <IconButton
                                    size="xs"
                                    variant="ghost"
                                    color="red.500"
                                    _hover={{ bg: "red.50" }}
                                    onClick={() =>
                                      handleDeleteSubject(subject.id)
                                    }
                                  >
                                    <Trash2 size={14} />
                                  </IconButton>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                            {allSubjects.length === 0 && (
                              <Table.Row>
                                <Table.Cell
                                  colSpan={4}
                                  textAlign="center"
                                  py={10}
                                  color="gray.400"
                                >
                                  No subjects found. Add your first subject!
                                </Table.Cell>
                              </Table.Row>
                            )}
                          </Table.Body>
                        </Table.Root>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Add Subject Form */}
                  <Box p={8} borderRadius="2xl" className="glass-card">
                    <VStack align="stretch" spaceY={6}>
                      <HStack spaceX={3}>
                        <Box
                          bg="purple.50"
                          p={2}
                          borderRadius="lg"
                          color="purple.500"
                        >
                          <Plus size={20} />
                        </Box>
                        <Heading size="md">Add New Subject</Heading>
                      </HStack>
                      <form onSubmit={handleAddSubject}>
                        <VStack spaceY={4}>
                          <VStack align="start" w="100%" spaceY={1}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Subject Name
                            </Text>
                            <Input
                              placeholder="e.g. Mathematics"
                              value={newSubjectName}
                              onChange={(e) =>
                                setNewSubjectName(e.target.value)
                              }
                              variant="subtle"
                              bg="white"
                              borderRadius="xl"
                              py={6}
                              required
                            />
                          </VStack>

                          <VStack align="start" w="100%" spaceY={1}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Subject Type
                            </Text>
                            <Input
                              placeholder="e.g. Core, Elective"
                              value={newSubjectType}
                              onChange={(e) =>
                                setNewSubjectType(e.target.value)
                              }
                              variant="subtle"
                              bg="white"
                              borderRadius="xl"
                              py={6}
                              required
                            />
                          </VStack>

                          <VStack align="start" w="100%" spaceY={1}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Department
                            </Text>
                            <select
                              value={newSubjectDept}
                              onChange={(e) =>
                                setNewSubjectDept(e.target.value)
                              }
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
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Class
                            </Text>
                            <select
                              value={newSubjectClass}
                              onChange={(e) =>
                                setNewSubjectClass(e.target.value)
                              }
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
                                  {cls.class_name}
                                </option>
                              ))}
                            </select>
                          </VStack>

                          <Button
                            type="submit"
                            bg="purple.500"
                            _hover={{
                              bg: "purple.600",
                              transform: "translateY(-2px)",
                            }}
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
                </Grid>
              </MotionBox>
            )}

            {activeTab === "classes" && (
              <MotionBox
                key="classes"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Grid
                  templateColumns={{ base: "1fr", lg: "0.6fr 0.4fr" }}
                  gap={8}
                >
                  {/* Classes List */}
                  <Box p={6} borderRadius="2xl" className="glass-card">
                    <VStack align="stretch" spaceY={6}>
                      <HStack justify="space-between">
                        <HStack spaceX={3}>
                          <Box
                            bg="blue.50"
                            p={2}
                            borderRadius="lg"
                            color="blue.500"
                          >
                            <GraduationCap size={20} />
                          </Box>
                          <Heading size="md">All Classes</Heading>
                        </HStack>
                        <Badge
                          colorPalette="blue"
                          variant="subtle"
                          borderRadius="lg"
                        >
                          {classes.length} Total
                        </Badge>
                      </HStack>

                      <Box overflowX="auto">
                        <Table.Root variant="simple">
                          <Table.Header>
                            <Table.Row borderBottom="2px solid var(--glass-border)">
                              <Table.ColumnHeader color="gray.600">
                                Class Name
                              </Table.ColumnHeader>
                              <Table.ColumnHeader color="gray.600">
                                ID
                              </Table.ColumnHeader>
                              <Table.ColumnHeader color="gray.600">
                                Action
                              </Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {classes.map((cls) => (
                              <Table.Row
                                key={cls.id}
                                _hover={{ bg: "rgba(70, 101, 193, 0.05)" }}
                                transition="0.2s"
                              >
                                <Table.Cell fontWeight="medium">
                                  {cls.class_name}
                                </Table.Cell>
                                <Table.Cell color="gray.500">
                                  #{cls.id}
                                </Table.Cell>
                                <Table.Cell>
                                  <IconButton
                                    size="xs"
                                    variant="ghost"
                                    color="red.500"
                                    _hover={{ bg: "red.50" }}
                                    onClick={() => handleDeleteClass(cls.id)}
                                  >
                                    <Trash2 size={14} />
                                  </IconButton>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                            {classes.length === 0 && (
                              <Table.Row>
                                <Table.Cell
                                  colSpan={2}
                                  textAlign="center"
                                  py={10}
                                  color="gray.400"
                                >
                                  No classes found. Add your first class!
                                </Table.Cell>
                              </Table.Row>
                            )}
                          </Table.Body>
                        </Table.Root>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Add Class Form */}
                  <Box p={8} borderRadius="2xl" className="glass-card">
                    <VStack align="stretch" spaceY={6}>
                      <HStack spaceX={3}>
                        <Box
                          bg="blue.50"
                          p={2}
                          borderRadius="lg"
                          color="blue.500"
                        >
                          <Plus size={20} />
                        </Box>
                        <Heading size="md">Add New Class</Heading>
                      </HStack>
                      <form onSubmit={handleAddClass}>
                        <VStack spaceY={4}>
                          <VStack align="start" w="100%" spaceY={1}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Class Name
                            </Text>
                            <Input
                              placeholder="e.g. Class 10th-A"
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
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.600"
                            >
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
                            _hover={{
                              bg: "var(--primary-dark)",
                              transform: "translateY(-2px)",
                            }}
                            color="white"
                            w="100%"
                            py={6}
                            borderRadius="xl"
                            isLoading={loading}
                          >
                            Create Class
                          </Button>
                        </VStack>
                      </form>
                    </VStack>
                  </Box>
                </Grid>
              </MotionBox>
            )}

            {activeTab === "departments" && (
              <MotionBox
                key="departments"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Grid
                  templateColumns={{ base: "1fr", lg: "0.6fr 0.4fr" }}
                  gap={8}
                >
                  {/* Departments List */}
                  <Box p={6} borderRadius="2xl" className="glass-card">
                    <VStack align="stretch" spaceY={6}>
                      <HStack justify="space-between">
                        <HStack spaceX={3}>
                          <Box
                            bg="green.50"
                            p={2}
                            borderRadius="lg"
                            color="green.500"
                          >
                            <Briefcase size={20} />
                          </Box>
                          <Heading size="md">All Departments</Heading>
                        </HStack>
                        <Badge
                          colorPalette="green"
                          variant="subtle"
                          borderRadius="lg"
                        >
                          {departments.length} Total
                        </Badge>
                      </HStack>

                      <Box overflowX="auto">
                        <Table.Root variant="simple">
                          <Table.Header>
                            <Table.Row borderBottom="2px solid var(--glass-border)">
                              <Table.ColumnHeader color="gray.600">
                                Department Name
                              </Table.ColumnHeader>
                              <Table.ColumnHeader color="gray.600">
                                ID
                              </Table.ColumnHeader>
                              <Table.ColumnHeader color="gray.600">
                                Action
                              </Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {departments.map((dept) => (
                              <Table.Row
                                key={dept.id}
                                _hover={{ bg: "rgba(72, 187, 120, 0.05)" }}
                                transition="0.2s"
                              >
                                <Table.Cell fontWeight="medium">
                                  {dept.department_name}
                                </Table.Cell>
                                <Table.Cell color="gray.500">
                                  #{dept.id}
                                </Table.Cell>
                                <Table.Cell>
                                  <IconButton
                                    size="xs"
                                    variant="ghost"
                                    color="red.500"
                                    _hover={{ bg: "red.50" }}
                                    onClick={() =>
                                      handleDeleteDepartment(dept.id)
                                    }
                                  >
                                    <Trash2 size={14} />
                                  </IconButton>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                            {departments.length === 0 && (
                              <Table.Row>
                                <Table.Cell
                                  colSpan={3}
                                  textAlign="center"
                                  py={10}
                                  color="gray.400"
                                >
                                  No departments found. Add your first one!
                                </Table.Cell>
                              </Table.Row>
                            )}
                          </Table.Body>
                        </Table.Root>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Add Department Form */}
                  <Box p={8} borderRadius="2xl" className="glass-card">
                    <VStack align="stretch" spaceY={6}>
                      <HStack spaceX={3}>
                        <Box
                          bg="green.50"
                          p={2}
                          borderRadius="lg"
                          color="green.500"
                        >
                          <Plus size={20} />
                        </Box>
                        <Heading size="md">Add New Department</Heading>
                      </HStack>
                      <form onSubmit={handleAddDepartment}>
                        <VStack spaceY={4}>
                          <VStack align="start" w="100%" spaceY={1}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Department Name
                            </Text>
                            <Input
                              placeholder="e.g. Science, Arts"
                              value={newDeptName}
                              onChange={(e) => setNewDeptName(e.target.value)}
                              variant="subtle"
                              bg="white"
                              borderRadius="xl"
                              py={6}
                              required
                            />
                          </VStack>
                          <Button
                            type="submit"
                            bg="green.500"
                            _hover={{
                              bg: "green.600",
                              transform: "translateY(-2px)",
                            }}
                            color="white"
                            w="100%"
                            py={6}
                            borderRadius="xl"
                            isLoading={loading}
                          >
                            Create Department
                          </Button>
                        </VStack>
                      </form>
                    </VStack>
                  </Box>
                </Grid>
              </MotionBox>
            )}

            {activeTab === "settings" && (
              <MotionBox
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                p={20}
                textAlign="center"
              >
                <VStack spaceY={4}>
                  <Box p={6} bg="gray.100" borderRadius="full" color="gray.400">
                    <Settings size={48} />
                  </Box>
                  <Heading size="md" color="gray.600">
                    Settings Module
                  </Heading>
                  <Text color="gray.400">
                    Configure your application preferences here.
                  </Text>
                  <Button
                    variant="ghost"
                    color="var(--primary)"
                    onClick={() => setActiveTab("dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </VStack>
              </MotionBox>
            )}
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
