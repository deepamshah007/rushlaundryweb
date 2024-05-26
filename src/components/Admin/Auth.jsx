import React, { useState, useContext } from "react";
import { Typography, Box, Button, TextField, Grid } from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import SocialLoginButton from "../SocialLoginButton";
import ActionButton from "../ActionButton";
import Alert from "@mui/material/Alert";

const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { handleRegister, handleLogin } = useContext(AuthContext);

  const togglePage = () => {
    setIsLoginPage(!isLoginPage);
  };

  const handleSubmit = () => {
    setLoading(true);
    setError("");
    if (isLoginPage) {
      handleLogin(email, password)
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    } else {
      // Handle registration logic here
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={4}
      pt={10}
      bgcolor="blue.100"
    >
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          {isLoginPage ? "Login" : "Register"}
        </Typography>

        <Box width="80%">
          {!isLoginPage && (
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!isLoginPage && (
            <>
              <TextField
                label="Mailing Address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={mailingAddress}
                onChange={(e) => setMailingAddress(e.target.value)}
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </>
          )}

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLoginPage && (
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
            />
          )}
        </Box>

        <Box mt={3}>
          <ActionButton
            title={isLoginPage ? "Login" : "Register"}
            loading={loading}
            onClick={handleSubmit}
          />
          <Grid container spacing={2} justify="center" alignItems="center">
            <SocialLoginButton
              iconName="logo-facebook"
              backgroundColor="#3b5998"
              text="Login with Facebook"
              onClick={() => {}}
            />
            <SocialLoginButton
              iconName="logo-google"
              backgroundColor="#db4437"
              text="Login with Google"
              onClick={() => {}}
            />
            <SocialLoginButton
              iconName="logo-apple"
              backgroundColor="#000"
              text="Login with Apple"
              onClick={() => {}}
            />
          </Grid>
        </Box>

        <Box mt={3}>
          <Typography variant="body1">
            {isLoginPage
              ? "Don't have an account?"
              : "Already have an account?"}
          </Typography>
          <Button color="primary" onClick={togglePage}>
            {isLoginPage ? "Register" : "Login"}
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Box>
  );
};

export default Auth;
