import { useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export default function LabelBottomNavigation() {
  const [value, setValue] = useState("home");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
    // Navigate to the corresponding page based on the selected value
    if (newValue === "home") {
      navigate("/admin/"); // Navigate to the "Home" page route
    } else if (newValue === "account") {
      navigate("/admin/account"); // Navigate to the "Account" page route
    }
  };

  return (
    <BottomNavigation value={value} onChange={handleChange}>
      <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
      <BottomNavigationAction
        label="Account"
        value="account"
        icon={<PersonIcon />}
      />
    </BottomNavigation>
  );
}
