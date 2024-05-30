import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home/HomeView";
import CurrentOrders from "./components/Home/CurrentOrders";
import Admin from "./components/Admin/Admin";
import Auth from "./components/Account/Auth";
import Account from "./components/Account/Account";
import Settings from "./components/Home/Settings";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import LaundryDetails from "./components/Home/LaundryDetails";
import RiderScreen from "./components/Rider/RiderScreen";
import CurrentOrderDetails from "./components/Rider/CurrentOrderDetails";
import AuthProviderWrapper from "./contexts/AuthProviderWrapper";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProviderWrapper>
          <NavBar />
          <Routes>
            <Route path="/" element={<PrivateRoute element={<Home />} />} />
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
              path="/laundry/:laundryId"
              element={<PrivateRoute element={<LaundryDetails />} />}
            />
            <Route
              path="/riderScreen"
              element={<PrivateRoute element={<RiderScreen />} />}
            />
            <Route
              path="/orders/:orderId"
              element={<PrivateRoute element={<CurrentOrderDetails />} />}
            />
          </Routes>
        </AuthProviderWrapper>
      </Router>
    </div>
  );
}

export default App;
