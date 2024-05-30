import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Home from "./components/Home/HomeView";
import CurrentOrders from "./components/Home/CurrentOrders";
import Admin from "./components/Admin/Admin";
import Auth from "./components/Account/Auth";
import Account from "./components/Account/Account";
import Settings from "./components/Home/Settings";
import { AuthContext } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import LaundryDetails from "./components/Home/LaundryDetails";

function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className="App">
      <Router>
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
          <Route
            path="/auth"
            element={!token ? <Auth /> : <Navigate to="/" />}
          />
          <Route path="/admin" element={<Admin />} />

          <Route
            path="/laundry/:laundryId"
            element={<PrivateRoute element={<LaundryDetails />} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
