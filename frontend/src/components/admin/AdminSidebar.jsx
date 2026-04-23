import { Box, Button, VStack, HStack, Heading, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  Folder,
} from "lucide-react";

const MotionBox = motion(Box);

const AdminSidebar = ({
  sidebarItems,
  activeTab,
  setActiveTab,
  isClassesExpanded,
  setIsClassesExpanded,
  expandedCategories,
  setExpandedCategories,
  classes,
  selectedClassGroup,
  setSelectedClassGroup,
  setViewingStudents,
  setSelectedClass,
  handleLogout,
}) => {
  return (
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
          {sidebarItems.map((item) => {
            if (item.id === "classes") {
              const groupedByCat = classes.reduce((acc, cls) => {
                const cat = cls.category || "Primary";
                if (!acc[cat]) acc[cat] = {};
                if (!acc[cat][cls.class_name]) acc[cat][cls.class_name] = [];
                acc[cat][cls.class_name].push(cls);
                return acc;
              }, {});

              return (
                <VStack key={item.id} align="stretch" spaceY={1}>
                  <Button
                    variant={activeTab === "classes" ? "solid" : "ghost"}
                    bg={
                      activeTab === "classes" ? "var(--primary)" : "transparent"
                    }
                    color={activeTab === "classes" ? "white" : "var(--gray)"}
                    _hover={{
                      bg:
                        activeTab === "classes"
                          ? "var(--primary)"
                          : "rgba(70, 101, 193, 0.1)",
                      color:
                        activeTab === "classes" ? "white" : "var(--primary)",
                    }}
                    justifyContent="space-between"
                    py={6}
                    borderRadius="xl"
                    onClick={() => {
                      setIsClassesExpanded(!isClassesExpanded);
                      setActiveTab("classes");
                      setSelectedClassGroup(null);
                      setViewingStudents(false);
                    }}
                  >
                    <HStack spaceX={3}>
                      <item.icon size={20} />
                      <Text fontWeight="medium">{item.label}</Text>
                    </HStack>
                    {isClassesExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </Button>

                  <AnimatePresence>
                    {isClassesExpanded && (
                      <MotionBox
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        overflow="hidden"
                        pl={4}
                      >
                        <VStack align="stretch" spaceY={1} py={1}>
                          {Object.keys(groupedByCat).map((cat) => (
                            <VStack key={cat} align="stretch" spaceY={1}>
                              <Button
                                size="sm"
                                variant="ghost"
                                color="gray.600"
                                justifyContent="space-between"
                                p={3}
                                borderRadius="lg"
                                onClick={() => {
                                  setExpandedCategories((prev) =>
                                    prev.includes(cat)
                                      ? prev.filter((c) => c !== cat)
                                      : [...prev, cat],
                                  );
                                }}
                              >
                                <HStack spaceX={2}>
                                  <Folder size={16} />
                                  <Text fontSize="sm">{cat}</Text>
                                </HStack>
                                {expandedCategories.includes(cat) ? (
                                  <ChevronDown size={14} />
                                ) : (
                                  <ChevronRight size={14} />
                                )}
                              </Button>

                              {expandedCategories.includes(cat) && (
                                <VStack align="stretch" spaceY={0} pl={6}>
                                  {Object.keys(groupedByCat[cat]).map(
                                    (className) => (
                                      <Button
                                        key={className}
                                        size="xs"
                                        variant="ghost"
                                        justifyContent="flex-start"
                                        p={2}
                                        h="auto"
                                        borderRadius="md"
                                        color={
                                          selectedClassGroup === className
                                            ? "var(--primary)"
                                            : "gray.500"
                                        }
                                        bg={
                                          selectedClassGroup === className
                                            ? "blue.50"
                                            : "transparent"
                                        }
                                        onClick={() => {
                                          setActiveTab("classes");
                                          setSelectedClassGroup(className);
                                          setViewingStudents(false);
                                          setSelectedClass(null);
                                        }}
                                      >
                                        <Text fontSize="xs">{className}</Text>
                                      </Button>
                                    ),
                                  )}
                                </VStack>
                              )}
                            </VStack>
                          ))}
                        </VStack>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </VStack>
              );
            }

            return (
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
                onClick={() => {
                  setActiveTab(item.id);
                  setViewingStudents(false);
                  setSelectedClass(null);
                  setSelectedClassGroup(null);
                }}
              >
                <item.icon size={20} />
                <Text fontWeight="medium">{item.label}</Text>
              </Button>
            );
          })}
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
  );
};

export default AdminSidebar;
