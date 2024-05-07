import React, { useState } from "react";
import Laundries from "./Laundries";
import ConvenienceStores from "./ConvenienceStores";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const Home = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
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
  );
};

export default Home;
