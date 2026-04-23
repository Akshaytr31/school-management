import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Container,
} from "@chakra-ui/react";
import api from "../api";
import AlertModal from "../components/common/AlertModal";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("login/", { username, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("is_teacher", response.data.is_teacher);
      localStorage.setItem("is_admin", response.data.is_admin);

      if (response.data.is_admin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      showAlert(
        "error",
        "Login Failed",
        "Invalid credentials. Please check your username and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" centerContent py={20}>
      <Box
        p={8}
        borderRadius="xl"
        backdropFilter="blur(10px)"
        bg="var(--glass-bg)"
        boxShadow="2xl"
        border="1px solid"
        borderColor="var(--glass-border)"
        w="100%"
      >
        <VStack spaceY={6} align="stretch">
          <Heading textAlign="center" color="var(--primary)">
            School Project
          </Heading>
          <Text textAlign="center" color="var(--gray)">
            Admin & Teacher Login
          </Text>
          <form onSubmit={handleLogin}>
            <VStack spaceY={4}>
              <Box w="100%">
                <Text mb={2} fontWeight="bold">
                  Username
                </Text>
                <Input
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Box>
              <Box w="100%">
                <Text mb={2} fontWeight="bold">
                  Password
                </Text>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Box>
              <Button
                type="submit"
                bg="var(--primary)"
                color="white"
                _hover={{ bg: "var(--primary-dark)" }}
                w="100%"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </Container>
  );
};

export default Login;
