import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ element }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return element;
};

export default PrivateRoute;
