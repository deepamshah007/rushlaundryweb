import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Container,
  Box,
  TextField,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AuthContext } from "../../contexts/AuthContext";
import LaundryCard from "../LaundryCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const { loading: authLoading } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [laundryData, setLaundryData] = useState([]);
  const [filteredLaundryData, setFilteredLaundryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

      const laundryResponse = await fetchLaundryData();

      setLaundryData(laundryResponse);
      setFilteredLaundryData(laundryResponse);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [authLoading, fetchLaundryData]);

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

export default Services;
