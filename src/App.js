// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home/HomeView";
import Account from "./components/Admin/Account";
import Admin from "./components/Admin/Admin";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/account" element={<Account />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
