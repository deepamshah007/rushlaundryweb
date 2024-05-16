import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import LabelBottomNavigation from './components/LabelBottomNavigation';
import Home from './components/Home';
import Account from './components/Account';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <>
            <LabelBottomNavigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
