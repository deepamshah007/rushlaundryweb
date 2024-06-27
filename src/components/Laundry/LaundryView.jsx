import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OrderList from "./OrderList";
import OrderDetails from "./OrderDetails";

const LaundryView = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrderList />} />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />
      </Routes>
    </Router>
  );
};

export default LaundryView;
