import { Box, Button, PasswordInput, Text, TextInput } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  // Add some states to control your inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send your signup information to your backend
    const requestBody = { email, password };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        requestBody
      );

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        margin: "0 auto",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "calc(100vh - 100px)",
      }}
    >
      <Text align="center" size="xl" weight="bold">
        Signup
      </Text>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "2rem",
        }}
        onSubmit={handleSubmit}
      >
        <TextInput
          label="Email"
          variant="filled"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          withAsterisk
        />
        <PasswordInput
          label="Password"
          variant="filled"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          withAsterisk
        />
        <Button
          type="submit"
          variant="filled"
          color="cyan"
          sx={{ marginTop: "1rem", alignSelf: "center" }}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default SignupPage;
