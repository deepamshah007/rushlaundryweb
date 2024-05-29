import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const NavBar = () => {
  const { token, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Rush Laundry
        </Typography>
        <Button color="inherit" onClick={() => handleNavigation("/")}>
          Home
        </Button>
        {token && (
          <>
            <Button
              color="inherit"
              onClick={() => handleNavigation("/account")}
            >
              Account
            </Button>
            <Button color="inherit" onClick={() => handleNavigation("/orders")}>
              Current Orders
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation("/settings")}
            >
              Settings
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
