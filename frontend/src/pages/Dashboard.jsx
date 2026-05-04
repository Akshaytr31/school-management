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
  SimpleGrid,
  Tabs,
  Image,
} from "@chakra-ui/react";
import {
  GraduationCap,
  UserCircle,
  Save,
  User,
  BookOpen,
  Users,
  MapPin,
  History,
  Info,
  Plus,
} from "lucide-react";
import api from "../api";
import { Field } from "../components/ui/field";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../components/ui/native-select";
import AlertModal from "../components/common/AlertModal";

const Dashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    departments: [],
    classes: [],
    divisions: [],
  });
  const [newDepartment, setNewDepartment] = useState("");
  const [newClass, setNewClass] = useState({ class_name: "", department: "" });
  const [newDivision, setNewDivision] = useState({
    division: "",
    class_name: "",
    class_teacher_name: "",
  });

  // Alert Modal State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (type, title, message) => {
    setAlertConfig({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const initialFormData = {
    admission_number: "",
    admission_date: "",
    academic_period: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    place_of_birth: "",
    department: "",
    class_name: "",
    address: "",
    district: "",
    state: "",
    post_office: "",
    blood_group: "",
    nationality: "Indian",
    pin_code: "",
    aadhar_number: "",
    mother_tongue: "",
    religion: "",
    caste: "",
    category: "",
    photo: null,
    father_name: "",
    father_occupation: "",
    father_qualification: "",
    father_income: "",
    father_mobile: "",
    father_email: "",
    mother_name: "",
    mother_occupation: "",
    mother_qualification: "",
    mother_income: "",
    mother_mobile: "",
    mother_email: "",
    guardian_name: "",
    guardian_occupation: "",
    guardian_income: "",
    guardian_mobile: "",
    guardian_email: "",
    tc_number: "",
    tc_date: "",
    school_name: "",
    previous_class: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchAdmissions = async () => {
    try {
      const response = await api.get("admissions/");
      setAdmissions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [deps, cls, divs] = await Promise.all([
        api.get("departments/"),
        api.get("classes/"),
        api.get("divisions/"),
      ]);
      setMetadata({
        departments: deps.data,
        classes: cls.data,
        divisions: divs.data,
      });
    } catch (error) {
      console.error("Error fetching metadata", error);
    }
  };

  useEffect(() => {
    fetchAdmissions();
    fetchMetadata();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleAddAdmission = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    try {
      await api.post("admissions/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData(initialFormData);
      fetchAdmissions();
      showAlert("success", "Success", "Admission added successfully!");
    } catch (error) {
      console.error(error);
      const backendErrors = error.response?.data;
      if (backendErrors) {
        let errorMessage = "Error adding admission:\n";
        Object.entries(backendErrors).forEach(([field, errors]) => {
          errorMessage += `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}\n`;
        });
        showAlert("error", "Validation Error", errorMessage);
      } else {
        showAlert(
          "error",
          "Network Error",
          "Error adding admission. Please check your network or try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment) {
      showAlert(
        "error",
        "Validation Error",
        "Please provide a department name.",
      );
      return;
    }
    try {
      await api.post("departments/", { department_name: newDepartment });
      setNewDepartment("");
      fetchMetadata();
      showAlert("success", "Success", "Department added!");
    } catch (error) {
      console.error(error);
      showAlert("error", "Error", "Failed to add department.");
    }
  };

  const handleAddClass = async () => {
    if (!newClass.class_name || !newClass.department) {
      showAlert(
        "error",
        "Validation Error",
        "Please fill in all class details (Name and Department).",
      );
      return;
    }
    try {
      await api.post("classes/", newClass);
      setNewClass({ class_name: "", department: "" });
      fetchMetadata();
      showAlert("success", "Success", "Class added!");
    } catch (error) {
      console.error(error);
      showAlert("error", "Error", "Failed to add class.");
    }
  };

  const handleAddDivision = async () => {
    if (
      !newDivision.division ||
      !newDivision.class_name ||
      !newDivision.class_teacher_name
    ) {
      showAlert(
        "error",
        "Validation Error",
        "Please fill in all division details (Division, Class Teacher, and Select Class).",
      );
      return;
    }
    try {
      await api.post("divisions/", newDivision);
      setNewDivision({ division: "", class_name: "", class_teacher_name: "" });
      fetchMetadata();
      showAlert("success", "Success", "Division added!");
    } catch (error) {
      console.error(error);
      showAlert("error", "Error", "Failed to add division.");
    }
  };

  return (
    <Box minH="100vh" py={10} px={4} bg="transparent">
      <Container maxW="container.xl">
        <VStack spaceY={10} align="stretch">
          {/* Header */}
          <HStack
            justify="space-between"
            className="glass-card"
            p={6}
            borderRadius="2xl"
            transition="all 0.3s ease"
          >
            <HStack spaceX={4}>
              <Box
                p={3}
                bg="var(--primary)"
                color="white"
                borderRadius="xl"
                shadow="md"
              >
                <GraduationCap size={32} />
              </Box>
              <Heading
                size="2xl"
                fontWeight="800"
                color="var(--primary-dark)"
                letterSpacing="tight"
              >
                School Management Hub
              </Heading>
            </HStack>
            <Button
              variant="outline"
              colorPalette="red"
              borderRadius="xl"
              px={6}
              _hover={{
                bg: "red.50",
                transform: "translateY(-2px)",
                shadow: "sm",
              }}
              transition="all 0.2s"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              Logout
            </Button>
          </HStack>

          <Box
            p={8}
            borderRadius="2xl"
            className="glass-card"
            transition="all 0.3s ease"
            _hover={{ shadow: "var(--glass-shadow)" }}
          >
            <VStack spaceY={8} align="stretch">
              <HStack
                borderBottom="2px solid"
                borderColor="var(--light-gray)"
                pb={4}
              >
                <Box
                  p={2}
                  bg="blue.50"
                  color="var(--primary)"
                  borderRadius="lg"
                >
                  <UserCircle size={24} />
                </Box>
                <Heading size="xl" color="var(--primary-dark)" fontWeight="700">
                  New Student Admission
                </Heading>
              </HStack>
              <form onSubmit={handleAddAdmission} noValidate>
                <Tabs.Root
                  defaultValue="academic"
                  variant="enclosed"
                  colorPalette="blue"
                >
                  <Tabs.List
                    overflowX="auto"
                    whiteSpace="nowrap"
                    mb={6}
                    borderBottom="none"
                    p={1}
                    bg="gray.100"
                    borderRadius="xl"
                    shadow="inner"
                  >
                    <Tabs.Trigger value="academic">
                      <BookOpen size={16} /> Academic
                    </Tabs.Trigger>
                    <Tabs.Trigger value="personal">
                      <User size={16} /> Personal
                    </Tabs.Trigger>
                    <Tabs.Trigger value="family">
                      <Users size={16} /> Family
                    </Tabs.Trigger>
                    <Tabs.Trigger value="address">
                      <MapPin size={16} /> Address
                    </Tabs.Trigger>
                    <Tabs.Trigger value="additional">
                      <Info size={16} /> Additional
                    </Tabs.Trigger>
                    <Tabs.Trigger value="previous">
                      <History size={16} /> History
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="academic">
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} p={2}>
                      <Field label="Admission Number">
                        <Input
                          name="admission_number"
                          value={formData.admission_number}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Admission Date">
                        <Input
                          type="date"
                          name="admission_date"
                          value={formData.admission_date}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Academic Period">
                        <Input
                          name="academic_period"
                          value={formData.academic_period}
                          onChange={handleInputChange}
                         
                          placeholder="2024-2025"
                        />
                      </Field>
                      <Field label="Department">
                        <NativeSelectRoot>
                          <NativeSelectField
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                           
                            items={metadata.departments.map((d) => ({
                              label: d.department_name,
                              value: d.id.toString(),
                            }))}
                          >
                            <option value="" disabled>
                              Select Department
                            </option>
                          </NativeSelectField>
                        </NativeSelectRoot>
                      </Field>
                      <Field label="Class">
                        <NativeSelectRoot>
                          <NativeSelectField
                            name="class_name"
                            value={formData.class_name}
                            onChange={handleInputChange}
                           
                            items={metadata.classes.map((c) => ({
                              label: c.division
                                ? `${c.class_name} - ${c.division}`
                                : c.class_name,
                              value: c.id.toString(),
                            }))}
                          >
                            <option value="" disabled>
                              Select Class
                            </option>
                          </NativeSelectField>
                        </NativeSelectRoot>
                      </Field>
                    </SimpleGrid>
                  </Tabs.Content>

                  <Tabs.Content value="personal">
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} p={2}>
                      <Field label="First Name">
                        <Input
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Middle Name">
                        <Input
                          name="middle_name"
                          value={formData.middle_name}
                          onChange={handleInputChange}
                        />
                      </Field>
                      <Field label="Last Name">
                        <Input
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Gender">
                        <NativeSelectRoot>
                          <NativeSelectField
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                           
                            items={["Male", "Female", "Other"]}
                          />
                        </NativeSelectRoot>
                      </Field>
                      <Field label="Date of Birth">
                        <Input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Place of Birth">
                        <Input
                          name="place_of_birth"
                          value={formData.place_of_birth}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Student Photo">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          border="none"
                          p={0}
                        />
                      </Field>
                    </SimpleGrid>
                  </Tabs.Content>

                  <Tabs.Content value="family">
                    <VStack align="stretch" spaceY={4}>
                      <Box bg="gray.50" p={4} borderRadius="md">
                        <Text fontWeight="bold" mb={2}>
                          Father's Details
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                          <Field label="Father Name">
                            <Input
                              placeholder="Full Name"
                              name="father_name"
                              value={formData.father_name}
                              onChange={handleInputChange}
                             
                            />
                          </Field>
                          <Field label="Occupation">
                            <Input
                              placeholder="Occupation"
                              name="father_occupation"
                              value={formData.father_occupation}
                              onChange={handleInputChange}
                             
                            />
                          </Field>
                          <Field label="Qualification">
                            <Input
                              placeholder="Qualification"
                              name="father_qualification"
                              value={formData.father_qualification}
                              onChange={handleInputChange}
                             
                            />
                          </Field>
                          <Field label="Annual Income">
                            <Input
                              placeholder="Income"
                              name="father_income"
                              value={formData.father_income}
                              onChange={handleInputChange}
                             
                            />
                          </Field>
                          <Field label="Mobile Number">
                            <Input
                              placeholder="Mobile"
                              name="father_mobile"
                              value={formData.father_mobile}
                              onChange={handleInputChange}
                             
                            />
                          </Field>
                          <Field label="Email Address">
                            <Input
                              type="email"
                              placeholder="Email"
                              name="father_email"
                              value={formData.father_email}
                              onChange={handleInputChange}
                            />
                          </Field>
                        </SimpleGrid>
                      </Box>
                      <Box bg="gray.50" p={4} borderRadius="md">
                        <Text fontWeight="bold" mb={2}>
                          Mother's Details
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                          <Field label="Mother Name">
                            <Input
                              placeholder="Full Name"
                              name="mother_name"
                              value={formData.mother_name}
                              onChange={handleInputChange}
                             
                            />
                          </Field>
                          <Field label="Occupation">
                            <Input
                              placeholder="Occupation"
                              name="mother_occupation"
                              value={formData.mother_occupation}
                              onChange={handleInputChange}
                             
                            />
                          </Field>
                          <Field label="Qualification">
                            <Input
                              placeholder="Qualification"
                              name="mother_qualification"
                              value={formData.mother_qualification}
                              onChange={handleInputChange}
                             
                            />
                          </Field>
                          <Field label="Annual Income">
                            <Input
                              placeholder="Income"
                              name="mother_income"
                              value={formData.mother_income}
                              onChange={handleInputChange}
                             
                            />
                          </Field>
                          <Field label="Mobile Number">
                            <Input
                              placeholder="Mobile"
                              name="mother_mobile"
                              value={formData.mother_mobile}
                              onChange={handleInputChange}
                             
                            />
                          </Field>
                          <Field label="Email Address">
                            <Input
                              type="email"
                              placeholder="Email"
                              name="mother_email"
                              value={formData.mother_email}
                              onChange={handleInputChange}
                            />
                          </Field>
                        </SimpleGrid>
                      </Box>
                      <Box bg="gray.50" p={4} borderRadius="md">
                        <Text fontWeight="bold" mb={2}>
                          Guardian's Details (Optional)
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                          <Input
                            placeholder="Guardian Name"
                            name="guardian_name"
                            value={formData.guardian_name}
                            onChange={handleInputChange}
                          />
                          <Input
                            placeholder="Occupation"
                            name="guardian_occupation"
                            value={formData.guardian_occupation}
                            onChange={handleInputChange}
                          />
                          <Input
                            placeholder="Income"
                            name="guardian_income"
                            value={formData.guardian_income}
                            onChange={handleInputChange}
                          />
                          <Input
                            placeholder="Mobile"
                            name="guardian_mobile"
                            value={formData.guardian_mobile}
                            onChange={handleInputChange}
                          />
                          <Input
                            type="email"
                            placeholder="Email"
                            name="guardian_email"
                            value={formData.guardian_email}
                            onChange={handleInputChange}
                          />
                        </SimpleGrid>
                      </Box>
                    </VStack>
                  </Tabs.Content>

                  <Tabs.Content value="address">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} p={2}>
                      <Field
                        label="Current Address"
                       
                        gridColumn="span 2"
                      >
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="District">
                        <Input
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="State">
                        <Input
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Post Office">
                        <Input
                          name="post_office"
                          value={formData.post_office}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Pin Code">
                        <Input
                          name="pin_code"
                          value={formData.pin_code}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                    </SimpleGrid>
                  </Tabs.Content>

                  <Tabs.Content value="additional">
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} p={2}>
                      <Field label="Aadhar Number">
                        <Input
                          name="aadhar_number"
                          value={formData.aadhar_number}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Blood Group">
                        <Input
                          name="blood_group"
                          value={formData.blood_group}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Nationality">
                        <Input
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Mother Tongue">
                        <Input
                          name="mother_tongue"
                          value={formData.mother_tongue}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Religion">
                        <Input
                          name="religion"
                          value={formData.religion}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Caste">
                        <Input
                          name="caste"
                          value={formData.caste}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                      <Field label="Category">
                        <Input
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                         
                        />
                      </Field>
                    </SimpleGrid>
                  </Tabs.Content>

                  <Tabs.Content value="previous">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} p={2}>
                      <Field label="TC Number">
                        <Input
                          name="tc_number"
                          value={formData.tc_number}
                          onChange={handleInputChange}
                        />
                      </Field>
                      <Field label="TC Date">
                        <Input
                          type="date"
                          name="tc_date"
                          value={formData.tc_date}
                          onChange={handleInputChange}
                        />
                      </Field>
                      <Field label="Previous School Name">
                        <Input
                          name="school_name"
                          value={formData.school_name}
                          onChange={handleInputChange}
                        />
                      </Field>
                      <Field label="Previous Class">
                        <Input
                          name="previous_class"
                          value={formData.previous_class}
                          onChange={handleInputChange}
                        />
                      </Field>
                    </SimpleGrid>
                  </Tabs.Content>
                </Tabs.Root>

                <Button
                  type="submit"
                  mt={8}
                  size="xl"
                  py={6}
                  bg="var(--primary)"
                  color="white"
                  borderRadius="xl"
                  shadow="lg"
                  _hover={{
                    bg: "var(--primary-dark)",
                    transform: "translateY(-2px)",
                    shadow: "xl",
                  }}
                  transition="all 0.3s ease"
                  w="100%"
                  disabled={loading}
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Save size={22} style={{ marginRight: "10px" }} />
                      <Text fontSize="lg" fontWeight="bold">
                        Submit Student Admission
                      </Text>
                    </>
                  )}
                </Button>
              </form>
            </VStack>
          </Box>

          <Box
            p={8}
            borderRadius="2xl"
            className="glass-card"
            transition="all 0.3s ease"
            _hover={{ shadow: "var(--glass-shadow)" }}
          >
            <VStack spaceY={6} align="stretch">
              <HStack
                borderBottom="2px solid"
                borderColor="var(--light-gray)"
                pb={4}
              >
                <Box p={2} bg="green.50" color="green.600" borderRadius="lg">
                  <Users size={24} />
                </Box>
                <Heading size="xl" color="var(--primary-dark)" fontWeight="700">
                  Admitted Students Directory
                </Heading>
              </HStack>
              <Box
                overflowX="auto"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                bg="white"
              >
                <Table.Root variant="outline" size="md">
                  <Table.Header>
                    <Table.Row bg="gray.100">
                      <Table.ColumnHeader>Photo</Table.ColumnHeader>
                      <Table.ColumnHeader>Adm #</Table.ColumnHeader>
                      <Table.ColumnHeader>Name</Table.ColumnHeader>
                      <Table.ColumnHeader>Class & Div</Table.ColumnHeader>
                      <Table.ColumnHeader>Guardian Mobile</Table.ColumnHeader>
                      <Table.ColumnHeader>Date</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {admissions.map((adm) => (
                      <Table.Row key={adm.id}>
                        <Table.Cell>
                          {adm.photo ? (
                            <Image
                              src={adm.photo}
                              alt={adm.first_name}
                              boxSize="40px"
                              borderRadius="full"
                              objectFit="cover"
                            />
                          ) : (
                            <UserCircle size={40} color="gray" />
                          )}
                        </Table.Cell>
                        <Table.Cell fontWeight="bold">
                          {adm.admission_number}
                        </Table.Cell>
                        <Table.Cell>{`${adm.first_name} ${adm.last_name}`}</Table.Cell>
                        <Table.Cell>
                          {(() => {
                            const cls = metadata.classes.find(
                              (c) => c.id === adm.class_name,
                            );
                            const div = metadata.divisions.find(
                              (d) => d.id === adm.division,
                            );
                            if (cls) {
                              const classBase = cls.class_name;
                              const classDiv =
                                cls.division || (div ? div.division : "");
                              return classDiv
                                ? `${classBase} - ${classDiv}`
                                : classBase;
                            }
                            return "N/A";
                          })()}
                        </Table.Cell>
                        <Table.Cell>
                          {adm.father_mobile ||
                            adm.mother_mobile ||
                            adm.guardian_mobile}
                        </Table.Cell>
                        <Table.Cell>{adm.admission_date}</Table.Cell>
                      </Table.Row>
                    ))}
                    {admissions.length === 0 && (
                      <Table.Row>
                        <Table.Cell colSpan={6} textAlign="center" py={4}>
                          No admissions recorded yet.
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>
            </VStack>
          </Box>
          <Box
            p={8}
            borderRadius="2xl"
            className="glass-card"
            transition="all 0.3s ease"
            _hover={{ shadow: "var(--glass-shadow)" }}
          >
            <VStack spaceY={6} align="stretch">
              <HStack
                borderBottom="2px solid"
                borderColor="var(--light-gray)"
                pb={4}
              >
                <Box p={2} bg="purple.50" color="purple.600" borderRadius="lg">
                  <Info size={24} />
                </Box>
                <Heading size="xl" color="var(--primary-dark)" fontWeight="700">
                  System Setup (Metadata Control)
                </Heading>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                {/* Add Department */}
                <VStack
                  align="stretch"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.100"
                  shadow="sm"
                  p={6}
                  borderRadius="xl"
                  transition="all 0.2s"
                  _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                >
                  <Text fontWeight="800" color="gray.700">
                    Add Department
                  </Text>
                  <Input
                    placeholder="Department Name"
                    bg="white"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                  />
                  <Button
                    mt={2}
                    bg="var(--primary)"
                    color="white"
                    _hover={{ bg: "var(--primary-dark)" }}
                    borderRadius="lg"
                    shadow="sm"
                    onClick={handleAddDepartment}
                  >
                    <Plus size={16} style={{ marginRight: "8px" }} />
                    Create Dept
                  </Button>
                </VStack>

                {/* Add Class */}
                <VStack
                  align="stretch"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.100"
                  shadow="sm"
                  p={6}
                  borderRadius="xl"
                  transition="all 0.2s"
                  _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                >
                  <Text fontWeight="800" color="gray.700">
                    Add Class
                  </Text>
                  <Input
                    placeholder="Class Name (e.g. Grade 10)"
                    bg="white"
                    value={newClass.class_name}
                    onChange={(e) =>
                      setNewClass({ ...newClass, class_name: e.target.value })
                    }
                  />
                  <NativeSelectRoot>
                    <NativeSelectField
                      bg="white"
                      value={newClass.department}
                      onChange={(e) =>
                        setNewClass({ ...newClass, department: e.target.value })
                      }
                      items={metadata.departments.map((d) => ({
                        label: d.department_name,
                        value: d.id.toString(),
                      }))}
                    >
                      <option value="" disabled>
                        Select Department
                      </option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                  <Button
                    mt={2}
                    bg="var(--primary)"
                    color="white"
                    _hover={{ bg: "var(--primary-dark)" }}
                    borderRadius="lg"
                    shadow="sm"
                    onClick={handleAddClass}
                  >
                    <Plus size={16} style={{ marginRight: "8px" }} />
                    Create Class
                  </Button>
                </VStack>

                {/* Add Division */}
                <VStack
                  align="stretch"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.100"
                  shadow="sm"
                  p={6}
                  borderRadius="xl"
                  transition="all 0.2s"
                  _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                >
                  <Text fontWeight="800" color="gray.700">
                    Add Division
                  </Text>
                  <Input
                    placeholder="Division (e.g. A)"
                    bg="white"
                    value={newDivision.division}
                    onChange={(e) =>
                      setNewDivision({
                        ...newDivision,
                        division: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Class Teacher Name"
                    bg="white"
                    value={newDivision.class_teacher_name}
                    onChange={(e) =>
                      setNewDivision({
                        ...newDivision,
                        class_teacher_name: e.target.value,
                      })
                    }
                  />
                  <NativeSelectRoot>
                    <NativeSelectField
                      bg="white"
                      value={newDivision.class_name}
                      onChange={(e) =>
                        setNewDivision({
                          ...newDivision,
                          class_name: e.target.value,
                        })
                      }
                      items={metadata.classes.map((c) => ({
                        label: c.division
                          ? `${c.class_name} - ${c.division}`
                          : c.class_name,
                        value: c.id.toString(),
                      }))}
                    >
                      <option value="" disabled>
                        Select Class
                      </option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                  <Button
                    mt={2}
                    bg="var(--primary)"
                    color="white"
                    _hover={{ bg: "var(--primary-dark)" }}
                    borderRadius="lg"
                    shadow="sm"
                    onClick={handleAddDivision}
                  >
                    <Plus size={16} style={{ marginRight: "8px" }} />
                    Create Division
                  </Button>
                </VStack>
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </Box>
  );
};

export default Dashboard;
