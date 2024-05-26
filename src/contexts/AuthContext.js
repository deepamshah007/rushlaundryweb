import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");
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
      const storedToken = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");

      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUserId) {
        setUserId(JSON.parse(storedUserId));
        fetchUserData(JSON.parse(storedUserId));
      }
    } catch (error) {
      console.error("Failed to load token and user id:", error);
    }
  };

  const fetchUserData = async (userId) => {
    if (!userId) return;

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

  const saveLaundryId = async (laundryId) => {
    try {
      localStorage.setItem("laundryId", String(laundryId));
    } catch (error) {
      console.error("Failed to save the laundry Id:", error);
    }
  };

  const saveTokenAndUserId = async (token, userId) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", JSON.stringify(userId));
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

      if (response.ok) {
        window.alert("Success: " + responseData.message);
        setToken(responseData.token);
        setUserId(responseData.user._id);
        await saveTokenAndUserId(responseData.token, responseData.user._id);

        if (responseData.user.userType === "laundry") {
          setLaundryId(responseData.user.laundryId);
          await saveLaundryId(responseData.user.laundryId);
        }
      } else {
        window.alert("Error: " + responseData.error);
      }
    } catch (error) {
      console.error(error);
      window.alert("Error: Failed to connect to the server");
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
        await saveTokenAndUserId(responseData.token, responseData.user._id);

        if (responseData.user.userType === "laundry") {
          setLaundryId(responseData.user.laundryId);
          await saveLaundryId(responseData.user.laundryId);
        }
      } else {
        window.alert("Error: " + responseData.error);
      }
    } catch (error) {
      console.error(error);
      window.alert("Error: Failed to connect to the server");
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("laundryId");

      setToken(null);
      setUserId(null);
      setUserData(null);
      setLaundryId(null);
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
