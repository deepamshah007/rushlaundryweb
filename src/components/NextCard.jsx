import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const NextCard = ({
  service,
  order,
  dAddress,
  rAddress,
  date,
  onAccept,
  onCardPress,
}) => {
  return (
    <Card onClick={onCardPress} sx={{ mb: 2, cursor: "pointer" }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" flexGrow={1}>
            {service}
          </Typography>
          {onAccept !== "disable" && (
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the card click event
                onAccept();
              }}
            >
              Accept
            </Button>
          )}
        </Box>
        <Typography variant="body2" gutterBottom>
          {order}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {dAddress}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {rAddress}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NextCard;
