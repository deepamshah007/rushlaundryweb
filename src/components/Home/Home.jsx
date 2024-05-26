import React from "react";
import { Routes, Route } from "react-router-dom";

import HomeView from "./HomeView";
// import LaundryDetails from "./LaundryDetails";
// import PaymentScreen from "./PaymentScreen";
// import CustomerOrderDetails from "./CustomerOrderDetails";

function Home() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      {/* <Route path="/laundry-details" element={<LaundryDetails />} /> */}
      {/* <Route path="/payment" element={<PaymentScreen />} /> */}
      {/* <Route
        path="/order-details/:orderId"
        element={<CustomerOrderDetails />}
      /> */}
    </Routes>
  );
}

export default Home;
