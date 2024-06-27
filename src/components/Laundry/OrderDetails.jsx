import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const { token } = useContext(AuthContext);

  const fetchOrderData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/details/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        console.log("Order not found");
      }
    } catch (error) {
      console.log("Error fetching order data:", error);
    }
  }, [orderId, token]);

  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  const updateOrderStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (response.ok) {
        setOrder((prevOrder) => ({ ...prevOrder, status: newStatus }));
        console.log("Order status updated successfully");
      } else {
        console.log("Error updating order status", response.status);
      }
    } catch (error) {
      console.log("Error updating order status:", error);
    }
  };

  if (!order) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#e0f7fa",
        }}
      >
        <CircularProgress color="primary" />
      </Container>
    );
  }

  return (
    <Container
      sx={{
        paddingTop: "2rem",
        paddingBottom: "2rem",
        backgroundColor: "#e0f7fa",
        minHeight: "100vh",
      }}
    >
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h3" gutterBottom>
        Order Details
      </Typography>

      <Card sx={{ marginBottom: "2rem" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Info:
          </Typography>
          <Typography variant="body1">Order ID: {order._id}</Typography>
          <Typography variant="body1">
            Customer: {order.customer.name}
          </Typography>
          <Typography variant="body1">Service: {order.service}</Typography>
          <Typography variant="body1">Quantity: {order.quantity}</Typography>
          <Typography variant="body1">
            Total Price: {order.totalPrice}
          </Typography>
          <Typography variant="body1">
            Expected Delivery:{" "}
            {new Date(order.expectedReceiveTime).toLocaleString()}
          </Typography>
          <Typography variant="body1">Status: {order.status}</Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Actions:
          </Typography>
          {order.status === "Delivered to Laundry" && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={order.status === "Delivery Confirmed by Laundry"}
                  onChange={() =>
                    updateOrderStatus("Delivery Confirmed by Laundry")
                  }
                  disabled={order.status === "Delivery Confirmed by Laundry"}
                />
              }
              label="Mark as Received"
            />
          )}

          {order.status === "Delivery Confirmed by Laundry" && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={order.status === "Ready to Pick"}
                  onChange={() => updateOrderStatus("Ready to Pick")}
                  disabled={order.status === "Ready to Pick"}
                />
              }
              label="Mark as Ready to Pick"
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default OrderDetails;
