import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userType, setUserType] = useState("");
  const [open, setOpen] = useState(false);

  const { handleRegister, handleLogin, token, userData } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && userData) {
      if (userData.userType === "customer") {
        navigate("/");
      } else if (userData.userType === "rider") {
        navigate("/riderScreen");
      }
    }
  }, [token, userData, navigate]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (isLoginPage) {
      try {
        await handleLogin(email, password);
        setLoading(false);
        navigate("/");
      } catch (error) {
        setError("Failed to login. Please check your credentials.");
        setSnackbarMessage("Failed to login. Please check your credentials.");
        setLoading(false);
        setSnackbarOpen(true);
      }
    } else {
      setOpen(true);
    }
  };

  const handleRegisterSubmit = async () => {
    setOpen(false);
    setLoading(true);
    try {
      await handleRegister(
        name,
        email,
        mailingAddress,
        phoneNumber,
        userType,
        password
      );
      setLoading(false);
      setSnackbarMessage("Registration successful! Please log in.");
      setSnackbarOpen(true);
      setIsLoginPage(true);
    } catch (error) {
      setError("Failed to register. Please try again later.");
      setSnackbarMessage("Failed to register. Please try again later.");
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const togglePage = () => {
    setIsLoginPage(!isLoginPage);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <Typography variant="h4" gutterBottom>
          {isLoginPage ? "Login" : "Register"}
        </Typography>

        <Grid container spacing={2}>
          {!isLoginPage && (
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
          )}

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

          {!isLoginPage && (
            <>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="mailingAddress"
                  label="Mailing Address"
                  name="mailingAddress"
                  autoComplete="address"
                  value={mailingAddress}
                  onChange={(e) => setMailingAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  autoComplete="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Grid>
            </>
          )}

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

          {!isLoginPage && (
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleSubmit}
            >
              {isLoginPage ? "Login" : "Register"}
              {loading && (
                <CircularProgress size={24} style={{ marginLeft: 10 }} />
              )}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2">
              {isLoginPage
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <Button color="primary" onClick={togglePage}>
                {isLoginPage ? "Register" : "Login"}
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select User Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you a rider, laundry, or a customer?
          </DialogContentText>
          <TextField
            select
            fullWidth
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            label="User Type"
            variant="outlined"
          >
            <MenuItem value="rider">Rider</MenuItem>
            <MenuItem value="laundry">Laundry</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRegisterSubmit} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Auth;
