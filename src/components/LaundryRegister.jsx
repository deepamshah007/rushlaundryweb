import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const LaundryRegister = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    contactNumber: "",
    email: "",
    password: "",
    name: "",
    location: "",
    openingHours: {
      Monday: { openingTime: "", closingTime: "" },
      Tuesday: { openingTime: "", closingTime: "" },
      Wednesday: { openingTime: "", closingTime: "" },
      Thursday: { openingTime: "", closingTime: "" },
      Friday: { openingTime: "", closingTime: "" },
      Saturday: { openingTime: "", closingTime: "" },
      Sunday: { openingTime: "", closingTime: "" },
    },
    description: "",
    services: [],
    price: "",
    picture1: null,
    picture2: null,
  });

  const [newService, setNewService] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpeningHoursChange = (day, timeType, value) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [day]: {
          ...formData.openingHours[day],
          [timeType]: value,
        },
      },
    });
  };

  const handleAddService = () => {
    if (newService) {
      setFormData({
        ...formData,
        services: [...formData.services, newService],
      });
      setNewService("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Register the user
    try {
      const response = await fetch(
        "https://rush-laundry-0835134be79d.herokuapp.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.ownerName,
            contactNumber: formData.contactNumber,
            email: formData.email,
            password: formData.password,
            userType: "laundry",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      // Continue with laundry registration
      const userData = await response.json();
      console.log("User registered successfully:", userData);

      // Now send laundry registration data to the backend
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        }
      }

      const laundryResponse = await fetch(
        "https://rush-laundry-0835134be79d.herokuapp.com/api/laundry",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!laundryResponse.ok) {
        throw new Error("Failed to register laundrette");
      }

      const data = await laundryResponse.json();
      console.log("Laundrette registered successfully:", data);
      // Add any further handling here, such as redirecting to a new page or showing a success message

      // navigate home
      navigate("/");
    } catch (error) {
      console.error("Error registering laundrette:", error.message);
      // Handle error, such as displaying an error message to the user
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Register for Laundratte
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Other Fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Owner's Name"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Laundrette Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Opening Hours
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(formData.openingHours).map(([day, hours]) => (
                <Grid item xs={12} sm={6} key={day}>
                  <TextField
                    fullWidth
                    label={`${day} Opening Time`}
                    name={`openingHours.${day}.openingTime`}
                    type="time"
                    value={hours.openingTime}
                    onChange={(e) =>
                      handleOpeningHoursChange(
                        day,
                        "openingTime",
                        e.target.value
                      )
                    }
                    inputProps={{ step: 300 }} // 5 minute intervals
                  />
                  <TextField
                    fullWidth
                    label={`${day} Closing Time`}
                    name={`openingHours.${day}.closingTime`}
                    type="time"
                    value={hours.closingTime}
                    onChange={(e) =>
                      handleOpeningHoursChange(
                        day,
                        "closingTime",
                        e.target.value
                      )
                    }
                    inputProps={{ step: 300 }} // 5 minute intervals
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="services">Services</InputLabel>
              <Select
                fullWidth
                label="Services"
                id="services"
                name="services"
                value={formData.services}
                onChange={handleChange}
              >
                <MenuItem value="Washing">Washing</MenuItem>
                <MenuItem value="Ironing">Ironing</MenuItem>
                <MenuItem value="Dry Cleaning">Dry Cleaning</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Services
            </Typography>
            {formData.services.map((service, index) => (
              <Typography key={index} variant="body1">
                {service}
              </Typography>
            ))}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Service"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  onClick={handleAddService}
                  disabled={!newService}
                >
                  Add Service
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default LaundryRegister;
