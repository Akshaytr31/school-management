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
  Textarea,
  SimpleGrid,
  Separator,
  Stack,
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
  UserPlus,
  User,
  Trash2,
  ChevronRight,
  Mail,
  Phone,
  BookOpen as BookOpenIcon,
  LayoutGrid,
} from "lucide-react";
import api from "../api";

// New modular components
import AdminSidebar from "../components/admin/AdminSidebar";
import DashboardTab from "../components/admin/DashboardTab";
import TeachersTab from "../components/admin/TeachersTab";
import SubjectsTab from "../components/admin/SubjectsTab";
import ClassesTab from "../components/admin/ClassesTab";
import DepartmentsTab from "../components/admin/DepartmentsTab";
import AlertModal from "../components/common/AlertModal";
import { Checkbox } from "../components/ui/checkbox";
import { toaster, Toaster } from "../components/ui/toaster";

// Detail components
import TeacherDetail from "../components/admin/details/TeacherDetail";
import SubjectDetail from "../components/admin/details/SubjectDetail";
import ClassDetail from "../components/admin/details/ClassDetail";
import DepartmentDetail from "../components/admin/details/DepartmentDetail";

// Dialog components
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogActionTrigger,
} from "../components/ui/dialog";

const MotionBox = motion.create(Box);

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Drill-down state
  const [drillDownView, setDrillDownView] = useState({
    type: null,
    data: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);

  // Form states ...
  // [Lines 49-85 remain same, but I'll need to reset them for edit mode]
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newFullName, setNewFullName] = useState("");
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
  const [newSubjectClasses, setNewSubjectClasses] = useState([]);

  // Class creation fields
  const [newClassName, setNewClassName] = useState("");
  const [newClassDept, setNewClassDept] = useState("");
  const [newClassDivision, setNewClassDivision] = useState("");
  const [newClassCategory, setNewClassCategory] = useState("Primary");
  const [newClassTeacher, setNewClassTeacher] = useState("");

  // Student list viewing
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassStudents, setSelectedClassStudents] = useState([]);
  const [viewingStudents, setViewingStudents] = useState(false);
  const [selectedClassGroup, setSelectedClassGroup] = useState(null);
  const [isClassesExpanded, setIsClassesExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [admissions, setAdmissions] = useState([]); // Added to track all admissions

  // Department creation fields
  const [newDeptName, setNewDeptName] = useState("");

  // Modal visibility states
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Alert Modal State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (type, title, message) => {
    toaster.create({
      title: title,
      description: message,
      type: type,
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const showConfirm = (title, message, onConfirm) => {
    setAlertConfig({
      isOpen: true,
      type: "warning",
      title,
      message,
      onConfirm,
    });
  };

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

  const fetchAllAdmissions = async () => {
    try {
      const response = await api.get("admissions/");
      setAdmissions(response.data);
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
        fetchAllAdmissions(),
      ]);
      setFetchLoading(false);
    };
    loadData();
  }, []);

  // Drill-down Handlers
  const handleViewDetails = (type, data) => {
    setDrillDownView({ type, data });
  };

  const handleBackToList = () => {
    setDrillDownView({ type: null, data: null });
  };

  // Edit Handlers
  const openEditTeacher = (teacher) => {
    setEditingEntity(teacher);
    setIsEditMode(true);
    setNewUsername(teacher.username);
    setNewEmail(teacher.email);
    setNewFullName(teacher.profile?.full_name || "");
    setQualification(teacher.profile?.qualification || "");
    setPhoneNumber(teacher.profile?.phone_number || "");
    setAddress(teacher.profile?.address || "");
    setGender(teacher.profile?.gender || "Male");
    setDob(teacher.profile?.date_of_birth || "");
    setExperience(teacher.profile?.experience || "");
    setJoiningDate(teacher.profile?.joining_date || "");
    setSelectedSubjects(teacher.subjects || []);
    setIsAddTeacherOpen(true);
  };

  const openEditSubject = (subject) => {
    setEditingEntity(subject);
    setIsEditMode(true);
    setNewSubjectName(subject.subject_name);
    setNewSubjectType(subject.subject_type);
    setNewSubjectDept(subject.department);
    setNewSubjectClasses(subject.classes || []);
    setIsAddSubjectOpen(true);
  };

  const openEditClass = (classItem) => {
    setEditingEntity(classItem);
    setIsEditMode(true);
    setNewClassName(classItem.class_name);
    setNewClassDept(classItem.department);
    setNewClassDivision(classItem.division || "");
    setNewClassCategory(classItem.category);
    setIsAddClassOpen(true);
  };

  const openEditDept = (dept) => {
    setEditingEntity(dept);
    setIsEditMode(true);
    setNewDeptName(dept.department_name);
    setIsAddDeptOpen(true);
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    const teacherData = {
      username: newUsername,
      email: newEmail,
      profile: {
        full_name: newFullName,
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
    if (!isEditMode) teacherData.password = newPassword;

    try {
      if (isEditMode) {
        const response = await api.patch(
          `teachers/${editingEntity.id}/`,
          teacherData,
        );
        if (drillDownView.type === "teacher")
          handleViewDetails("teacher", response.data);
      } else {
        await api.post("teachers/", { ...teacherData, password: newPassword });
      }
      resetTeacherForm();
      fetchTeachers();
      setIsAddTeacherOpen(false);
      showAlert(
        "success",
        "Success",
        `Teacher ${isEditMode ? "updated" : "created"} successfully!`,
      );
    } catch (error) {
      showAlert(
        "error",
        "Error",
        `Error ${isEditMode ? "updating" : "creating"} teacher`,
      );
    } finally {
      setLoading(false);
    }
  };

  const resetTeacherForm = () => {
    setNewUsername("");
    setNewPassword("");
    setNewEmail("");
    setNewFullName("");
    setQualification("");
    setPhoneNumber("");
    setAddress("");
    setGender("Male");
    setDob("");
    setExperience("");
    setJoiningDate("");
    setSelectedSubjects([]);
    setIsEditMode(false);
    setEditingEntity(null);
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
    const subjectData = {
      subject_name: newSubjectName,
      subject_type: newSubjectType,
      department: newSubjectDept,
      classes: newSubjectClasses,
    };
    try {
      if (isEditMode) {
        const response = await api.patch(
          `subjects/${editingEntity.id}/`,
          subjectData,
        );
        if (drillDownView.type === "subject")
          handleViewDetails("subject", response.data);
      } else {
        await api.post("subjects/", subjectData);
      }
      resetSubjectForm();
      fetchSubjects();
      setIsAddSubjectOpen(false);
      showAlert(
        "success",
        "Success",
        `Subject ${isEditMode ? "updated" : "created"} successfully!`,
      );
    } catch (error) {
      showAlert(
        "error",
        "Error",
        `Error ${isEditMode ? "updating" : "creating"} subject`,
      );
    } finally {
      setLoading(false);
    }
  };

  const resetSubjectForm = () => {
    setNewSubjectName("");
    setNewSubjectType("");
    setNewSubjectDept("");
    setNewSubjectClasses([]);
    setIsEditMode(false);
    setEditingEntity(null);
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
    const classData = {
      class_name: newClassName,
      department: newClassDept,
      division: newClassDivision,
      category: newClassCategory,
      class_teacher: newClassTeacher || null,
    };
    try {
      if (isEditMode) {
        const response = await api.patch(
          `classes/${editingEntity.id}/`,
          classData,
        );
        if (drillDownView.type === "class")
          handleViewDetails("class", response.data);
      } else {
        await api.post("classes/", classData);
      }
      resetClassForm();
      fetchClasses();
      setIsAddClassOpen(false);
      showAlert(
        "success",
        "Success",
        `Class ${isEditMode ? "updated" : "created"} successfully!`,
      );
    } catch (error) {
      showAlert(
        "error",
        "Error",
        `Error ${isEditMode ? "updating" : "creating"} class`,
      );
    } finally {
      setLoading(false);
    }
  };

  const resetClassForm = () => {
    setNewClassName("");
    setNewClassDept("");
    setNewClassDivision("");
    setNewClassCategory("Primary");
    setNewClassTeacher("");
    setIsEditMode(false);
    setEditingEntity(null);
  };

  const handleDeleteTeacher = (id) => {
    showConfirm(
      "Confirm Deletion",
      "Are you sure you want to delete this teacher? This action cannot be undone.",
      async () => {
        try {
          await api.delete(`teachers/${id}/`);
          fetchTeachers();
          if (drillDownView.type === "teacher" && drillDownView.data.id === id)
            handleBackToList();
          showAlert("success", "Deleted", "Subject deleted successfully!");
        } catch (error) {
          if (error.response?.status === 404) {
            showAlert(
              "warning",
              "Note",
              "This teacher has already been deleted.",
            );
            fetchTeachers();
          } else {
            showAlert("error", "Error", "Error deleting teacher");
          }
        }
      },
    );
  };

  const handleDeleteSubject = (id) => {
    showConfirm(
      "Confirm Deletion",
      "Are you sure you want to delete this subject? This might affect teacher assignments.",
      async () => {
        try {
          await api.delete(`subjects/${id}/`);
          fetchSubjects();
          if (drillDownView.type === "subject" && drillDownView.data.id === id)
            handleBackToList();
          showAlert("success", "Deleted", "Subject deleted successfully!");
        } catch (error) {
          if (error.response?.status === 404) {
            showAlert(
              "warning",
              "Note",
              "This subject has already been deleted.",
            );
            fetchSubjects();
          } else {
            showAlert("error", "Error", "Error deleting subject");
          }
        }
      },
    );
  };

  const handleDeleteClass = (id) => {
    showConfirm(
      "Confirm Deletion",
      "Are you sure you want to delete this class? All student associations might be affected.",
      async () => {
        try {
          await api.delete(`classes/${id}/`);
          fetchClasses();
          if (drillDownView.type === "class" && drillDownView.data.id === id)
            handleBackToList();
          showAlert("success", "Deleted", "Class deleted successfully!");
        } catch (error) {
          if (error.response?.status === 404) {
            showAlert(
              "warning",
              "Note",
              "This class has already been deleted.",
            );
            fetchClasses();
          } else {
            showAlert("error", "Error", "Error deleting class");
          }
        }
      },
    );
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        const response = await api.patch(`departments/${editingEntity.id}/`, {
          department_name: newDeptName,
        });
        if (drillDownView.type === "department")
          handleViewDetails("department", response.data);
      } else {
        await api.post("departments/", {
          department_name: newDeptName,
        });
      }
      setNewDeptName("");
      setIsEditMode(false);
      setEditingEntity(null);
      fetchDepartments();
      setIsAddDeptOpen(false);
      showAlert(
        "success",
        "Success",
        `Department ${isEditMode ? "updated" : "created"} successfully!`,
      );
    } catch (error) {
      showAlert(
        "error",
        "Error",
        `Error ${isEditMode ? "updating" : "creating"} department`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = (id) => {
    showConfirm(
      "Confirm Deletion",
      "Are you sure you want to delete this department? This might affect multiple classes and subjects.",
      async () => {
        try {
          await api.delete(`departments/${id}/`);
          fetchDepartments();
          if (
            drillDownView.type === "department" &&
            drillDownView.data.id === id
          )
            handleBackToList();
          showAlert("success", "Deleted", "Department deleted successfully!");
        } catch (error) {
          if (error.response?.status === 404) {
            showAlert(
              "warning",
              "Note",
              "This department has already been deleted.",
            );
            fetchDepartments();
          } else {
            showAlert("error", "Error", "Error deleting department");
          }
        }
      },
    );
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "classes", label: "Classes", icon: GraduationCap },
    { id: "departments", label: "Departments", icon: Briefcase },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Effect to reset drillDownView when activeTab changes
  useEffect(() => {
    handleBackToList();
  }, [activeTab]);

  if (fetchLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <VStack gap={2}>
          <Spinner size="xl" color="var(--primary)" thickness="4px" />
          <Text fontWeight="medium" color="var(--primary-dark)">
            Loading Dashboard...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box h="100vh" display="flex">
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
                classes={classes}
                admissions={admissions}
              />
            )}

            {activeTab === "teachers" &&
              (drillDownView.type === "teacher" ? (
                <TeacherDetail
                  key="teacher-detail"
                  teacher={drillDownView.data}
                  allSubjects={allSubjects}
                  onBack={handleBackToList}
                  onEdit={openEditTeacher}
                  onDelete={handleDeleteTeacher}
                />
              ) : (
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
                  isOpen={isAddTeacherOpen}
                  setIsOpen={(val) => {
                    if (!val) resetTeacherForm();
                    setIsAddTeacherOpen(val);
                  }}
                  isEditMode={isEditMode}
                  onCardClick={(t) => handleViewDetails("teacher", t)}
                />
              ))}

            {activeTab === "subjects" &&
              (drillDownView.type === "subject" ? (
                <SubjectDetail
                  key="subject-detail"
                  subject={drillDownView.data}
                  classes={classes}
                  teachers={teachers}
                  departments={departments}
                  onBack={handleBackToList}
                  onEdit={openEditSubject}
                  onDelete={handleDeleteSubject}
                />
              ) : (
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
                  newSubjectClasses={newSubjectClasses}
                  setNewSubjectClasses={setNewSubjectClasses}
                  isOpen={isAddSubjectOpen}
                  setIsOpen={(val) => {
                    if (!val) resetSubjectForm();
                    setIsAddSubjectOpen(val);
                  }}
                  isEditMode={isEditMode}
                  onCardClick={(s) => handleViewDetails("subject", s)}
                />
              ))}

            {activeTab === "classes" &&
              (drillDownView.type === "class" ? (
                <ClassDetail
                  key="class-detail"
                  classData={drillDownView.data}
                  admissions={admissions}
                  departments={departments}
                  teachers={teachers}
                  onBack={handleBackToList}
                  onEdit={openEditClass}
                  onDelete={handleDeleteClass}
                />
              ) : (
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
                  isOpen={isAddClassOpen}
                  setIsOpen={(val) => {
                    if (!val) resetClassForm();
                    setIsAddClassOpen(val);
                  }}
                  isEditMode={isEditMode}
                  onCardClick={(c) => handleViewDetails("class", c)}
                />
              ))}

            {activeTab === "departments" &&
              (drillDownView.type === "department" ? (
                <DepartmentDetail
                  key="department-detail"
                  department={drillDownView.data}
                  classes={classes}
                  subjects={allSubjects}
                  onBack={handleBackToList}
                  onEdit={openEditDept}
                  onDelete={handleDeleteDepartment}
                />
              ) : (
                <DepartmentsTab
                  key="departments"
                  departments={departments}
                  loading={loading}
                  handleAddDept={handleAddDepartment}
                  handleDeleteDept={handleDeleteDepartment}
                  newDeptName={newDeptName}
                  setNewDeptName={setNewDeptName}
                  isOpen={isAddDeptOpen}
                  setIsOpen={(val) => {
                    if (!val) {
                      setIsEditMode(false);
                      setEditingEntity(null);
                      setNewDeptName("");
                    }
                    setIsAddDeptOpen(val);
                  }}
                  isEditMode={isEditMode}
                  onCardClick={(d) => handleViewDetails("department", d)}
                />
              ))}

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
                <VStack align="start" gap={4}>
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

      {/* Class Modal */}
      <DialogRoot
        open={isAddClassOpen}
        onOpenChange={(e) => setIsAddClassOpen(e.open)}
        size="md"
        placement="center"
      >
        <DialogContent
          borderRadius="2xl"
          p={0}
          overflow="hidden"
          className="glass-card"
          bg="white"
          maxH="90vh"
          display="flex"
          flexDirection="column"
        >
          <VStack align="stretch" gap={0}>
            <DialogHeader p={6} borderBottom="1px solid" borderColor="gray.100">
              <HStack gap={3}>
                <Box bg="blue.50" p={2} borderRadius="lg" color="blue.500">
                  <Plus size={20} />
                </Box>
                <DialogTitle fontSize="xl">
                  {isEditMode ? "Edit Class" : "Add New Class"}
                </DialogTitle>
              </HStack>
            </DialogHeader>
            <form
              onSubmit={handleAddClass}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <DialogBody p={6} overflowY="auto" flex="1">
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                  <VStack align="start" w="100%" gap={1.5}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">
                      Class Name
                    </Text>
                    <Input
                      placeholder="e.g. Class 10th"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      variant="outline"
                      bg="gray.50"
                      _focus={{
                        bg: "white",
                        borderColor: "var(--primary)",
                      }}
                      borderRadius="xl"
                      py={6}
                      required
                    />
                  </VStack>

                  <VStack align="start" w="100%" gap={1.5}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">
                      Division
                    </Text>
                    <Input
                      placeholder="e.g. A"
                      value={newClassDivision}
                      onChange={(e) => setNewClassDivision(e.target.value)}
                      variant="outline"
                      bg="gray.50"
                      _focus={{
                        bg: "white",
                        borderColor: "var(--primary)",
                      }}
                      borderRadius="xl"
                      py={6}
                      required
                    />
                  </VStack>

                  <VStack align="start" w="100%" gap={1.5}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">
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
                        border: "1px solid #E2E8F0",
                        background: "#F7FAFC",
                        fontSize: "16px",
                      }}
                    >
                      <option value="Senior Secondary">Senior Secondary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Middle">Middle</option>
                      <option value="Primary">Primary</option>
                      <option value="Pre Primary">Pre Primary</option>
                    </select>
                  </VStack>

                  <VStack align="start" w="100%" gap={1.5}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">
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
                        border: "1px solid #E2E8F0",
                        background: "#F7FAFC",
                        fontSize: "16px",
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

                  <VStack align="start" w="100%" gap={1.5}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">
                      Class Teacher
                    </Text>
                    <select
                      value={newClassTeacher}
                      onChange={(e) => setNewClassTeacher(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        background: "#F7FAFC",
                        fontSize: "16px",
                      }}
                    >
                      <option value="">No Class Teacher (Optional)</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.profile?.full_name || teacher.username}
                        </option>
                      ))}
                    </select>
                  </VStack>
                </SimpleGrid>
              </DialogBody>
              <DialogFooter
                p={6}
                borderTop="1px solid"
                borderColor="gray.100"
                bg="gray.50"
              >
                <HStack w="100%" gap={3}>
                  <DialogActionTrigger asChild>
                    <Button
                      variant="ghost"
                      flex={1}
                      py={6}
                      borderRadius="xl"
                      onClick={() => setIsAddClassOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DialogActionTrigger>
                  <Button
                    type="submit"
                    bg="var(--primary)"
                    color="white"
                    flex={2}
                    py={6}
                    borderRadius="xl"
                    isLoading={loading}
                    _hover={{
                      bg: "var(--primary-dark)",
                      transform: "translateY(-2px)",
                    }}
                  >
                    {isEditMode ? "Save Changes" : "Create Class"}
                  </Button>
                </HStack>
              </DialogFooter>
            </form>
          </VStack>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>

      {/* Department Modal */}
      <DialogRoot
        open={isAddDeptOpen}
        onOpenChange={(e) => setIsAddDeptOpen(e.open)}
        placement="center"
        motionPreset="slide-in-bottom"
      >
        <DialogContent
          className="glass-card"
          borderRadius="2xl"
          maxH="90vh"
          overflow="hidden"
        >
          <DialogHeader borderBottom="1px solid var(--glass-border)" pb={4}>
            <HStack gap={3}>
              <Box bg="green.50" p={2} borderRadius="lg" color="green.500">
                <Plus size={20} />
              </Box>
              <DialogTitle fontSize="lg" fontWeight="bold">
                {isEditMode ? "Edit Department" : "Add New Department"}
              </DialogTitle>
            </HStack>
            <DialogCloseTrigger />
          </DialogHeader>

          <form onSubmit={handleAddDepartment}>
            <DialogBody py={6} overflowY="auto" maxH="calc(90vh - 140px)">
              <VStack align="start" w="100%" gap={2}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Department Name
                </Text>
                <Input
                  placeholder="e.g. Science"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  variant="subtle"
                  bg="white"
                  borderRadius="xl"
                  py={6}
                  required
                  autoFocus
                />
                <Text fontSize="xs" color="gray.400">
                  Enter the official name of the department to be created.
                </Text>
              </VStack>
            </DialogBody>

            <DialogFooter borderTop="1px solid var(--glass-border)" pt={4}>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => setIsAddDeptOpen(false)}
                borderRadius="xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bg="var(--primary)"
                color="white"
                px={8}
                borderRadius="xl"
                isLoading={loading}
              >
                {isEditMode ? "Save Changes" : "Create Department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>

      {/* Subject Modal */}
      <DialogRoot
        open={isAddSubjectOpen}
        onOpenChange={(e) => setIsAddSubjectOpen(e.open)}
        placement="center"
        motionPreset="slide-in-bottom"
        size="lg"
      >
        <DialogContent
          className="glass-card"
          borderRadius="2xl"
          maxH="90vh"
          overflow="hidden"
        >
          <DialogHeader borderBottom="1px solid var(--glass-border)" pb={4}>
            <HStack gap={3}>
              <Box bg="purple.50" p={2} borderRadius="lg" color="purple.500">
                <Plus size={20} />
              </Box>
              <DialogTitle fontSize="lg" fontWeight="bold">
                {isEditMode ? "Edit Subject" : "Add New Subject"}
              </DialogTitle>
            </HStack>
            <DialogCloseTrigger />
          </DialogHeader>

          <form onSubmit={handleAddSubject}>
            <DialogBody py={6} overflowY="auto" maxH="calc(90vh - 140px)">
              <VStack gap={5}>
                <Grid
                  templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                  gap={4}
                  w="100%"
                >
                  <VStack align="start" w="100%" gap={1}>
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
                      autoFocus
                    />
                  </VStack>

                  <VStack align="start" w="100%" gap={1}>
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
                </Grid>

                <VStack align="start" w="100%" gap={1}>
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
                      fontSize: "14px",
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

                <VStack align="start" w="100%" gap={3}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Target Classes
                  </Text>
                  <Box
                    w="100%"
                    maxH="200px"
                    overflowY="auto"
                    p={4}
                    borderRadius="xl"
                    bg="white"
                    border="1px solid"
                    borderColor="var(--glass-border)"
                  >
                    <Stack gap={2}>
                      {classes.map((cls) => (
                        <Checkbox
                          key={cls.id}
                          colorPalette="purple"
                          checked={newSubjectClasses.includes(cls.id)}
                          onCheckedChange={(e) => {
                            if (e.checked) {
                              setNewSubjectClasses([
                                ...newSubjectClasses,
                                cls.id,
                              ]);
                            } else {
                              setNewSubjectClasses(
                                newSubjectClasses.filter((id) => id !== cls.id),
                              );
                            }
                          }}
                        >
                          <Text fontSize="sm">
                            {cls.class_name} - {cls.division}
                          </Text>
                        </Checkbox>
                      ))}
                    </Stack>
                  </Box>
                  <Text fontSize="xs" color="gray.400">
                    Select one or more classes for this subject
                  </Text>
                </VStack>
              </VStack>
            </DialogBody>

            <DialogFooter borderTop="1px solid var(--glass-border)" pt={4}>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => setIsAddSubjectOpen(false)}
                borderRadius="xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bg="var(--primary)"
                color="white"
                px={8}
                borderRadius="xl"
                isLoading={loading}
              >
                {isEditMode ? "Save Changes" : "Create Subject"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>

      {/* Teacher Modal */}
      <DialogRoot
        open={isAddTeacherOpen}
        onOpenChange={(e) => setIsAddTeacherOpen(e.open)}
        placement="center"
        motionPreset="slide-in-bottom"
        size="xl"
      >
        <DialogContent
          className="glass-card"
          borderRadius="2xl"
          maxH="90vh"
          overflow="hidden"
        >
          <DialogHeader borderBottom="1px solid var(--glass-border)" pb={4}>
            <HStack gap={3}>
              <Box bg="blue.50" p={2} borderRadius="lg" color="blue.500">
                <UserPlus size={20} />
              </Box>
              <DialogTitle fontSize="lg" fontWeight="bold">
                {isEditMode ? "Edit Teacher Profile" : "Register New Teacher"}
              </DialogTitle>
            </HStack>
            <DialogCloseTrigger />
          </DialogHeader>

          <form onSubmit={handleAddTeacher}>
            <DialogBody py={6} overflowY="auto" maxH="calc(90vh - 140px)">
              <VStack gap={6}>
                {/* Account Credentials Section */}
                <VStack align="stretch" w="100%" gap={4}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="var(--primary)"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Account Credentials
                  </Text>
                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={4}
                  >
                    <VStack align="start" gap={1}>
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
                        autoFocus
                        disabled={isEditMode}
                      />
                    </VStack>
                    {!isEditMode && (
                      <VStack align="start" gap={1}>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.600"
                        >
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
                    )}
                  </Grid>
                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={4}
                  >
                    <VStack align="start" gap={1}>
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
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        Email Address
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
                  </Grid>
                </VStack>

                <Separator />

                {/* Profile Details Section */}
                <VStack align="stretch" w="100%" gap={4}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="var(--primary)"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Professional Profile
                  </Text>
                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={4}
                  >
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        Qualification
                      </Text>
                      <Input
                        variant="subtle"
                        bg="white"
                        borderRadius="xl"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        placeholder="e.g. M.Sc. Mathematics"
                        required
                      />
                    </VStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        Phone Number
                      </Text>
                      <Input
                        variant="subtle"
                        bg="white"
                        borderRadius="xl"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 234 567 890"
                        required
                      />
                    </VStack>
                  </Grid>

                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={4}
                  >
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        Gender
                      </Text>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: "1px solid var(--glass-border)",
                          background: "white",
                          fontSize: "14px",
                        }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </VStack>
                    <VStack align="start" gap={1}>
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
                  </Grid>

                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={4}
                  >
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        Years of Experience
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
                    <VStack align="start" gap={1}>
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
                  </Grid>

                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Residence Address
                    </Text>
                    <Textarea
                      variant="subtle"
                      bg="white"
                      borderRadius="xl"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Provide detailed residential address"
                      rows={3}
                    />
                  </VStack>
                </VStack>

                <Separator />

                {/* Subject Assignment Section */}
                <VStack align="stretch" w="100%" gap={3}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="var(--primary)"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Subject Assignment
                  </Text>
                  <Box
                    border="1px solid var(--glass-border)"
                    borderRadius="xl"
                    p={4}
                    maxH="200px"
                    overflowY="auto"
                    bg="white"
                  >
                    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                      {allSubjects.map((sub) => (
                        <HStack
                          key={sub.id}
                          _hover={{ bg: "gray.50" }}
                          p={2}
                          borderRadius="md"
                          transition="0.2s"
                        >
                          <input
                            type="checkbox"
                            id={`teacher-sub-${sub.id}`}
                            checked={selectedSubjects.includes(sub.id)}
                            onChange={() => handleSubjectChange(sub.id)}
                            style={{
                              width: "16px",
                              height: "16px",
                              cursor: "pointer",
                            }}
                          />
                          <label
                            htmlFor={`teacher-sub-${sub.id}`}
                            style={{
                              fontSize: "14px",
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            {sub.subject_name}
                          </label>
                        </HStack>
                      ))}
                    </SimpleGrid>
                  </Box>
                </VStack>
              </VStack>
            </DialogBody>

            <DialogFooter borderTop="1px solid var(--glass-border)" pt={4}>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => setIsAddTeacherOpen(false)}
                borderRadius="xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bg="var(--primary)"
                color="white"
                px={10}
                borderRadius="xl"
                isLoading={loading}
                _hover={{ bg: "var(--primary-dark)" }}
              >
                {isEditMode ? "Save Changes" : "Register Teacher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>

      <Toaster />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
      />
    </Box>
  );
};

export default AdminDashboard;
