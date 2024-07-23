import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home/HomeView"; // HomeView shows the company logo
import CurrentOrders from "./components/Home/CurrentOrders";
import Admin from "./components/Admin/Admin";
import Auth from "./components/Account/Auth";
import Account from "./components/Account/Account";
import Settings from "./components/Home/Settings";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer"; // Import the Footer component
import PrivateRoute from "./components/PrivateRoute";
import LaundryDetails from "./components/Home/LaundryDetails";
import LaundryOrders from "./components/Laundry/OrderDetails";
import RiderScreen from "./components/Rider/RiderScreen";
import CostumerOrderDetails from "./components/Home/CostumerOrderDetails";
import CurrentOrderDetails from "./components/Rider/CurrentOrderDetails";
import AuthProviderWrapper from "./contexts/AuthProviderWrapper";
import PaymentScreen from "./components/Home/PaymentScreen";
import LaundryView from "./components/Laundry/LaundryView"; // Import LaundryView
import Services from "./components/Home/Services"; // Now this shows HomeView content
import StoreList from "./components/StoreList"; // Import the StoreList component

const stores = [
  { name: 'Elite Linen Care', wash: '£12.00', dryClean: '£15.00', ironing: '£21.00', rating: '★★★★☆' },
  { name: 'Sparkling Suds Laundry', wash: '£10.00', dryClean: '£12.00', ironing: '£15.00', rating: '★★★★☆' },
  { name: 'Sunny Day Laundry', wash: '£8.00', dryClean: '£10.00', ironing: '£14.00', rating: '★★★★☆' },
  { name: 'Fresh Scent Laundry', wash: '£6.00', dryClean: '£8.00', ironing: '£12.00', rating: '★★★☆☆' },
  { name: 'Sunrise Laundry', wash: '£5.00', dryClean: '£7.00', ironing: '£10.00', rating: '★★★☆☆' },
  { name: 'Fresh & Clean Laundry', wash: '£4.00', dryClean: '£6.00', ironing: '£8.00', rating: '★★★☆☆' },
  { name: 'Fresh Breeze Laundry', wash: '£3.00', dryClean: '£5.00', ironing: '£7.00', rating: '★★☆☆☆' },
  { name: 'Crystal Clean Laundry', wash: '£2.00', dryClean: '£4.00', ironing: '£6.00', rating: '★★☆☆☆' },
];

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProviderWrapper>
          <NavBar />
          <Routes>
            <Route path="/home" element={<PrivateRoute element={<Home />} />} />
            <Route
              path="/"
              element={<PrivateRoute element={<Services />} />} // Changed Home to Services
            />
            <Route
              path="/orders"
              element={<PrivateRoute element={<CurrentOrders />} />}
            />
            <Route
              path="/account"
              element={<PrivateRoute element={<Account />} />}
            />
            <Route
              path="/settings"
              element={<PrivateRoute element={<Settings />} />}
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/laundry/*"
              element={<PrivateRoute element={<LaundryView />} />}
            />
            <Route
              path="/laundry/:laundryId"
              element={<PrivateRoute element={<LaundryDetails />} />}
            />
            <Route
              path="/laundry/orders/:orderId"
              element={<PrivateRoute element={<LaundryOrders />} />}
            />
            <Route
              path="/riderScreen"
              element={<PrivateRoute element={<RiderScreen />} />}
            />
            <Route
              path="/rider/order/:orderId"
              element={<PrivateRoute element={<CurrentOrderDetails />} />}
            />
            <Route
              path="/orders/:orderId"
              element={<PrivateRoute element={<CostumerOrderDetails />} />}
            />
            <Route
              path="/payment/:laundryId"
              element={<PrivateRoute element={<PaymentScreen />} />}
            />
            <Route
              path="/stores"
              element={<PrivateRoute element={<StoreList stores={stores} />} />}
            />
          </Routes>
          <Footer /> {/* Add the Footer component */}
        </AuthProviderWrapper>
      </Router>
    </div>
  );
}

export default App;
