import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

const Settings = () => {
  const { token, userData, updateUserData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    notifications: userData.notifications || false,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await axios.put(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/users/${userData._id}`,
        {
          name: formData.name,
          email: formData.email,
          notifications: formData.notifications,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateUserData(response.data);
      setSuccessMessage("Settings updated successfully.");
    } catch (error) {
      setErrorMessage("Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            variant="outlined"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.notifications}
                onChange={handleChange}
                name="notifications"
                color="primary"
              />
            }
            label="Enable Notifications"
          />

          {loading && <CircularProgress />}

          {successMessage && (
            <Box mt={2}>
              <Alert severity="success">{successMessage}</Alert>
            </Box>
          )}

          {errorMessage && (
            <Box mt={2}>
              <Alert severity="error">{errorMessage}</Alert>
            </Box>
          )}

          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Settings;
