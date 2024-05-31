import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import theme from "./theme";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
      <React.StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </React.StrictMode>
    </PayPalScriptProvider>
  </ThemeProvider>
);
