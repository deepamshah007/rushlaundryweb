import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const ConvenienceStoreRegister = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    contactNumber: "",
    email: "",
    password: "hello",
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
    services: {
      Grocery: "",
      Snacks: "",
      Beverages: "",
      Stationery: "",
      Toiletries: "",
    },
    picture1: null,
    picture2: null,
    newService: "",
    newPrice: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (serviceName, price) => {
    if (!serviceName || !price) return;
    setFormData({
      ...formData,
      services: {
        ...formData.services,
        [serviceName]: price,
      },
      newService: "",
      newPrice: "",
    });
  };

  const handleOpeningHoursChange = (day, timeType, value) => {
    // Check if the user is updating Monday opening or closing time
    if (day === "Monday") {
      // Update all weekdays if Monday opening or closing time is filled
      const updatedOpeningHours = {};
      Object.keys(formData.openingHours).forEach((weekday) => {
        updatedOpeningHours[weekday] = {
          openingTime:
            timeType === "openingTime"
              ? value
              : formData.openingHours[weekday].openingTime,
          closingTime:
            timeType === "closingTime"
              ? value
              : formData.openingHours[weekday].closingTime,
        };
      });
      setFormData({
        ...formData,
        openingHours: updatedOpeningHours,
      });
    } else {
      // Update only the selected day
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert opening hours to string format
    const formattedFormData = {
      ...formData,
      openingHours: Object.fromEntries(
        Object.entries(formData.openingHours).map(([day, hours]) => [
          day,
          {
            openingTime: hours.openingTime.toString(),
            closingTime: hours.closingTime.toString(),
          },
        ])
      ),
    };

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
            name: formattedFormData.ownerName,
            email: formattedFormData.email,
            password: formattedFormData.password || "hello",
            mailingAddress: formattedFormData.location,
            postalCode: "",
            contactNumber: formattedFormData.contactNumber,
            userType: "laundry",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      // Continue with convenience store registration
      const userData = await response.json();
      console.log("User registered successfully:", userData);

      const storeResponse = await fetch(
        "https://rush-laundry-0835134be79d.herokuapp.com/api/convenience_store",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        }
      );

      if (!storeResponse.ok) {
        throw new Error("Failed to register convenience store");
      }

      const data = await storeResponse.json();
      console.log("Convenience store registered successfully:", data);
      // Add any further handling here, such as redirecting to a new page or showing a success message

      // navigate home
      navigate("/");
    } catch (error) {
      console.error("Error registering convenience store:", error.message);
      // Handle error, such as displaying an error message to the user
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Register for Convenience Store
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
              label="Store Name"
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
            <Typography variant="subtitle1" gutterBottom>
              Services
            </Typography>
            <Grid container spacing={2} gap={1}>
              {Object.keys(formData.services).map((service, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Service"
                      name={`service-${index}`}
                      value={service}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      name={`price-${index}`}
                      value={formData.services[service]}
                      onChange={(e) =>
                        handleServiceChange(service, e.target.value)
                      }
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
            <Grid item xs={12} paddingTop={5}>
              <TextField
                fullWidth
                label="New Service"
                name="newService"
                value={formData.newService}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Price"
                name="newPrice"
                value={formData.newPrice}
                onChange={handleChange}
              />
              <Button
                variant="outlined"
                onClick={() =>
                  handleServiceChange(formData.newService, formData.newPrice)
                }
              >
                Add Service
              </Button>
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

export default ConvenienceStoreRegister;
