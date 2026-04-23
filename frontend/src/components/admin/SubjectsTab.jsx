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
  Stack,
} from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";
import { motion } from "framer-motion";
import { BookOpen, Plus, Book, Trash2, ChevronRight } from "lucide-react";
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
const MotionHStack = motion.create(HStack);

const SubjectsTab = ({
  allSubjects,
  departments,
  classes,
  loading,
  handleAddSubject,
  handleDeleteSubject,
  // Form states
  newSubjectName,
  setNewSubjectName,
  newSubjectType,
  setNewSubjectType,
  newSubjectDept,
  setNewSubjectDept,
  newSubjectClasses,
  setNewSubjectClasses,
  isOpen,
  setIsOpen,
  isEditMode,
  onCardClick,
}) => {
  return (
    <MotionBox
      key="subjects"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <VStack align="stretch" gap={6}>
        {/* Subjects Header & List */}
        <Box
          p={6}
          borderRadius="2xl"
          className="glass-card"
          minH="calc(100vh - 120px)"
        >
          <VStack align="stretch" gap={6}>
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <HStack gap={3}>
                <Box bg="purple.50" p={2} borderRadius="lg" color="purple.500">
                  <BookOpen size={20} />
                </Box>
                <VStack align="start" gap={0}>
                  <Heading size="md">All Subjects</Heading>
                  <Text fontSize="sm" color="gray.500">
                    Manage available subjects and class assignments
                  </Text>
                </VStack>
              </HStack>
              <HStack gap={3}>
                <Badge colorPalette="purple" variant="subtle" borderRadius="lg">
                  {allSubjects.length} Total
                </Badge>
                <Button
                  bg="var(--primary)"
                  color="white"
                  borderRadius="xl"
                  onClick={() => setIsOpen(true)}
                  _hover={{ bg: "var(--primary-dark)" }}
                >
                  <Plus size={18} /> Add Subject
                </Button>
              </HStack>
            </HStack>

            <Box w="100%" overflowX="hidden">
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)",
                }}
                gap={6}
              >
                {allSubjects.map((sub, idx) => (
                  <MotionBox
                    key={sub.id}
                    p={5}
                    borderRadius="2xl"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.100"
                    boxShadow="sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    position="relative"
                    cursor="pointer"
                    onClick={() => onCardClick(sub)}
                    _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                  >
                    <VStack align="start" gap={4}>
                      <HStack justify="space-between" w="100%">
                        <Box bg="purple.50" p={2} borderRadius="lg">
                          <Book size={20} color="#6B46C1" />
                        </Box>
                        <IconButton
                          size="xs"
                          variant="ghost"
                          color="red.500"
                          _hover={{ bg: "red.50" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubject(sub.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </HStack>
                      <VStack align="start" gap={1}>
                        <Text fontWeight="bold" fontSize="md">
                          {sub.subject_name}
                        </Text>
                        <HStack flexWrap="wrap" gap={1}>
                          <Badge
                            size="xs"
                            variant="outline"
                            colorPalette="gray"
                          >
                            {sub.subject_type}
                          </Badge>
                          <Badge
                            size="xs"
                            colorPalette="purple"
                            variant="subtle"
                          >
                            {sub.classes?.length || 0} Classes
                          </Badge>
                        </HStack>
                      </VStack>
                      <Text fontSize="xs" color="gray.400">
                        ID: #{sub.id}
                      </Text>
                    </VStack>
                  </MotionBox>
                ))}
              </Grid>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </MotionBox>
  );
};

export default SubjectsTab;
