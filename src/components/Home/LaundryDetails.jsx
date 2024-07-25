import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Container,
  Grid,
  Modal,
  Fade,
  CircularProgress,
  IconButton,
  Checkbox,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../../contexts/AuthContext";
import ActionButton from "../ActionButton";

const LaundryDetails = () => {
  const { laundryId } = useParams();
  const navigate = useNavigate();
  const { userData, token } = useContext(AuthContext);

  const [selectedServices, setSelectedServices] = useState([]);
  const [laundry, setLaundry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaundryData = async () => {
      try {
        const response = await fetch(
          `https://rush-laundry-0835134be79d.herokuapp.com/api/laundry/${laundryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setLaundry(data);
        } else {
          console.log("Laundry not found");
        }
      } catch (error) {
        console.log("Error fetching laundry data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (laundryId && token) {
      fetchLaundryData();
    }
  }, [laundryId, token]);

  const handleServiceSelection = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    selectedServices.forEach((service) => {
      const price = laundry.services[service];

      if (price) {
        totalPrice += parseFloat(price.replace(/[^0-9.-]+/g, ""));
      }
    });

    return totalPrice.toFixed(2);
  };

  const placeOrder = () => {
    const totalPrice = calculateTotalPrice();

    navigate(`/payment/${laundryId}`, {
      state: {
        userData,
        laundry,
        selectedServices,
        token,
        totalPrice: parseFloat(totalPrice), // Convert to number
      },
    });
  };

  const isOpen = () => {
    if (!laundry || !laundry.openingHours) return "Closed";

    const now = new Date();
    const dayOfWeek = now
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    const hoursToday = laundry.openingHours[dayOfWeek];

    if (!hoursToday || typeof hoursToday !== "string") return "Closed";

    const [openTime, closeTime] = hoursToday.split(" - ");

    if (!openTime || !closeTime) return "Closed";

    const convertTo24Hour = (time) => {
      const [hourMin, period] = time.split(" ");
      let [hour, minute] = hourMin.split(":").map(Number);

      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      return `${hour}:${minute}`;
    };

    const open = convertTo24Hour(openTime);
    const close = convertTo24Hour(closeTime);

    return `Open today from ${open} to ${close}`;
  };

  if (loading || !laundry) {
    return (
      <Container
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
          backgroundColor: "#f0f0f0",
          minHeight: "100vh",
        }}
      >
        <Grid container justifyContent="center" alignItems="center">
          <CircularProgress color="primary" size={48} />
        </Grid>
      </Container>
    );
  }

  return (
    <Container
      style={{
        paddingTop: "2rem",
        paddingBottom: "2rem",
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <Box display="flex" justifyContent="flex-start">
        <IconButton
          onClick={() => navigate(-1)}
          style={{ marginBottom: "1rem", cursor: "pointer" }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h3" style={{ marginBottom: "1rem" }}>
          {laundry.name}
        </Typography>
        <Typography variant="body1" style={{ marginBottom: "1rem" }}>
          Address: {laundry.address}
        </Typography>
        <Typography variant="body1" style={{ marginBottom: "1rem" }}>
          {laundry.description}
        </Typography>

        <Button
          onClick={() => setModalVisible(true)}
          style={{
            marginBottom: "1rem",
            cursor: "pointer",
          }}
          variant="outlined"
          color="primary"
        >
          Click to view Opening Hours
        </Button>

        <Modal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          closeAfterTransition
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Fade in={modalVisible}>
            <Card
              style={{
                outline: "none",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                zIndex: 999,
              }}
            >
              <CardContent>
                <IconButton
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setModalVisible(false)}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h5" style={{ marginBottom: "1rem" }}>
                  Opening Hours:
                </Typography>
                {laundry.openingHours &&
                  Object.entries(laundry.openingHours).map(([day, hours]) => (
                    <Typography
                      key={day}
                      variant="body1"
                      style={{ marginBottom: "0.5rem" }}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}: {hours}
                    </Typography>
                  ))}
              </CardContent>
            </Card>
          </Fade>
        </Modal>

        <Typography variant="h4" style={{ marginBottom: "1rem" }}>
          Services:
        </Typography>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "white",
          }}
        >
          {laundry.services &&
            Object.entries(laundry.services).map(([service, price]) => (
              <Card
                key={service}
                style={{
                  marginBottom: "0.5rem",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
                onClick={() => handleServiceSelection(service)}
              >
                <CardContent
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                  }}
                >
                  <Checkbox
                    checked={selectedServices.includes(service)}
                    onChange={() => handleServiceSelection(service)}
                    color="primary"
                  />
                  <Typography variant="body1">{service}</Typography>
                  <Typography variant="body1">{price}</Typography>
                </CardContent>
              </Card>
            ))}
        </div>

        <Typography
          variant="h6"
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          Total Price: £{calculateTotalPrice()}
        </Typography>

        <Typography variant="body1" style={{ marginBottom: "1rem" }}>
          {isOpen()}
        </Typography>

        <ActionButton
          title="Place Order"
          onClick={placeOrder}
          disabled={selectedServices.length === 0}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </Box>
    </Container>
  );
};

export default LaundryDetails;
