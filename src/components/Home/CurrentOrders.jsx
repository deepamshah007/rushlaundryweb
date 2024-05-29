import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import NextCard from "../NextCard";
import axios from "axios";

const CurrentOrders = () => {
  const { token, userData } = useContext(AuthContext);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentOrders = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/currentorders?role=customer&id=${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedOrders = response.data.sort(
        (a, b) =>
          new Date(b.expectedReceiveTime) - new Date(a.expectedReceiveTime)
      );

      setCurrentOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching current orders:", error);
      setError("Failed to fetch current orders");
      setLoading(false);
    }
  }, [token, userData]);

  useEffect(() => {
    fetchCurrentOrders();
  }, [fetchCurrentOrders]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      {currentOrders.length > 0 && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Current Orders
          </Typography>
          {currentOrders.map((order) => (
            <Card key={order._id} sx={{ mb: 2 }}>
              <CardContent>
                <NextCard
                  service={order.service
                    .join(", ")
                    .replace(/,([^,]*)$/, " and$1")}
                  order={order._id}
                  date={`Expected Delivery: ${new Date(
                    order.expectedReceiveTime
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}`}
                  status={order.status}
                  onAccept="disable"
                  onCardPress={() => {
                    console.log(
                      "Navigate to customer order details with ID:",
                      order._id
                    );
                  }}
                />
                <Typography variant="body2">{order.details}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {error && (
        <Box mb={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </>
  );
};

export default CurrentOrders;
