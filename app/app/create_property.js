// app/app/create_property.js
import { View, Text, ScrollView, Modal, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createProperty,
  resetAuthState,
} from "../store/property/propertySlice";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import MapComponent from "../components/MapComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import SellVilla from "./propertyComponent/Villa/SellVilla";
import RentVilla from "./propertyComponent/Villa/RentVilla";
import SellApartment from "./propertyComponent/Apartment/SellApartment";
import RentApartment from "./propertyComponent/Apartment/RentApartment";
import SellWarehouse from "./propertyComponent/Warehouse/SellWarehouse";
import RentWarehouse from "./propertyComponent/Warehouse/RentWarehouse";
import SellCar from "./propertyComponent/Car/SellCar";
import RentCar from "./propertyComponent/Car/RentCar";
// import SellHall from "./propertyComponent/Hall/SellHall";
import RentHall from "./propertyComponent/Hall/RentHall";
import Ionicons from "react-native-vector-icons/Ionicons";

const CreateProperty = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { type, action } = useLocalSearchParams();

  const initialFormData = {
    title: "",
    location: "",
    price: 0,
    description: "",
    ...(type === "villa" && { num_bed: 0, gardenSize: "" }),
    ...(type === "apartment" && { numberOfRooms: 0 }),
    ...(type === "warehouse" && { storageCapacity: 0 }),
    ...(type === "car" && { makeModel: "" }),
    ...(type === "hall" && { capacity: 0 }),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showMapModal, setShowMapModal] = useState(false);
  const { isSuccess, isError, message } = useSelector(
    (state) => state.property
  );

  const handleLocationSelect = (coords) => {
    const locationString = `${coords.latitude}, ${coords.longitude}`;
    setFormData({ ...formData, location: locationString });
    setShowMapModal(false);
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      propertyType: type,
      property_use: action,
    };

    dispatch(createProperty(data));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="bg-white dark:bg-gray-800 p-6 rounded-b-3xl shadow-sm">
          <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Create Property
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            Fill in the details for your {type} listing
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6 pt-6"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6">
            {type === "villa" &&
              (action === "sell" ? (
                <SellVilla formData={formData} setFormData={setFormData} />
              ) : (
                <RentVilla formData={formData} setFormData={setFormData} />
              ))}
            {type === "apartment" &&
              (action === "sell" ? (
                <SellApartment formData={formData} setFormData={setFormData} />
              ) : (
                <RentApartment formData={formData} setFormData={setFormData} />
              ))}
            {type === "warehouse" &&
              (action === "sell" ? (
                <SellWarehouse formData={formData} setFormData={setFormData} />
              ) : (
                <RentWarehouse formData={formData} setFormData={setFormData} />
              ))}
            {type === "car" &&
              (action === "sell" ? (
                <SellCar formData={formData} setFormData={setFormData} />
              ) : (
                <RentCar formData={formData} setFormData={setFormData} />
              ))}
            {type === "hall" && action === "rent" && (
              <RentHall formData={formData} setFormData={setFormData} />
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowMapModal(true)}
            className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl mb-6 flex-row items-center"
          >
            <View className="bg-blue-100 dark:bg-blue-800 p-2 rounded-xl mr-4">
              <Ionicons name="location-outline" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-blue-600 dark:text-blue-400 text-lg font-semibold">
                Select Location
              </Text>
              <Text className="text-blue-500 dark:text-blue-300 opacity-60">
                {formData.location || "Choose on map"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#FF8E01] p-4 rounded-2xl mb-6"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Add Property
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={showMapModal}
          animationType="slide"
          onRequestClose={() => setShowMapModal(false)}
        >
          <View className="flex-1">
            <MapComponent onLocationSelect={handleLocationSelect} />
            <View className="p-6">
              <TouchableOpacity
                onPress={() => setShowMapModal(false)}
                className="bg-gray-200 dark:bg-gray-800 p-4 rounded-2xl"
              >
                <Text className="text-gray-800 dark:text-white text-center text-lg font-semibold">
                  Close Map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default CreateProperty;
