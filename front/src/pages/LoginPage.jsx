import { Box, Button, PasswordInput, Text, TextInput } from "@mantine/core";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/SessionContext";

const LoginPage = () => {
  // Add some states to control your inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send your login information to your backend
    const requestBody = { email, password };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        requestBody
      );

      if (response.status === 200) {
        const data = await response.data;
        storeToken(data.authToken);
        authenticateUser();

        navigate("/");
      }
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
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
        Login
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
          Connect
        </Button>
      </Box>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </Box>
  );
};

export default LoginPage;
