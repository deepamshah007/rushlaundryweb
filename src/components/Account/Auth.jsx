import React, { useState, useContext } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await handleLogin(email, password);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setError("Failed to login. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleSubmit}
            >
              Login
              {loading && (
                <CircularProgress size={24} style={{ marginLeft: 10 }} />
              )}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Button color="primary" onClick={() => navigate("/register")}>
                Register
              </Button>
            </Typography>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
          />
        </Grid>
      </div>
    </Container>
  );
};

export default Auth;
