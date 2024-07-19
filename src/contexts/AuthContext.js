import React, { createContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children, navigate }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [laundryData, setLaundryData] = useState(null);

  // Fetch laundry data from API
  const fetchLaundryData = useCallback(async (laundryId, token) => {
    if (!laundryId || !token) return;

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
      console.error("Failed to fetch laundry data:", error.response || error);
      console.error(`Error details: ${JSON.stringify(error.response.data)}`);
    }
  }, []);

  // Fetch user data from API
  const fetchUserData = useCallback(
    async (userId, token) => {
      if (!userId || !token) return;

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

        // Fetch laundry data if user type is laundry
        if (response.data.userType === "laundry" && response.data.laundryId) {
          fetchLaundryData(response.data.laundryId, token);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error.response || error);
        console.error(`Error details: ${JSON.stringify(error.response.data)}`);
      }
    },
    [fetchLaundryData]
  );

  // Load token and user data from cookies
  const loadTokenAndUserData = useCallback(async () => {
    try {
      const storedToken = Cookies.get("token");
      const storedUserData = Cookies.get("userData");

      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        fetchUserData(parsedUserData._id, storedToken);
      }
    } catch (error) {
      console.error("Failed to load token and user data:", error);
    }
  }, [fetchUserData]);

  useEffect(() => {
    loadTokenAndUserData();
  }, [loadTokenAndUserData]);

  // Save user data to cookies
  const saveUserDataToCookie = (userData) => {
    try {
      Cookies.set("userData", JSON.stringify(userData), { expires: 7 });
    } catch (error) {
      console.error("Failed to save user data to cookie:", error);
    }
  };

  // Save token to cookies
  const saveTokenToCookie = (token) => {
    try {
      Cookies.set("token", token, { expires: 7 });
    } catch (error) {
      console.error("Failed to save token to cookie:", error);
    }
  };

  // Handle authentication (login/register)
  const handleAuth = async (url, data) => {
    try {
      const response = await axios.post(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/${url}`,
        data
      );

      if (response.status === 200) {
        const { token, user } = response.data;
        setToken(token);
        setUserData(user);
        saveTokenToCookie(token);
        saveUserDataToCookie(user);

        // Redirect based on user role
        if (user.userType === "customer") {
          navigate("/");
        } else if (user.userType === "rider") {
          navigate("/riderScreen");
        } else if (user.userType === "laundry") {
          fetchLaundryData(user.laundryId, token);
        }
      } else {
        console.error("Authentication failed:", response.data.error);
        window.alert("Error: " + response.data.error);
      }
    } catch (error) {
      console.error("Failed to authenticate:", error.response || error);
      console.error(`Error details: ${JSON.stringify(error.response.data)}`);
      if (error.response && error.response.data && error.response.data.error) {
        window.alert("Error: " + error.response.data.error);
      } else {
        window.alert("Error: Failed to connect to the server");
      }
    }
  };

  // Handle registration
  const handleRegister = async (
    name,
    email,
    mailingAddress,
    phoneNumber,
    userType,
    password
  ) => {
    handleAuth("register", {
      name,
      email,
      mailingAddress,
      phoneNumber,
      userType,
      password,
    });
  };

  // Handle login
  const handleLogin = async (email, password) => {
    handleAuth("login", { email, password });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      Cookies.remove("userData");

      setToken(null);
      setUserData(null);
      setLaundryData(null);
      navigate("/auth");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
