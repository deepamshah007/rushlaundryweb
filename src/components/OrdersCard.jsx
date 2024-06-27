import React from "react";
import { Card, CardContent, Typography} from "@mui/material";

const OrdersCard = ({ service, order, date, status }) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: 2, backgroundColor: "#fff" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {service}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Order: {order}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Date: {date}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Status: {status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OrdersCard;
