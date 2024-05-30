// components/Rider/RiderScreen.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import RiderOrders from "./RiderOrders";
import CurrentOrderDetail from "./CurrentOrderDetails";

const RiderScreen = () => {
  return (
    <Routes>
      <Route path="/" element={<RiderOrders />} />
      <Route path="/order/:orderId" element={<CurrentOrderDetail />} />
    </Routes>
  );
};

export default RiderScreen;
