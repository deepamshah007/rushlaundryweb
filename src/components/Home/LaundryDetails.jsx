import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../contexts/AuthContext";
import ActionButton from "../../Views/ActionButton";

const LaundryDetails = ({ route }) => {
  const history = useHistory();
  const { laundryId } = route.params;

  const [selectedServices, setSelectedServices] = useState([]);
  const [laundry, setLaundry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const { userData, token } = useContext(AuthContext);

  useEffect(() => {
    fetchLaundryData();
  }, [laundryId, token]);

  const fetchLaundryData = async () => {
    try {
      const response = await fetch(
        `https://rush-laundry-0835134be79d.herokuapp.com/api/laundry/${laundryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLaundry(data);
      } else {
        console.log("Laundry not found");
      }
    } catch (error) {
      console.log("Error fetching laundry data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelection = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    selectedServices.forEach((service) => {
      const price = laundry.services[service];

      if (price) {
        totalPrice += parseFloat(price.slice(1));
      }
    });

    return totalPrice.toFixed(2);
  };

  const placeOrder = () => {
    history.push(`/payment/${laundryId}`, {
      userData,
      laundry,
      selectedServices,
      token,
      totalPrice: calculateTotalPrice(),
    });
  };

  // Function to check if the laundry is currently open
  const isOpen = () => {
    const now = new Date();
    const dayOfWeek = now
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase()
      .split(" ")[0]
      .split(",")[0];

    const hoursToday = laundry.openingHours[dayOfWeek];

    if (!hoursToday) return false; // Closed today

    const [openTime, closeTime] = hoursToday.split(" - ");

    const convertTo24Hour = (time) => {
      const [hourMin, period] = time.split(" ");
      let [hour, minute] = hourMin.split(":").map(Number);

      // Convert to 24-hour format
      if (period === "PM" && hour !== 12) {
        hour += 12;
      }
      if (period === "AM" && hour === 12) {
        hour = 0;
      }

      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      return date;
    };

    const open = convertTo24Hour(openTime);
    const close = convertTo24Hour(closeTime);

    return now >= open && now <= close;
  };

  if (loading || !laundry) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 p-4 bg-blue-100`}>
      <TouchableOpacity
        onPress={() => history.goBack()}
        style={tw`flex-row items-center mb-6`}
      >
        <Icon name="arrow-back" size={30} color="#333" />
      </TouchableOpacity>

      <Text style={tw`text-3xl font-bold mb-4`}>{laundry.name}</Text>
      <Text style={tw`text-base mb-4 ml-4`}>Address: {laundry.address}</Text>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={tw`justify-center items-center border-2 border-gray-400 rounded-lg p-4 mb-4 bg-white shadow-md ml-2`}
      >
        <Text style={[tw`text-lg mb-2`, { color: "#333" }]}>
          Click to view Opening Hours.
        </Text>
        <Text
          style={[
            tw`text-xl font-bold`,
            { color: isOpen() ? "#34C759" : "#FF3B30" },
          ]}
        >
          Currently: {isOpen() ? "Open" : "Closed"}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 m-6 justify-center items-center`}>
          <View style={tw`bg-white rounded-lg shadow-lg p-6 w-full`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-2xl font-bold`}>Opening Hours:</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={30} color="#333" />
              </TouchableOpacity>
            </View>
            {Object.entries(laundry.openingHours).map(([day, hours]) => (
              <Text key={day} style={tw`text-base mb-2`}>{`${
                day.charAt(0).toUpperCase() + day.slice(1)
              }: ${hours}`}</Text>
            ))}
          </View>
        </View>
      </Modal>

      <Text style={tw`text-lg mb-4 ml-4`}>Services:</Text>
      {Object.keys(laundry.services).map((service) => (
        <TouchableOpacity
          key={service}
          style={tw`flex-row items-center mb-2 ml-2 border-2 border-gray-500 rounded-lg px-4 py-2 mb-4 bg-white`}
          onPress={() => handleServiceSelection(service)}
        >
          <View
            style={[
              tw`w-6 h-6 border-2 rounded-full mr-2`,
              selectedServices.includes(service) &&
                tw`bg-blue-500 border-blue-500`,
            ]}
          />
          <View style={tw`flex-1`}>
            <Text style={tw`text-base text-left`}>{service}</Text>
          </View>
          <View>
            <Text style={tw`text-base text-right`}>
              {laundry.services[service]}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={tw`text-lg mb-2 ml-4 mt-4 font-semibold`}>
        Total Price: £{calculateTotalPrice()}
      </Text>
      <ActionButton
        title="Place Order"
        onPress={placeOrder}
        disabled={selectedServices.length === 0}
      />
    </ScrollView>
  );
};

export default LaundryDetails;
