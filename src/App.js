// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home/Home";
import Account from "./components/Admin/Account";
import Admin from "./components/Admin/Admin";

import { AuthProvider } from "../src/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/" element={<Admin />} />
              <Route path="/admin/account" element={<Account />} />
            </Routes>
          </>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
