import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

const ConvenienceStores = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(
          "https://rush-laundry-0835134be79d.herokuapp.com/api/convenience_store"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch convenience store data");
        }
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error("Error fetching convenience store data:", error.message);
      }
    };
    fetchStores();
  }, []);

  const renderOpeningHours = (openingHours) => {
    if (!openingHours) return null;

    return Object.keys(openingHours).map((day) => (
      <div key={day}>
        <Typography variant="body2" color="textSecondary">
          {day}: {openingHours[day].openingTime} -{" "}
          {openingHours[day].closingTime}
        </Typography>
      </div>
    ));
  };

  const renderServices = (services) => {
    if (!services) return null;

    return Object.keys(services).map((service) => (
      <div key={service}>
        <Typography variant="body2" color="textSecondary">
          {service}: {services[service]}
        </Typography>
      </div>
    ));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        All Convenience Stores
      </Typography>
      <Grid container spacing={2}>
        {stores.map((store) => (
          <Grid item xs={12} sm={6} key={store._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {store.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {store.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Owner Name: {store.ownerName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {store.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ID: {store._id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Opening Hours:
                  {renderOpeningHours(store.openingHours)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Services:
                  {renderServices(store.services)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ConvenienceStores;
