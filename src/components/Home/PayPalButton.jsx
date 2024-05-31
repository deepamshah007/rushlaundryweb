import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = () => {
  const paypalOptions = {
    "client-id":
      "AcoEe7BMSev0_U2CT6vW3jDJ4q8Pul0HFaHzjgLs6nNafdTY-_pTTFLgyUdLVKviYhVZ4FuOesNYDAvV",
    currency: "GBP",
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          tagline: false,
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: "10.00",
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(function (details) {
            console.log(
              "Transaction completed by " + details.payer.name.given_name
            );
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
