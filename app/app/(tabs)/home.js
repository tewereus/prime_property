import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRentProperties,
  getAllSellProperties,
} from "../../store/property/propertySlice";
import {
  addToWishlist,
  changeLanguage,
  changeLanguageMode,
} from "../../store/auth/authSlice";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";

const Home = () => {
  const dispatch = useDispatch();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favouriteOn, setFavouriteOn] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const loadColorScheme = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      if (userData && userData.preference) {
        const storedMode = userData.preference.mode;
        setColorScheme(storedMode);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  useEffect(() => {
    loadColorScheme();
    dispatch(getAllSellProperties());
    dispatch(getAllRentProperties());
  }, []);

  const { sellProperties, rentProperties, isSuccess } = useSelector(
    (state) => state.property
  );

  const { t, i18n } = useTranslation();

  const handlePress = (prop) => {
    setSelectedProperty(prop);
    setFavouriteOn(prop.isFavorite);
    setModalVisible(true);
  };

  const handleFavourite = () => {
    const data = {
      prodId: selectedProperty?._id,
    };
    dispatch(addToWishlist(data));
    setFavouriteOn(!favouriteOn);
  };

  const renderPropertyItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      className="bg-white rounded-2xl shadow-lg m-2 overflow-hidden"
      style={{
        width: 280,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      {/* Image Container */}
      <View className="relative">
        <Image
          source={{
            uri:
              item.image ||
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />

        {/* Price Tag */}
        <View className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full">
          <Text className="text-blue-600 font-bold">{item.price}</Text>
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full"
          onPress={() => handleFavourite(item)}
        >
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={item.isFavorite ? "#EF4444" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View className="pl-4 pr-4 pb-4">
        {/* Property Name */}
        <Text className="text-lg font-bold text-gray-800 mb-1">
          {item.name}
        </Text>

        {/* Location */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {item.location || "Location not specified"}
          </Text>
        </View>

        {/* Property Details */}
        <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100">
          {/* Bedrooms */}
          <View className="flex-row items-center">
            <Ionicons name="bed-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {item.bedrooms || "3"} beds
            </Text>
          </View>

          {/* Bathrooms */}
          <View className="flex-row items-center">
            <Ionicons name="water-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {item.bathrooms || "2"} baths
            </Text>
          </View>

          {/* Area */}
          <View className="flex-row items-center">
            <Ionicons name="square-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {item.area || "1,200"} sqft
            </Text>
          </View>
        </View>

        {/* Date and Status */}
        <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100">
          <Text className="text-gray-500 text-xs">
            Listed {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <View className="bg-green-100 px-2 py-1 rounded-full">
            <Text className="text-green-600 text-xs font-medium">
              {item.status || "Available"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const changeLanguage = (lng) => {
    const data = {
      preference: {
        language: lng,
      },
    };
    i18n.changeLanguage(lng);
    dispatch(changeLanguageMode(data));
  };

  // Update the placeholderImages array with real estate placeholder images
  const placeholderImages = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
  ];

  // Add state for carousel
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleBuyProperty = async () => {
    if (!selectedProperty?._id) return;

    setIsPurchasing(true);
    try {
      // Your purchase logic here
      // For example:
      // await dispatch(buyProperty({ propertyId: selectedProperty._id }));

      Alert.alert("Success", "Property purchase initiated successfully!");
      setModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to initiate property purchase"
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] flex-1">
      <View className="px-5 pt-5">
        <View className="flex flex-row justify-between">
          <Text className="text-2xl font-bold dark:text-slate-300 mb-4">
            Home
          </Text>
          <View className="flex-row mb-10">
            <TouchableOpacity
              onPress={() => changeLanguage("Eng")}
              className="dark:text-slate-300"
            >
              <Text className="mr-10 dark:text-slate-300">English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage("Amh")}>
              <Text className="dark:text-slate-300">ኣማርኛ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {sellProperties?.length > 0 || rentProperties?.length > 0 ? (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100, // Add padding to bottom of scroll view
          }}
        >
          {/* Sell Properties Section */}
          <Text className="text-lg dark:text-white mb-2">
            {t("available_for_sell")}
          </Text>
          <FlatList
            data={sellProperties}
            keyExtractor={(item) => item._id}
            renderItem={renderPropertyItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={295}
          />

          {/* Rent Properties Section */}
          <Text className="text-lg dark:text-white mt-4 mb-2">
            {t("available_for_rent")}
          </Text>
          <FlatList
            data={rentProperties}
            keyExtractor={(item) => item._id}
            renderItem={renderPropertyItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              paddingBottom: 20, // Add extra padding at bottom
            }}
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={295} // width of card (280) + separator (15)
          />

          {/* Add bottom padding to ensure last item is fully visible */}
          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        <Text className="text-center dark:text-white">
          No properties listed
        </Text>
      )}

      {/* Property Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-white dark:bg-gray-900">
          {/* Modal Header */}
          <View className="relative bg-white dark:bg-gray-900 pt-12 pb-4 px-5">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute left-5 top-12 z-10 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-center text-xl font-bold text-gray-800 dark:text-white">
              Property Details
            </Text>
          </View>

          {selectedProperty && (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Image Carousel */}
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const slideSize = event.nativeEvent.layoutMeasurement.width;
                  const index = event.nativeEvent.contentOffset.x / slideSize;
                  setActiveImageIndex(Math.round(index));
                }}
              >
                {(selectedProperty?.images?.length > 0
                  ? selectedProperty.images
                  : placeholderImages
                ).map((image, index) => (
                  <Image
                    key={index}
                    source={{
                      uri:
                        typeof image === "string"
                          ? image
                          : image.url || placeholderImages[0],
                    }}
                    className="w-screen h-72"
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* Carousel Indicators */}
              <View className="flex-row justify-center mt-2">
                {(selectedProperty?.images?.length > 0
                  ? selectedProperty.images
                  : placeholderImages
                ).map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 ${
                      index === activeImageIndex
                        ? "bg-blue-600 w-4"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </View>

              {/* Content */}
              <View className="p-5">
                {/* Price and Favorite */}
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${selectedProperty.price}
                  </Text>
                  <TouchableOpacity
                    onPress={handleFavourite}
                    className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full"
                  >
                    <Ionicons
                      name={favouriteOn ? "heart" : "heart-outline"}
                      size={24}
                      color={favouriteOn ? "#EF4444" : "#6B7280"}
                    />
                  </TouchableOpacity>
                </View>

                {/* Property Name */}
                <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {selectedProperty.name}
                </Text>

                {/* Location */}
                <View className="flex-row items-center mb-4">
                  <Ionicons name="location" size={20} color="#6B7280" />
                  <Text className="text-gray-600 dark:text-gray-300 ml-2 text-base">
                    {selectedProperty.location}
                  </Text>
                </View>

                {/* Property Features */}
                <View className="flex-row justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                  <View className="items-center">
                    <Ionicons name="bed-outline" size={24} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                      {selectedProperty.bedrooms || "3"} Beds
                    </Text>
                  </View>
                  <View className="items-center">
                    <Ionicons name="water-outline" size={24} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                      {selectedProperty.bathrooms || "2"} Baths
                    </Text>
                  </View>
                  <View className="items-center">
                    <Ionicons name="square-outline" size={24} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                      {selectedProperty.area || "1,200"} sqft
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Description
                </Text>
                <Text className="text-gray-600 dark:text-gray-300 mb-4">
                  {selectedProperty.description || "No description available"}
                </Text>
              </View>
            </ScrollView>
          )}

          {/* Bottom Action Button */}
          <View className="p-5 border-t border-gray-200 dark:border-gray-800">
            <TouchableOpacity
              onPress={handleBuyProperty}
              disabled={isPurchasing}
              className={`${
                isPurchasing ? "bg-gray-400" : "bg-blue-600"
              } rounded-xl py-4 px-6`}
            >
              {isPurchasing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-base">
                  Buy Property
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
