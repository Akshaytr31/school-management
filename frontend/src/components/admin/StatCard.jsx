import { Box, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const StatCard = ({ label, value, icon: Icon, color, delay }) => (
  <MotionBox
    p={6}
    borderRadius="2xl"
    className="glass-card"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
  >
    <HStack justify="space-between">
      <VStack align="start" spaceY={1}>
        <Text color="gray.500" fontWeight="medium">
          {label}
        </Text>
        <Heading size="xl">{value}</Heading>
      </VStack>
      <Box p={4} bg={`${color}.50`} color={`${color}.500`} borderRadius="2xl">
        <Icon size={28} />
      </Box>
    </HStack>
  </MotionBox>
);

export default StatCard;
