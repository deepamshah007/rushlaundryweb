import React from "react";
import { Typography, Box } from "@mui/material";
import StarRating from "./StarRating";

const LaundryCard = ({ name, location, services, prices, rating }) => {
  return (
    <Box>
      <Typography variant="h6">{name}</Typography>
      <Typography>{location}</Typography>
      {services && (
        <Box>
          {Object.keys(services).map((service) => (
            <Typography key={service}>
              {service}: {services[service]}
            </Typography>
          ))}
        </Box>
      )}
      {prices && (
        <Box>
          {Object.keys(prices).map((service) => (
            <Typography key={service}>
              {service}: {prices[service] || 0}
            </Typography>
          ))}
        </Box>
      )}
      <Box display="flex" alignItems="center">
        <Typography variant="body2" fontWeight="medium" mr={1}>
          Rating:
        </Typography>
        <StarRating rating={rating} />
      </Box>
    </Box>
  );
};

export default LaundryCard;
