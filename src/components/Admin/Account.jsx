import React, { useState } from "react";
import LaundryRegister from "./LaundryRegister";
import ConvenienceStoreRegister from "./ConvenienceStoreRegister";
import { Box, Button } from "@mui/material";

const Account = () => {
  const [activeTab, setActiveTab] = useState("laundry");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Box>
      <Button
        variant={activeTab === "laundry" ? "contained" : "outlined"}
        onClick={() => handleTabChange("laundry")}
      >
        Laundry Register
      </Button>
      <Button
        variant={activeTab === "convenience" ? "contained" : "outlined"}
        onClick={() => handleTabChange("convenience")}
      >
        Convenience Store Register
      </Button>

      {activeTab === "laundry" && <LaundryRegister />}
      {activeTab === "convenience" && <ConvenienceStoreRegister />}
    </Box>
  );
};

export default Account;
