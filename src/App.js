import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home/HomeView"; // HomeView shows the company logo
import CurrentOrders from "./components/Home/CurrentOrders";
import Admin from "./components/Admin/Admin";
import Auth from "./components/Account/Auth";
import Account from "./components/Account/Account";
import Settings from "./components/Home/Settings";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer"; // Import the Footer component
import PrivateRoute from "./components/PrivateRoute";
import LaundryDetails from "./components/Home/LaundryDetails";
import LaundryOrders from "./components/Laundry/OrderDetails";
import RiderScreen from "./components/Rider/RiderScreen";
import CostumerOrderDetails from "./components/Home/CostumerOrderDetails";
import CurrentOrderDetails from "./components/Rider/CurrentOrderDetails";
import AuthProviderWrapper from "./contexts/AuthProviderWrapper";
import PaymentScreen from "./components/Home/PaymentScreen";
import LaundryView from "./components/Laundry/LaundryView";
import Services from "./components/Home/Services";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProviderWrapper>
          <NavBar />
          <div className="content">
            <Routes>
              <Route
                path="/home"
                element={<PrivateRoute element={<Home />} />}
              />
              <Route
                path="/"
                element={<PrivateRoute element={<Services />} />} // Changed Home to Services
              />
              <Route
                path="/orders"
                element={<PrivateRoute element={<CurrentOrders />} />}
              />
              <Route
                path="/account"
                element={<PrivateRoute element={<Account />} />}
              />
              <Route
                path="/settings"
                element={<PrivateRoute element={<Settings />} />}
              />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/laundry/*"
                element={<PrivateRoute element={<LaundryView />} />}
              />
              <Route
                path="/laundry/:laundryId"
                element={<PrivateRoute element={<LaundryDetails />} />}
              />
              <Route
                path="/laundry/orders/:orderId"
                element={<PrivateRoute element={<LaundryOrders />} />}
              />
              <Route
                path="/riderScreen"
                element={<PrivateRoute element={<RiderScreen />} />}
              />
              <Route
                path="/rider/order/:orderId"
                element={<PrivateRoute element={<CurrentOrderDetails />} />}
              />
              <Route
                path="/orders/:orderId"
                element={<PrivateRoute element={<CostumerOrderDetails />} />}
              />
              <Route
                path="/payment/:laundryId"
                element={<PrivateRoute element={<PaymentScreen />} />}
              />
              {/* <Route
                path="/stores"
                element={
                  <PrivateRoute element={<StoreList stores={stores} />} />
                }
              /> */}
            </Routes>
          </div>
          <Footer />
        </AuthProviderWrapper>
      </Router>
    </div>
  );
}

export default App;
