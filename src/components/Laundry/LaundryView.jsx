import React from "react";
import { Route, Routes } from "react-router-dom";
import OrderList from "./OrderList";
import OrderDetails from "./OrderDetails";

const LaundryView = () => {
  return (
    <Routes>
      <Route path="/" element={<OrderList />} />
      <Route path="/orders/:orderId" element={<OrderDetails />} />
    </Routes>
  );
};

export default LaundryView;
