import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const CustomerOrderDetails = () => {
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
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>

      <Card style={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Info:
          </Typography>
          <Typography variant="body1">Order ID: {order._id}</Typography>
          <Typography variant="body1">
            Customer: {order.customer.name}
          </Typography>
          <Typography variant="body1">
            Service: {order.service.join(", ").replace(/,([^,]*)$/, " and$1")}
          </Typography>
          <Typography variant="body1">Laundry: {order.laundry}</Typography>
          <Typography variant="body1">Quantity: {order.quantity}</Typography>
          <Typography variant="body1">
            Total Price: {order.totalPrice}
          </Typography>
          <Typography variant="body1">
            {`Expected Delivery: ${new Date(
              order.expectedReceiveTime
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}`}
          </Typography>
          <Typography variant="body1">Status: {order.status}</Typography>
        </CardContent>
      </Card>

      <Card style={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Actions:
          </Typography>
          {order.status === "Delivered to Customer" && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={order.status === "Delivery Confirmed by Customer"}
                  onChange={() =>
                    updateOrderStatus("Delivery Confirmed by Customer")
                  }
                  disabled={order.status === "Delivery Confirmed by Customer"}
                />
              }
              label="Mark as Received"
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CustomerOrderDetails;
