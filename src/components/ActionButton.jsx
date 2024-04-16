import React from "react";
import { Button, CircularProgress } from "@mui/material";

const ActionButton = ({ title, loading, onClick, disabled }) => (
  <Button
    variant="contained"
    fullWidth
    size="large"
    color="primary"
    disabled={disabled || loading}
    onClick={onClick}
    style={{
      marginTop: 6,
      opacity: disabled || loading ? 0.7 : 1,
    }}
  >
    {loading ? <CircularProgress size={24} color="inherit" /> : title}
  </Button>
);

export default ActionButton;
