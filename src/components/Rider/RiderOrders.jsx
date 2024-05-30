import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const RiderOrders = () => {
  const navigate = useNavigate();
  const { token, userData } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const socket = io("https://rush-laundry-0835134be79d.herokuapp.com");

    const playNotificationSound = async () => {
      try {
        const audio = new Audio(require("../../assets/sounds/notify.mp3"));
        await audio.play();
        console.log("SOUND PLAYED");
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    };

    socket.on("NEW_ORDER_RIDER", async (newOrder) => {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      await playNotificationSound();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchCurrentOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders?role=rider`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchCurrentOrders = async () => {
    try {
      const response = await axios.get(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/currentorders?role=rider&id=${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentOrders(response.data);
    } catch (error) {
      console.error("Error fetching current orders:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setCurrentOrders(orders);
    } else {
      const filteredData = orders.filter((order) =>
        order.address.toLowerCase().includes(query.toLowerCase())
      );
      setCurrentOrders(filteredData);
    }
  };

  const handleAcceptOrder = async (order) => {
    try {
      const response = await axios.put(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/rider/${order._id}`,
        { rider: userData._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        console.log("Order accepted successfully");
        updateOrderStatus("Accepted by Rider", order._id);
      } else {
        console.log("Failed to accept the order");
      }
    } catch (error) {
      console.error("Error accepting the order:", error);
    }
  };

  const updateOrderStatus = async (newStatus, orderId) => {
    try {
      const response = await axios.put(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        console.log("Order status updated successfully");
        fetchOrders();
        fetchCurrentOrders();
      } else {
        console.error("Error updating order status", response.status);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <Box p={4} bgcolor="#e3f2fd" minHeight="100vh">
      <Box display="flex" alignItems="center" mb={4}>
        <SearchIcon />
        <TextField
          variant="outlined"
          placeholder="Search Location"
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
          sx={{ ml: 2 }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        My Current Orders
      </Typography>
      {currentOrders && currentOrders.length > 0 ? (
        currentOrders.map((order) => (
          <Card key={order._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Order #{order._id}</Typography>
              <Typography>Services: {order.service.join(", ")}</Typography>
              <Typography>From: {order.laundryName}</Typography>
              <Typography>To: {order.location}</Typography>
              <Typography>
                Time: {new Date(order.expectedReceiveTime).toLocaleString()}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No current orders</Typography>
      )}

      <Typography variant="h6" gutterBottom>
        Orders
      </Typography>
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Order #{order._id}</Typography>
              <Typography>Services: {order.service.join(", ")}</Typography>
              <Typography>From: {order.laundryName}</Typography>
              <Typography>To: 24 Burner Street, Birmingham</Typography>
              <Typography>
                Time: {new Date(order.expectedReceiveTime).toLocaleString()}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAcceptOrder(order)}
              >
                Accept Order
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No upcoming orders</Typography>
      )}
    </Box>
  );
};

export default RiderOrders;
