import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";

const Account = () => {
  const [orderHistory, setOrderHistory] = useState(null);
  const { handleLogout, token, userData, laundryData } =
    useContext(AuthContext);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(
          `https://rush-laundry-0835134be79d.herokuapp.com/api/orders/deliveredOrders/${userData._id}?userType=${userData.userType}&laundryId=${userData.laundryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setOrderHistory(data);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };

    if (userData && token) {
      fetchOrderHistory();
    }
  }, [userData, token]);

  if (!userData) {
    return (
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body1" style={{ marginTop: "1rem" }}>
          Logging in...
        </Typography>
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
      <Typography variant="h4" style={{ marginBottom: "1rem" }}>
        Account
      </Typography>

      <Grid container justifyContent="center" style={{ marginBottom: "2rem" }}>
        <Grid item xs={12} md={8}>
          <Paper style={{ padding: "1rem", marginBottom: "1rem" }}>
            <Typography variant="h6" style={{ marginBottom: "0.5rem" }}>
              Profile Information
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
              Name: {userData.name}
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
              Email: {userData.email}
            </Typography>
            {userData.userType === "laundry" && (
              <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
                Laundry: {userData.laundryId}
              </Typography>
            )}
            <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
              Address: {userData.mailingAddress || "N/A"}
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
              Phone: {userData.phoneNumber || "N/A"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {orderHistory && orderHistory.length > 0 && (
        <Grid
          container
          justifyContent="center"
          style={{ marginBottom: "2rem" }}
        >
          <Grid item xs={12} md={8}>
            <Paper style={{ padding: "1rem", marginBottom: "1rem" }}>
              <Typography variant="h6" style={{ marginBottom: "0.5rem" }}>
                Order History
              </Typography>
              {orderHistory.map((order) => (
                <Paper
                  key={order._id}
                  style={{
                    border: "2px solid #ccc",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "0.5rem",
                    backgroundColor: "white",
                  }}
                >
                  <Typography
                    variant="body1"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    Order #{order._id}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    Date: {new Date(order.date).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    Status: {order.status}
                  </Typography>
                </Paper>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      <Button
        variant="contained"
        color="error"
        style={{ borderRadius: "8px", width: "12rem", marginBottom: "1rem" }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Account;
