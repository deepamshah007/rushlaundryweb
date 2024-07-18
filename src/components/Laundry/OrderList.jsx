import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Container,
  TextField,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import NextCard from "../NextCard";

const OrderList = () => {
  const navigate = useNavigate();
  const { token, laundryData } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = useCallback(async () => {
    if (!laundryData || !laundryData._id) {
      console.error("Laundry data or id is not set");
      return;
    }

    try {
      const response = await fetch(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/laundry/${laundryData._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const ordersData = await response.json();
      const newOrders = ordersData.filter((order) => order.status === "Paid");
      const filteredOrders = ordersData.filter(
        (order) =>
          order.status !== "Paid" &&
          order.status !== "Delivery Confirmed by Customer"
      );
      setNewOrders(newOrders);
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }, [laundryData, token]);

  useEffect(() => {
    const socket = io("https://rush-laundry-0835134be79d.herokuapp.com");

    socket.on("NEW_ORDER_LAUNDRY", async (newOrder) => {
      // Update the orders state
      setNewOrders((prevOrders) => [...prevOrders, newOrder]);

      // Play the notification sound
      new Audio("/sounds/notify.mp3").play();

      // Display browser notification
      if (Notification.permission === "granted") {
        new Notification("New Order!", {
          body: "You have received a new order. Check it out!",
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (laundryData && laundryData._id) {
      fetchOrders();
    }
  }, [laundryData, fetchOrders]);

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      if (query) {
        const filteredOrders = orders.filter((order) =>
          order._id.includes(query)
        );
        setOrders(filteredOrders);
      } else {
        fetchOrders(); // re-fetch all orders when search query is cleared
      }
    },
    [orders, fetchOrders]
  );

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await fetch(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Accepted by Laundry" }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.message === "Order status updated successfully") {
        // Update the local state to reflect the change
        fetchOrders();
      } else {
        console.error("Failed to accept order:", responseData.error);
      }
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
  };

  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4, minHeight: "100vh" }}>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <TextField
          variant="outlined"
          placeholder="Search Order"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <IconButton>
          <SearchIcon />
        </IconButton>
      </div>

      <Typography variant="h6" gutterBottom>
        New Orders
      </Typography>
      {newOrders.length ? (
        newOrders.map((order) => (
          <NextCard
            key={order._id}
            service={order.service}
            order={order._id}
            date={`Time: ${new Date(
              order.expectedReceiveTime
            ).toLocaleString()}`}
            status={order.status}
            onAccept={() => handleAcceptOrder(order._id)}
          />
        ))
      ) : (
        <Typography>No new orders</Typography>
      )}

      <Typography variant="h6" gutterBottom>
        Current Orders
      </Typography>
      {orders.length ? (
        orders.map((order) => (
          <Card key={order._id} sx={{ marginBottom: "1rem" }}>
            <CardContent>
              <Typography variant="h6">{order.service}</Typography>
              <Typography variant="body1">Order ID: {order._id}</Typography>
              <Typography variant="body1">
                {new Date(order.date).toLocaleString()}
              </Typography>
              <Typography variant="body1">Status: {order.status}</Typography>
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/order-details/${order._id}`);
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No current orders</Typography>
      )}
    </Container>
  );
};

export default OrderList;
