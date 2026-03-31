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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      alert("Invalid credentials");
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
        bg="whiteAlpha.800"
        boxShadow="2xl"
        border="1px solid"
        borderColor="whiteAlpha.400"
        w="100%"
      >
        <VStack spaceY={6} align="stretch">
          <Heading textAlign="center" color="purple.600">
            School Project
          </Heading>
          <Text textAlign="center" color="gray.600">
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
                colorPalette="purple"
                w="100%"
                loading={loading}
              >
                Login
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
