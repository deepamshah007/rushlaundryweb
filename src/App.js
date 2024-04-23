import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import LabelBottomNavigation from "./components/LabelBottomNavigation";
import Home from "./components/Home";
import Account from "./components/Account";

function App() {
  return (
    <Router>
      <div className="App">
        <LabelBottomNavigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
