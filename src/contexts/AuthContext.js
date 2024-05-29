// AuthContext.jsx

import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [laundryId, setLaundryId] = useState("");
  const [laundryData, setLaundryData] = useState(null);

  useEffect(() => {
    loadTokenAndUserId();
  }, []);

  useEffect(() => {
    if (userData && userData.userType === "laundry") {
      setLaundryId(userData.laundryId);
      fetchLaundryData(userData.laundryId);
    }
  }, [userData]);

  const loadTokenAndUserId = async () => {
    try {
      const storedToken = Cookies.get("token");
      const storedUserData = Cookies.get("userData");

      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        setLaundryId(parsedUserData.laundryId);
        fetchLaundryData(parsedUserData.laundryId);
      }
    } catch (error) {
      console.error("Failed to load token and user data:", error);
    }
  };

  const fetchUserData = async (userId) => {
    if (!userId) return;

    try {
      const response = await axios.get(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        throw new Error("User data not found");
      }

      setUserData(response.data);
      saveUserDataToCookie(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchLaundryData = async (laundryId) => {
    if (!laundryId) {
      console.error("Laundry ID is undefined.");
      return;
    }

    try {
      const response = await axios.get(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/laundry/${laundryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        throw new Error("Laundry data not found");
      }

      setLaundryData(response.data);
    } catch (error) {
      console.error("Failed to fetch laundry data:", error);
    }
  };

  const saveUserDataToCookie = (userData) => {
    try {
      Cookies.set("userData", JSON.stringify(userData), { expires: 7 });
    } catch (error) {
      console.error("Failed to save user data to cookie:", error);
    }
  };

  const saveTokenAndUserId = async (token, userId) => {
    try {
      Cookies.set("token", token, { expires: 7 });
    } catch (error) {
      console.error("Failed to save token to cookie:", error);
    }
  };

  const handleAuth = async (url, email, password) => {
    try {
      const response = await axios.post(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/${url}`,
        {
          email: email.toLowerCase(),
          password,
        }
      );

      if (response.status === 200) {
        const { token, user } = response.data;
        setToken(token);
        setUserData(user);
        saveTokenAndUserId(token, user._id);

        if (user.userType === "laundry") {
          setLaundryId(user.laundryId);
          saveUserDataToCookie({ ...user, laundryId: user.laundryId });
        } else {
          saveUserDataToCookie(user);
        }
      } else {
        console.error("Authentication failed:", response.data.error);
        window.alert("Error: " + response.data.error);
      }
    } catch (error) {
      console.error("Failed to authenticate:", error);
      window.alert("Error: Failed to connect to the server");
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
    handleAuth(
      "register",
      email,
      password,
      name,
      mailingAddress,
      phoneNumber,
      userType
    );
  };

  const handleLogin = async (email, password) => {
    handleAuth("login", email, password);
  };

  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      Cookies.remove("userData");

      setToken(null);
      setUserData(null);
      setLaundryId(null);
      setLaundryData(null);
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
