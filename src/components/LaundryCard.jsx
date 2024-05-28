import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import StarRating from "./StarRating";

const LaundryCard = ({ name, location, rating }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h6" component="div" gutterBottom>
        {name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {location}
      </Typography>
      <Box display="flex" alignItems="center">
        <Typography variant="body2" fontWeight="medium" mr={1}>
          Rating:
        </Typography>
        <StarRating rating={rating} />
      </Box>
    </Paper>
  );
};

export default LaundryCard;
