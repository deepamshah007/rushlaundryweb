import React, { useState, useEffect, useContext, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";

const HomeView = () => {
  const { token, loading: authLoading, userData } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [laundryData, setLaundryData] = useState([]);
  const [filteredLaundryData, setFilteredLaundryData] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCurrentOrders = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/currentorders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            role: "customer",
            id: userData.userId,
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
  }, [token, userData]);

  const fetchLaundryData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://rush-laundry-0835134be79d.herokuapp.com/api/laundry"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching laundry data:", error);
      throw new Error("Failed to fetch laundry data");
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (authLoading) return;

    try {
      setLoading(true);

      const [laundryResponse, ordersResponse] = await Promise.all([
        fetchLaundryData(),
        fetchCurrentOrders(),
      ]);

      setLaundryData(laundryResponse);
      setFilteredLaundryData(laundryResponse);
      setCurrentOrders(ordersResponse);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [authLoading, fetchLaundryData, fetchCurrentOrders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    navigate(`/laundry/${laundryId}`);
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
                address={laundry.location}
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
