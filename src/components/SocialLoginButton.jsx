import React from "react";
import { Button, Typography, Box } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";

const SocialLoginButton = ({ iconName, backgroundColor, text, onPress }) => {
  let icon = null;
  switch (iconName) {
    case "logo-facebook":
      icon = <FacebookIcon />;
      break;
    case "logo-google":
      icon = <GoogleIcon />;
      break;
    case "logo-apple":
      icon = <AppleIcon />;
      break;
    default:
      break;
  }

  return (
    <Button
      variant="contained"
      fullWidth
      size="large"
      style={{
        marginTop: 4,
        backgroundColor: backgroundColor,
        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)",
      }}
      onClick={onPress}
    >
      <Box display="flex" alignItems="center">
        {icon}
        <Typography
          variant="body1"
          ml={1}
          sx={{ fontWeight: "medium", color: "white" }}
        >
          {text}
        </Typography>
      </Box>
    </Button>
  );
};

export default SocialLoginButton;
