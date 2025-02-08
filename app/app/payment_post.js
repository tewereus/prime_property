import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import {
  createProperty,
  updateProperty,
} from "../store/property/propertySlice";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { initializePayment } from "../store/payment/paymentSlice";

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  const methods = [
    { id: "telebirr", name: "TeleBirr", icon: "phone-portrait-outline" },
    { id: "cbe", name: "CBE Birr", icon: "card-outline" },
    { id: "cash", name: "Cash", icon: "cash-outline" },
  ];

  return (
    <View className="mb-6">
      {methods.map((method) => (
        <TouchableOpacity
          key={method.id}
          onPress={() => onSelect(method.id)}
          className={`flex-row items-center p-4 mb-3 rounded-xl border ${
            selectedMethod === method.id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <View className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
            <Ionicons name={method.icon} size={24} color="#3B82F6" />
          </View>
          <Text
            className={`flex-1 text-lg ${
              selectedMethod === method.id
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {method.name}
          </Text>
          <View
            className={`w-6 h-6 rounded-full border-2 ${
              selectedMethod === method.id
                ? "border-blue-500 bg-blue-500"
                : "border-gray-300 dark:border-gray-600"
            } items-center justify-center`}
          >
            {selectedMethod === method.id && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const PaymentPost = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const propertyData = params.propertyData
    ? JSON.parse(params.propertyData)
    : null;
  const isEdit = params.isEdit === "true";

  const handlePayment = useCallback(async () => {
    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    if (!propertyData) {
      Alert.alert("Error", "Property data is missing");
      return;
    }

    setIsProcessing(true);
    try {
      // First create/update the property
      let property;
      // if (isEdit) {
      //   property = await dispatch(updateProperty(propertyData)).unwrap();
      // } else {
      //   property = await dispatch(createProperty(propertyData)).unwrap();
      // }

      // if (!property?._id) {
      //   throw new Error("Failed to create/update property");
      // }

      const paymentData = {
        amount: 100,
        propertyId: propertyData._id,
        paymentMethod: paymentMethod,
        transactionType: "rent",
      };

      console.log("Initiating payment with data:", paymentData);

      const response = await dispatch(initializePayment(paymentData)).unwrap();
      console.log("Payment initialization response:", response);

      if (!response?.paymentUrl) {
        throw new Error("Payment URL not received from server");
      }

      router.push({
        pathname: "/payment-webview",
        params: {
          paymentUrl: response.paymentUrl,
          tx_ref: response.tx_ref,
        },
      });

      // Clear state
      setPaymentMethod("");
      setIsProcessing(false);

      // Alert.alert(
      //   "Payment Initiated",
      //   "Complete the payment in your browser. Your property will be listed once payment is confirmed.",
      //   [{ text: "OK" }]
      // );
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to process payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  }, [paymentMethod, propertyData, isEdit, dispatch, router]);

  if (!propertyData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-red-500 text-lg text-center">
            Error: Property data is missing
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-[#FF8E01] px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800 dark:text-white">
              Payment for {isEdit ? "Updating" : "Listing"}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Amount Section */}
          <View className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-6">
            <Text className="text-gray-500 dark:text-gray-400 mb-2">
              Amount to Pay
            </Text>
            <Text className="text-3xl font-bold text-gray-800 dark:text-white">
              ETB {"100.00"}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-2">
              {isEdit ? "Property update fee" : "Rental listing fee"}
            </Text>
          </View>

          {/* Payment Method Selection */}
          <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Select Payment Method
          </Text>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </ScrollView>

        {/* Payment Button */}
        <View className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={handlePayment}
            disabled={isProcessing || !paymentMethod}
            className={`${
              isProcessing || !paymentMethod ? "bg-gray-400" : "bg-[#FF8E01]"
            } rounded-xl py-4`}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Pay & List Property
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentPost;
