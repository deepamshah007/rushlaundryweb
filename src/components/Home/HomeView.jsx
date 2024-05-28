// HomeView.js

import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Box,
  TextField,
  Typography,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AuthContext } from "../../contexts/AuthContext";
import LaundryCard from "../LaundryCard";
import NextCard from "../NextCard";
import axios from "axios";

const HomeView = () => {
  const { userData, token, loading: authLoading } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [laundryData, setLaundryData] = useState([]);
  const [filteredLaundryData, setFilteredLaundryData] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !userData || !userData._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [laundry, orders] = await Promise.all([
          fetchLaundryData(token),
          fetchCurrentOrders(userData._id, token),
        ]);
        setLaundryData(laundry);
        setFilteredLaundryData(laundry);
        setCurrentOrders(orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, token, authLoading]);

  const fetchCurrentOrders = async (userId, token) => {
    try {
      const response = await axios.get(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/currentorders`,
        {
          params: {
            role: "customer",
            id: userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedOrders = response.data.sort(
        (a, b) =>
          new Date(b.expectedReceiveTime) - new Date(a.expectedReceiveTime)
      );

      return sortedOrders;
    } catch (error) {
      console.error("Error fetching current orders:", error);
      throw new Error("Failed to fetch current orders");
    }
  };

  const fetchLaundryData = async (token) => {
    try {
      const response = await axios.get(
        "https://rush-laundry-0835134be79d.herokuapp.com/api/laundry",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching laundry data:", error);
      throw new Error("Failed to fetch laundry data");
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredLaundryData(laundryData);
    } else {
      const filteredData = laundryData.filter((laundry) =>
        laundry.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLaundryData(filteredData);
    }
  };

  const handleLaundryPress = (laundryId) => {
    // Implement navigation logic here if needed
    console.log("Navigate to laundry details with ID:", laundryId);
  };

  if (authLoading || loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 1,
            backgroundColor: "#fff",
          }}
        >
          <IconButton>
            <SearchIcon />
          </IconButton>
          <TextField
            fullWidth
            placeholder="Search nearest laundry"
            value={searchQuery}
            onChange={handleSearch}
            variant="outlined"
          />
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

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

        {filteredLaundryData.map((laundry) => (
          <Card
            key={laundry._id}
            onClick={() => handleLaundryPress(laundry._id)}
            sx={{ mb: 2, cursor: "pointer" }}
          >
            <CardContent>
              <LaundryCard
                name={laundry.name}
                location={laundry.location}
                services={laundry.services}
                prices={laundry.prices}
                rating={laundry.rating}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default HomeView;
