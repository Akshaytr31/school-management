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
  Flex,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Plus,
  GraduationCap,
  Briefcase,
  Settings,
} from "lucide-react";
import api from "../api";

// New modular components
import AdminSidebar from "../components/admin/AdminSidebar";
import DashboardTab from "../components/admin/DashboardTab";
import TeachersTab from "../components/admin/TeachersTab";
import SubjectsTab from "../components/admin/SubjectsTab";
import ClassesTab from "../components/admin/ClassesTab";
import DepartmentsTab from "../components/admin/DepartmentsTab";

const MotionBox = motion(Box);

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
  const [newClassDivision, setNewClassDivision] = useState("");
  const [newClassCategory, setNewClassCategory] = useState("Primary");

  // Student list viewing
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassStudents, setSelectedClassStudents] = useState([]);
  const [viewingStudents, setViewingStudents] = useState(false);
  const [selectedClassGroup, setSelectedClassGroup] = useState(null);
  const [isClassesExpanded, setIsClassesExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

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

  const fetchClassStudents = async (classId) => {
    setLoadingStudents(true);
    setViewingStudents(true);
    try {
      const response = await api.get(`admissions/?class_id=${classId}`);
      setSelectedClassStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("classes/", {
        class_name: newClassName,
        department: newClassDept,
        division: newClassDivision,
        category: newClassCategory,
      });
      setNewClassName("");
      setNewClassDept("");
      setNewClassDivision("");
      setNewClassCategory("Primary");
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
      <AdminSidebar
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isClassesExpanded={isClassesExpanded}
        setIsClassesExpanded={setIsClassesExpanded}
        expandedCategories={expandedCategories}
        setExpandedCategories={setExpandedCategories}
        classes={classes}
        selectedClassGroup={selectedClassGroup}
        setSelectedClassGroup={setSelectedClassGroup}
        setViewingStudents={setViewingStudents}
        setSelectedClass={setSelectedClass}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <Box flex={1} p={{ base: 4, lg: 8 }} overflowY="auto">
        <Container maxW="container.xl">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <DashboardTab
                key="dashboard"
                teachers={teachers}
                allSubjects={allSubjects}
                departments={departments}
              />
            )}

            {activeTab === "teachers" && (
              <TeachersTab
                key="teachers"
                teachers={teachers}
                allSubjects={allSubjects}
                loading={loading}
                handleAddTeacher={handleAddTeacher}
                handleDeleteTeacher={handleDeleteTeacher}
                handleSubjectChange={handleSubjectChange}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                newFullName={newFullName}
                setNewFullName={setNewFullName}
                newEmail={newEmail}
                setNewEmail={setNewEmail}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                qualification={qualification}
                setQualification={setQualification}
                gender={gender}
                setGender={setGender}
                dob={dob}
                setDob={setDob}
                experience={experience}
                setExperience={setExperience}
                joiningDate={joiningDate}
                setJoiningDate={setJoiningDate}
                address={address}
                setAddress={setAddress}
                selectedSubjects={selectedSubjects}
              />
            )}

            {activeTab === "subjects" && (
              <SubjectsTab
                key="subjects"
                allSubjects={allSubjects}
                departments={departments}
                classes={classes}
                loading={loading}
                handleAddSubject={handleAddSubject}
                handleDeleteSubject={handleDeleteSubject}
                newSubjectName={newSubjectName}
                setNewSubjectName={setNewSubjectName}
                newSubjectType={newSubjectType}
                setNewSubjectType={setNewSubjectType}
                newSubjectDept={newSubjectDept}
                setNewSubjectDept={setNewSubjectDept}
                newSubjectClass={newSubjectClass}
                setNewSubjectClass={setNewSubjectClass}
              />
            )}

            {activeTab === "classes" && (
              <ClassesTab
                key="classes"
                classes={classes}
                departments={departments}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                selectedClassStudents={selectedClassStudents}
                viewingStudents={viewingStudents}
                setViewingStudents={setViewingStudents}
                selectedClassGroup={selectedClassGroup}
                loadingStudents={loadingStudents}
                loading={loading}
                handleAddClass={handleAddClass}
                handleDeleteClass={handleDeleteClass}
                fetchClassStudents={fetchClassStudents}
                newClassName={newClassName}
                setNewClassName={setNewClassName}
                newClassDept={newClassDept}
                setNewClassDept={setNewClassDept}
                newClassDivision={newClassDivision}
                setNewClassDivision={setNewClassDivision}
                newClassCategory={newClassCategory}
                setNewClassCategory={setNewClassCategory}
              />
            )}

            {activeTab === "departments" && (
              <DepartmentsTab
                key="departments"
                departments={departments}
                loading={loading}
                handleAddDept={handleAddDepartment}
                handleDeleteDept={handleDeleteDepartment}
                newDeptName={newDeptName}
                setNewDeptName={setNewDeptName}
              />
            )}

            {activeTab === "settings" && (
              <MotionBox
                key="settings"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                p={6}
                borderRadius="2xl"
                className="glass-card"
              >
                <VStack align="start" spaceY={4}>
                  <Heading size="md">System Settings</Heading>
                  <Text color="gray.500">
                    Configuration options for the school management system will
                    appear here.
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
