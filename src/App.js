import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Home from "./components/Home/HomeView";
import Account from "./components/Admin/Account";
import Admin from "./components/Admin/Admin";
import Auth from "./components/Account/Auth";
import { AuthContext } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<PrivateRoute element={<Home />} />} />
          <Route
            path="/auth"
            element={!token ? <Auth /> : <Navigate to="/" />}
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
