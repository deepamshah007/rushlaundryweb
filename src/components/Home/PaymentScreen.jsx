import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);
const stripePromise = loadStripe(
  "pk_test_51O8jwZAlyEzuyHdXpgRudPjkZOtfpIIpKkmWNCHz7Xxd1KMvYPmLtFODTbqKCyXdhcT1q6zXsGO3CWO7tPBXu4cz00udGdZ2JG"
);

const CheckoutForm = ({ clientSecret, handleOrder }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setError(error.message);
      setSuccess(false);
    } else {
      setError(null);
      setSuccess(true);
      await handleOrder(paymentIntent.id);
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CardElement options={{ style: { base: { fontSize: "18px" } } }} />
        </Grid>
        <Grid item xs={12}>
          <button
            type="submit"
            className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
            disabled={!stripe}
            style={{ width: "100%" }}
          >
            Confirm Payment
          </button>
        </Grid>
        <Grid item xs={12}>
          {error && (
            <Typography variant="body1" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          {success && (
            <Typography variant="body1" color="success" gutterBottom>
              Payment successful!
            </Typography>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

const PaymentScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedServices, laundry, token, totalPrice } = location.state || {};
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
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
              totalPrice: totalPrice,
              service: selectedServices,
              quantity: selectedServices.length,
              laundry: laundry,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        setError(
          "Failed to initialize payment because it was blocked by the browser. Please turn off any proxy or ad blocker and try again."
        );
      }
    };

    fetchClientSecret();
  }, [totalPrice, token, selectedServices, laundry]);

  const placeOrder = async (paymentIntentId) => {
    setLoading(true);
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
            paymentIntentId: paymentIntentId,
          }),
        }
      );

      if (response.ok) {
        console.log("Order placed successfully");
      } else if (response.status === 401) {
        console.log("User not logged in");
        navigate("/account");
      } else {
        console.error("Error placing order", response.status);
        setError(`Error placing order: ${response.status}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setError(`Error placing order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h5" gutterBottom>
          Payment
        </Typography>
        {error && (
          <Typography variant="body1" color="error" gutterBottom>
            {error}
          </Typography>
        )}
        {clientSecret && !error && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Total Price: £{totalPrice.toFixed(2)}
            </Typography>
            {loading && <CircularProgress style={{ marginBottom: "1rem" }} />}
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                handleOrder={placeOrder}
              />
            </Elements>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default PaymentScreen;
