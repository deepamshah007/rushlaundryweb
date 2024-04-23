import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";


const Laundries = () => {
  const [laundries, setLaundries] = useState([]);

  useEffect(() => {
    const fetchLaundries = async () => {
      try {
        const response = await fetch(
          "https://rush-laundry-0835134be79d.herokuapp.com/api/laundry"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch laundry data");
        }
        const data = await response.json();
        setLaundries(data);
      } catch (error) {
        console.error("Error fetching laundry data:", error.message);
      }
    };
    fetchLaundries();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        All Laundries
      </Typography>
      <Grid container spacing={2}>
        {laundries.map((laundry) => (
          <Grid item xs={12} sm={6} key={laundry._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {laundry.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {laundry.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Opening Hours: {laundry.openingHours}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Services: {laundry.services}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Price: {laundry.price}
                </Typography>
                {/* Add more details to display */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Laundries;
