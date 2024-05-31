import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Modal,
  IconButton,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import QrScanner from "react-qr-scanner";
import axios from "axios";

const CurrentOrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { token } = useContext(AuthContext);

  const [isLaundryReceived, setIsLaundryReceived] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [order, setOrder] = useState(null);
  const [riderLocation, setRiderLocation] = useState({
    lat: 52.4862,
    lng: -1.8904,
  });
  const [showCamera, setShowCamera] = useState(false);

  // ! REMOVE THIS BIT LATER
  setRiderLocation({
    lat: 52.4862,
    lng: -1.8904,
  });
  console.log(isLaundryReceived);
  console.log(qrCodeData);
  // ! REMOVE THIS BIT LATER

  const fetchOrderData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/details/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setOrder(response.data);
      } else {
        console.error("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  }, [orderId, token]);

  const updateOrderStatus = useCallback(
    async (newStatus) => {
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

        if (response.status === 200) {
          fetchOrderData();
        } else {
          throw new Error("Failed to update order status");
        }
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    },
    [fetchOrderData, orderId, token]
  );

  useEffect(() => {
    const fetchData = async () => {
      await fetchOrderData();
    };

    fetchData();
  }, [fetchOrderData]);

  const handleScan = useCallback(
    (data) => {
      if (data) {
        setQrCodeData(data);
        if (data === order._id) {
          setIsLaundryReceived(true);
          updateOrderStatus("Received by Rider");
          setShowCamera(false);
        }
      }
    },
    [order._id, updateOrderStatus]
  );

  const handleError = (err) => {
    console.error(err);
  };

  if (!order) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4} bgcolor="#e3f2fd" minHeight="100vh">
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>

      <Box mb={4}>
        <MapContainer
          style={{ height: "400px", width: "100%" }}
          center={[riderLocation.lat, riderLocation.lng]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[riderLocation.lat, riderLocation.lng]} />
        </MapContainer>
      </Box>

      {order.status === "Accepted by Laundry" && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowCamera(true)}
        >
          Verify Order
        </Button>
      )}

      <Modal open={showCamera} onClose={() => setShowCamera(false)}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Paper elevation={3} style={{ padding: "16px" }}>
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
            <Button onClick={() => setShowCamera(false)}>Close</Button>
          </Paper>
        </Box>
      </Modal>

      <Paper elevation={3} style={{ padding: "16px", marginTop: "16px" }}>
        <Typography variant="h6">Order Details</Typography>
        <Typography>Order ID: {order._id}</Typography>
        <Typography>From: {order.laundryId}</Typography>
        <Typography>Service: {order.service.join(", ")}</Typography>
        <Typography>To: 24 Burner Street, Birmingham</Typography>
        <Typography>Status: {order.status}</Typography>
        <Typography>
          Expected Time: {new Date(order.expectedReceiveTime).toLocaleString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default CurrentOrderDetail;
