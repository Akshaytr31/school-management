import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogActionTrigger,
} from "../ui/dialog";
import { Button, VStack, HStack, Text, Box } from "@chakra-ui/react";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

/**
 * A premium custom alert modal to replace native browser alerts.
 * @param {boolean} isOpen - Whether the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {string} title - Modal title.
 * @param {string} message - Modal body message.
 * @param {string} type - Alert type: 'success', 'error', 'info', 'warning'.
 */
const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={40} color="#38A169" />;
      case "error":
        return <XCircle size={40} color="#E53E3E" />;
      case "warning":
        return <AlertCircle size={40} color="#DD6B20" />;
      default:
        return <Info size={40} color="#3182CE" />;
    }
  };

  const getColorTheme = () => {
    switch (type) {
      case "success":
        return { bg: "green.50", border: "green.100" };
      case "error":
        return { bg: "red.50", border: "red.100" };
      case "warning":
        return { bg: "orange.50", border: "orange.100" };
      default:
        return { bg: "blue.50", border: "blue.100" };
    }
  };

  const theme = getColorTheme();

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="sm"
      placement="center"
    >
      <DialogContent
        borderRadius="2xl"
        className="glass-card"
        p={4}
        bg="white"
        mx={4}
        maxH="90vh"
        display="flex"
        flexDirection="column"
        style={{
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <DialogHeader pt={6}>
          <VStack gap={4} align="center">
            <Box
              p={4}
              bg={theme.bg}
              borderRadius="full"
              border="2px solid"
              borderColor={theme.border}
            >
              {getIcon()}
            </Box>
            <DialogTitle fontSize="xl" fontWeight="bold" textAlign="center">
              {title}
            </DialogTitle>
          </VStack>
        </DialogHeader>
        <DialogBody pb={6} overflowY="auto">
          <Text color="gray.600" textAlign="center" fontSize="md">
            {message}
          </Text>
        </DialogBody>
        <DialogFooter>
          {onConfirm ? (
            <HStack w="100%" gap={3}>
              <DialogActionTrigger asChild>
                <Button
                  onClick={onClose}
                  flex={1}
                  variant="outline"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.200"
                  py={6}
                >
                  Cancel
                </Button>
              </DialogActionTrigger>
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                flex={1}
                bg={
                  type === "warning" || type === "error"
                    ? "red.500"
                    : "var(--primary)"
                }
                color="white"
                _hover={{
                  bg:
                    type === "warning" || type === "error"
                      ? "red.600"
                      : "var(--primary-dark)",
                }}
                borderRadius="xl"
                py={6}
              >
                Confirm
              </Button>
            </HStack>
          ) : (
            <DialogActionTrigger asChild>
              <Button
                onClick={onClose}
                w="100%"
                bg="var(--primary)"
                color="white"
                _hover={{ bg: "var(--primary-dark)" }}
                borderRadius="xl"
                py={6}
              >
                Dismiss
              </Button>
            </DialogActionTrigger>
          )}
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default AlertModal;
