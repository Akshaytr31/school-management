import React from "react";
import {
  Box,
  Button,
  HStack,
  Heading,
  Text,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

const BaseDetailView = ({
  title,
  subtitle,
  onBack,
  onEdit,
  onDelete,
  children,
  actions,
  icon: Icon,
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      w="100%"
    >
      <VStack align="stretch" gap={6}>
        {/* Header Navigation */}
        <HStack justify="space-between">
          <Button variant="ghost" onClick={onBack} _hover={{ bg: "gray.100" }}>
            <HStack gap={2}>
              <ArrowLeft size={18} />
              <Text>Back to List</Text>
            </HStack>
          </Button>

          <HStack gap={3}>
            {onEdit && (
              <Button
                variant="outline"
                borderColor="blue.200"
                color="blue.600"
                _hover={{ bg: "blue.50" }}
                onClick={onEdit}
              >
                <HStack gap={2}>
                  <Edit size={16} />
                  <Text>Edit</Text>
                </HStack>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                borderColor="red.200"
                color="red.600"
                _hover={{ bg: "red.50" }}
                onClick={onDelete}
              >
                <HStack gap={2}>
                  <Trash2 size={16} />
                  <Text>Delete</Text>
                </HStack>
              </Button>
            )}
            {actions}
          </HStack>
        </HStack>

        {/* Hero Section */}
        <Box
          p={8}
          borderRadius="3xl"
          className="glass-card"
          bg="linear-gradient(135deg, white 0%, #f8fafc 100%)"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="lg"
        >
          <HStack gap={6} align="start">
            {Icon && (
              <Box
                p={4}
                borderRadius="2xl"
                bg="blue.500"
                color="white"
                boxShadow="xl"
              >
                <Icon size={32} />
              </Box>
            )}
            <VStack align="start" gap={1}>
              <Heading size="xl" color="gray.800">
                {title}
              </Heading>
              <Text fontSize="lg" color="gray.500" fontWeight="medium">
                {subtitle}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Content Area */}
        <Box w="100%">{children}</Box>
      </VStack>
    </MotionBox>
  );
};

export default BaseDetailView;
