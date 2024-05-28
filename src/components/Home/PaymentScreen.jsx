import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Typography, Container, Grid } from "@mui/material";
import { CardElement, useStripe } from "@stripe/react-stripe-js";
import Icon from "@mui/icons-material/ArrowBack";
import ActionButton from "../../Views/ActionButton";

const PaymentScreen = ({ route }) => {
  const history = useHistory();

  // Destructure the passed data from the route params
  const { userData, laundry, selectedServices, token, totalPrice } =
    route.params ?? {};

  // Check if userData is defined before accessing its properties
  const userId = userData?.userId;

  // State for card details
  const [cardDetails, setCardDetails] = useState({});

  const { stripe, elements, confirmPayment } = useStripe();

  const placeOrder = async () => {
    if (selectedServices.length > 0 && laundry) {
      console.log("The user is", userData._id);
      console.log("Placing Order...");
      console.log("Selected Services:", selectedServices);

      try {
        const response = await fetch(
          "https://rush-laundry-0835134be79d.herokuapp.com/api/orders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              laundry,
              service: selectedServices,
              quantity: selectedServices.length,
              totalPrice: totalPrice,
              rider: null, // Set the rider as null or omit it
            }),
          }
        );

        if (response.ok) {
          console.log("Order placed successfully");
          history.push("/");
        } else if (response.status === 401) {
          console.log("User not logged in");
          // Redirect to login page
          history.push("/login");
        } else {
          console.log("Error placing order", response.status);
          // Display error message or handle the error accordingly
        }
      } catch (error) {
        console.log("Error placing order:", error);
        // Display error message or handle the error accordingly
      }
    } else {
      console.log("Please select services and a time slot");
    }
  };

  const handlePaymentConfirmation = async () => {
    try {
      await placeOrder();
      console.log("Payment confirmed. Navigating to Home screen.");
      history.push("/");
    } catch (error) {
      console.error("Error confirming payment:", error);
      // Display error message or handle the error accordingly
    }
  };

  const handleApplePay = () => {
    // Integration with Apple Pay SDK or third-party package.
    // Redirect to Apple Pay flow
  };

  const handlePayPal = () => {
    // Integration with PayPal SDK or third-party package.
    // Redirect to PayPal flow
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Button
            onClick={() => history.goBack()}
            variant="outlined"
            startIcon={<Icon />}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Enter Card Details:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CardElement
            options={{
              style: {
                base: {
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "16px",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
            onChange={(event) => {
              console.log("Card details changed:", event.complete, event.error);
              setCardDetails({ complete: event.complete, error: event.error });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ActionButton
            title="Confirm Payment"
            onPress={handlePaymentConfirmation}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Or Pay With:
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplePay}
            style={{ marginRight: "10px" }}
          >
            Apple Pay
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayPal}
            style={{ marginRight: "10px" }}
          >
            PayPal
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentScreen;
