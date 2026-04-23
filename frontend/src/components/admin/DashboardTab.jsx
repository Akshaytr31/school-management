import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  Text,
  VStack,
  Table,
  Badge,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  Plus,
  Users,
  BookOpen,
  Briefcase,
  GraduationCap,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
} from "lucide-react";

const MotionBox = motion.create(Box);

const OverviewMiniCard = ({ label, value, icon: Icon, color }) => (
  <HStack
    p={4}
    borderRadius="xl"
    border="1px solid"
    borderColor="gray.100"
    bg="gray.50"
    _hover={{ bg: "gray.100" }}
    transition="0.2s"
    gap={4}
  >
    <Box p={3} borderRadius="lg" bg={`${color}.100`} color={`${color}.600`}>
      <Icon size={20} />
    </Box>
    <VStack align="start" gap={0}>
      <Text fontSize="xl" fontWeight="bold" color="gray.800">
        {value}
      </Text>
      <Text fontSize="sm" color="gray.500" fontWeight="medium">
        {label}
      </Text>
    </VStack>
  </HStack>
);

const DashboardTab = ({
  teachers,
  allSubjects,
  departments,
  classes = [],
  admissions = [],
}) => {
  return (
    <MotionBox
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <HStack justify="space-between" mb={8}>
        <VStack align="start" gap={1}>
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
            gap={2}
          >
            <Plus size={18} />
            <Text>Quick Action</Text>
          </Button>
        </HStack>
      </HStack>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={10}>
        {/* Institute Overview Card */}
        <Box
          p={6}
          borderRadius="2xl"
          className="glass-card"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="sm"
        >
          <Heading size="md" mb={6} color="gray.800">
            Institute Overview
          </Heading>
          <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
            <OverviewMiniCard
              label="Total Teachers"
              value={teachers.length}
              icon={Users}
              color="blue"
            />
            <OverviewMiniCard
              label="Students"
              value={admissions.length}
              icon={GraduationCap}
              color="purple"
            />
            <OverviewMiniCard
              label="Class Teachers"
              value={classes.length}
              icon={BookOpen}
              color="orange"
            />
            <OverviewMiniCard
              label="Non-teaching Staffs"
              value={15} // Mock data
              icon={Briefcase}
              color="green"
            />
          </Grid>
        </Box>

        {/* Financial Overview Card */}
        <Box
          p={6}
          borderRadius="2xl"
          className="glass-card"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="sm"
        >
          <Heading size="md" mb={6} color="gray.800">
            Financial Overview
          </Heading>
          <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
            <OverviewMiniCard
              label="Monthly Income"
              value="₹4,50,000"
              icon={Wallet}
              color="green"
            />
            <OverviewMiniCard
              label="Net Expenses"
              value="₹2,10,000"
              icon={TrendingDown}
              color="red"
            />
            <OverviewMiniCard
              label="Net Profit"
              value="₹2,40,000"
              icon={TrendingUp}
              color="blue"
            />
            <OverviewMiniCard
              label="Pending Fees"
              value="₹75,000"
              icon={CreditCard}
              color="orange"
            />
          </Grid>
        </Box>
      </Grid>

      <Grid templateColumns={{ base: "1fr", lg: "1.2fr 0.8fr" }} gap={8}>
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
                      <HStack gap={3}>
                        <Box
                          w={8}
                          h={8}
                          borderRadius="full"
                          bg="var(--primary)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                          fontWeight="bold"
                          fontSize="xs"
                        >
                          {(teacher.profile?.full_name || "N").charAt(0)}
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
                            >
                              {s.subject_name}
                            </Badge>
                          ))}
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      </Grid>
    </MotionBox>
  );
};

export default DashboardTab;
