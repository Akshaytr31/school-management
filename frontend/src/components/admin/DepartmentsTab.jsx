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
  Table,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Briefcase, Plus, Trash2 } from "lucide-react";

const MotionBox = motion(Box);

const DepartmentsTab = ({
  departments,
  loading,
  handleAddDept,
  handleDeleteDept,
  // Form states
  newDeptName,
  setNewDeptName,
}) => {
  return (
    <MotionBox
      key="departments"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Grid templateColumns={{ base: "1fr", lg: "0.6fr 0.4fr" }} gap={8}>
        {/* Departments List */}
        <Box p={6} borderRadius="2xl" className="glass-card">
          <VStack align="stretch" spaceY={6}>
            <HStack justify="space-between">
              <HStack spaceX={3}>
                <Box bg="green.50" p={2} borderRadius="lg" color="green.500">
                  <Briefcase size={20} />
                </Box>
                <Heading size="md">All Departments</Heading>
              </HStack>
              <Badge colorPalette="green" variant="subtle" borderRadius="lg">
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
                    <Table.ColumnHeader color="gray.600">ID</Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.600">
                      Action
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {departments.map((dept) => (
                    <Table.Row
                      key={dept.id}
                      _hover={{ bg: "rgba(70, 101, 193, 0.05)" }}
                      transition="0.2s"
                    >
                      <Table.Cell fontWeight="medium">
                        {dept.department_name}
                      </Table.Cell>
                      <Table.Cell color="gray.500">#{dept.id}</Table.Cell>
                      <Table.Cell>
                        <IconButton
                          size="xs"
                          variant="ghost"
                          color="red.500"
                          _hover={{ bg: "red.50" }}
                          onClick={() => handleDeleteDept(dept.id)}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </VStack>
        </Box>

        {/* Add Department Form */}
        <Box p={6} borderRadius="2xl" className="glass-card">
          <VStack align="stretch" spaceY={6}>
            <HStack spaceX={3}>
              <Box bg="green.50" p={2} borderRadius="lg" color="green.500">
                <Plus size={20} />
              </Box>
              <Heading size="md">Add Department</Heading>
            </HStack>
            <form onSubmit={handleAddDept}>
              <VStack spaceY={4}>
                <VStack align="start" w="100%" spaceY={1}>
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
                  />
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
                  Create Department
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Grid>
    </MotionBox>
  );
};

export default DepartmentsTab;
