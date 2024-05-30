import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
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
  const { token, handleLogout } = useContext(AuthContext);
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
      sx={{ backgroundColor: "#0a1f44", padding: "0.5rem 2rem" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontFamily: "Roboto",
            fontWeight: 700,
            marginLeft: "0.5rem",
          }}
        >
          Rush Laundry
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
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
              <MenuItem onClick={() => handleNavigation("/")}>Home</MenuItem>
              {token && (
                <>
                  <MenuItem onClick={() => handleNavigation("/account")}>
                    Account
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation("/orders")}>
                    Current Orders
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation("/settings")}>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={() => handleNavigation("/")}
              sx={{ fontSize: "1rem", fontWeight: 500 }}
            >
              Home
            </Button>
            {token && (
              <>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation("/account")}
                  sx={{ fontSize: "1rem", fontWeight: 500 }}
                >
                  Account
                </Button>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation("/orders")}
                  sx={{ fontSize: "1rem", fontWeight: 500 }}
                >
                  Current Orders
                </Button>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation("/settings")}
                  sx={{ fontSize: "1rem", fontWeight: 500 }}
                >
                  Settings
                </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ fontSize: "1rem", fontWeight: 500 }}
                >
                  Logout
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
