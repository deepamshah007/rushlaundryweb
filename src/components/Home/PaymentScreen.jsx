import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaymentScreen = () => {
  const location = useLocation();
  const { selectedServices, totalPrice } = location.state || {};

  const handleApprove = async (data, actions) => {
    try {
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const orderData = await response.json();
      console.log("Order captured: ", orderData);
      // Navigate to a confirmation page or show a success message
    } catch (error) {
      console.error("Error capturing order: ", error);
    }
  };

  return (
    <Container
      style={{
        paddingTop: "2rem",
        paddingBottom: "2rem",
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" style={{ marginBottom: "2rem" }}>
        Payment
      </Typography>

      <Typography variant="h6" style={{ marginBottom: "1rem" }}>
        Total Price: £{totalPrice}
      </Typography>

      <PayPalScriptProvider
        options={{
          "client-id": "YOUR_PAYPAL_CLIENT_ID",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical", color: "gold", label: "paypal" }}
          createOrder={async (data, actions) => {
            try {
              const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  cart: selectedServices.map((service) => ({
                    id: service,
                    quantity: 1,
                  })),
                  currency: "USD", // Specify the currency
                }),
              });

              const orderData = await response.json();
              return orderData.id;
            } catch (error) {
              console.error("Error creating order: ", error);
            }
          }}
          onApprove={(data, actions) => handleApprove(data, actions)}
        />
      </PayPalScriptProvider>
    </Container>
  );
};

export default PaymentScreen;
