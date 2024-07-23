import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../contexts/AuthContext";

const NavBar = () => {
  const { token, userData, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#ffffff", padding: "0.5rem 2rem" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <img
          src="/company_logo.png"
          alt="Company Logo"
          style={{ height: "80px", marginRight: "0.5rem" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", flexGrow: 1 }}>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                sx={{ color: "#000000 !important" }} // Add !important to ensure the color is applied
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {token && userData?.userType === "customer" && (
                  <>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/home")}>
                      Home
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/")}>
                      Services
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/account")}>
                      Account
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/orders")}>
                      Current Orders
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/settings")}>
                      Settings
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </>
                )}
                {token && userData?.userType === "rider" && (
                  <>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/home")}>
                      Home
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/riderScreen")}>
                      Rider Screen
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </>
                )}
                {token && userData?.userType === "laundry" && (
                  <>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/home")}>
                      Home
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/laundryDashboard")}>
                      Dashboard
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/laundryOrders")}>
                      Orders
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/laundryAccount")}>
                      Account
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={() => handleNavigation("/laundrySettings")}>
                      Settings
                    </MenuItem>
                    <MenuItem sx={{ color: "#000000 !important" }} onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <>
              {token && userData?.userType === "customer" && (
                <>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/home")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Home
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Services
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/orders")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Current Orders
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/account")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Account
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/settings")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Settings
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={handleLogout}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Logout
                  </Button>
                </>
              )}
              {token && userData?.userType === "rider" && (
                <>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/home")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Home
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/riderScreen")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Rider Screen
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={handleLogout}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Logout
                  </Button>
                </>
              )}
              {token && userData?.userType === "laundry" && (
                <>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/home")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Home
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/laundry")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/laundryOrders")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Orders
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/Account")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Account
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={() => handleNavigation("/Settings")}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Settings
                  </Button>
                  <Button
                    sx={{ color: "#000000 !important", marginRight: "1rem" }}
                    onClick={handleLogout}
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
