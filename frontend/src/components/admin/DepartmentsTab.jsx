import {
  Box,
  Button,
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
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../ui/dialog";

const MotionBox = motion.create(Box);

const DepartmentsTab = ({
  departments,
  loading,
  handleAddDept,
  handleDeleteDept,
  // Form states
  newDeptName,
  setNewDeptName,
  isOpen,
  setIsOpen,
  isEditMode,
  onCardClick,
}) => {
  return (
    <MotionBox
      key="departments"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <VStack align="stretch" gap={6}>
        {/* Departments Header & List */}
        <Box
          p={6}
          borderRadius="2xl"
          className="glass-card"
          minH="calc(100vh - 120px)"
        >
          <VStack align="stretch" gap={6}>
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <HStack gap={3}>
                <Box bg="green.50" p={2} borderRadius="lg" color="green.500">
                  <Briefcase size={20} />
                </Box>
                <VStack align="start" gap={0}>
                  <Heading size="md">All Departments</Heading>
                  <Text fontSize="sm" color="gray.500">
                    Manage school departments and faculties
                  </Text>
                </VStack>
              </HStack>
              <HStack gap={3}>
                <Badge colorPalette="green" variant="subtle" borderRadius="lg">
                  {departments.length} Total
                </Badge>
                <Button
                  bg="var(--primary)"
                  color="white"
                  borderRadius="xl"
                  onClick={() => setIsOpen(true)}
                  _hover={{ bg: "var(--primary-dark)" }}
                >
                  <Plus size={18} /> Add Department
                </Button>
              </HStack>
            </HStack>

            <Box w="100%" overflowX="hidden">
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
                      _hover={{
                        bg: "rgba(70, 101, 193, 0.05)",
                        cursor: "pointer",
                      }}
                      transition="0.2s"
                      onClick={() => onCardClick(dept)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDept(dept.id);
                          }}
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
      </VStack>
    </MotionBox>
  );
};

export default DepartmentsTab;
