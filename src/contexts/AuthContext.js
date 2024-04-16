import React, { createContext, useEffect, useState } from "react";
import { Alert } from "@mui/material";
import Cookies from "universal-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("token") || "");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");
  const [laundryId, setLaundryId] = useState("");
  const [laundryData, setLaundryData] = useState(null);

  useEffect(() => {
    loadTokenAndUserId();
  }, [userId]);

  useEffect(() => {
    setLaundryId(userData?.userType === "laundry" ? userData.laundryId : "");
    if (userData?.userType === "laundry") {
      loadLaundryId();
    }
  }, [userData]);

  const loadLaundryId = async () => {
    try {
      const storedLaundryId = cookies.get("laundryId");

      if (storedLaundryId) {
        setLaundryId(storedLaundryId);
      }
    } catch (error) {
      console.error("Failed to load laundry id:", error);
    }
  };

  const loadTokenAndUserId = async () => {
    try {
      const storedToken = cookies.get("token");
      const storedUserId = cookies.get("userId");

      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUserId) {
        setUserId(JSON.parse(storedUserId));
        fetchUserData(); // Fetch user data from MongoDB
      }
    } catch (error) {
      console.error("Failed to load token and user id:", error);
    }
  };

  const fetchUserData = async () => {
    if (!userId) {
      return;
    }

    try {
      const response = await fetch(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const user = await response.json();
      setUserData(user);

      // if the user type is laundry, fetch the laundry data
      if (user.userType === "laundry") {
        setLaundryId(user.laundryId);
        fetchLaundryData(user.laundryId);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchLaundryData = async (laundryId) => {
    try {
      const response = await fetch(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/laundry/${laundryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const laundry = await response.json();
      setLaundryData(laundry);
    } catch (error) {
      console.error("Failed to fetch laundry data:", error);
    }
  };

  const saveLaundryId = (laundryId) => {
    try {
      cookies.set("laundryId", String(laundryId), { path: "/" });
    } catch (error) {
      console.error("Failed to save the laundry Id:", error);
    }
  };

  const saveTokenAndUserId = (token, userId) => {
    try {
      cookies.set("token", token, { path: "/" });
      cookies.set("userId", JSON.stringify(userId), { path: "/" });
    } catch (error) {
      console.error("Failed to save token and user Id:", error);
    }
  };

  const handleRegister = async (
    name,
    email,
    mailingAddress,
    phoneNumber,
    userType,
    password
  ) => {
    try {
      const response = await fetch(
        "https://rush-laundry-0835134be79d.herokuapp.com/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: email.toLowerCase(),
            password,
            mailingAddress,
            phoneNumber,
            userType,
          }),
        }
      );
      const responseData = await response.json();

      console.log(responseData);

      if (response.ok) {
        Alert.alert("Success", responseData.message);
        setToken(responseData.token);
      } else {
        Alert.alert("Error", responseData.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(
        "https://rush-laundry-0835134be79d.herokuapp.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.toLowerCase(),
            password,
          }),
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        setToken(responseData.token);
        setUserId(responseData.user._id);
      } else {
        Alert.alert("Error", responseData.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  const handleLogout = async () => {
    try {
      cookies.remove("token", { path: "/" });
      cookies.remove("userId", { path: "/" });
      cookies.remove("laundryId", { path: "/" });

      setToken("");
      setUserId("");
      setUserData(null);
      setLaundryId("");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        handleRegister,
        handleLogin,
        handleLogout,
        token,
        userData,
        laundryData,
        laundryId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
