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
import { Plus, Users, BookOpen, Briefcase } from "lucide-react";
import StatCard from "./StatCard";

const MotionBox = motion(Box);

const DashboardTab = ({ teachers, allSubjects, departments }) => {
  return (
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

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        mb={10}
      >
        <StatCard
          label="Total Teachers"
          value={teachers.length}
          icon={Users}
          color="blue"
          delay={0.1}
        />
        <StatCard
          label="Total Subjects"
          value={allSubjects.length}
          icon={BookOpen}
          color="purple"
          delay={0.2}
        />
        <StatCard
          label="Departments"
          value={departments.length}
          icon={Briefcase}
          color="orange"
          delay={0.3}
        />
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
                      <HStack spaceX={3}>
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
