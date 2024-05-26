import React, { useState } from "react";
import Laundries from "./Laundries";
import ConvenienceStores from "./ConvenienceStores";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Login from "./Login";
import LabelBottomNavigation from "../LabelBottomNavigation";

const Admin = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      <LabelBottomNavigation />
      {isAuthenticated ? (
        <Box>
          <Tabs value={tabValue} onChange={handleChange} centered>
            <Tab label="Laundries" />
            <Tab label="Convenience Stores" />
          </Tabs>
          <Box hidden={tabValue !== 0}>{tabValue === 0 && <Laundries />}</Box>
          <Box hidden={tabValue !== 1}>
            {tabValue === 1 && <ConvenienceStores />}
          </Box>
        </Box>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default Admin;
