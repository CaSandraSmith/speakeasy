import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import CalendarPicker from "react-native-calendar-picker";
import { useAuthFetch } from "../../../context/userContext";
import Constants from "expo-constants";
import SelectPaymentMethod from "../paymentMethods/select";

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

export default function CreateBooking() {
  const router = useRouter();
  const { id, title, imageUrl, price } = useLocalSearchParams();
  const authFetch = useAuthFetch();

  // State
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");
  const [showCustomYearPicker, setShowCustomYearPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [modalVisiblity, setModalVisiblity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get current year and create array of future years
  const currentYear = new Date().getFullYear();
  const futureYears = Array.from({ length: 4 }, (_, i) => currentYear + i);

  // Min and max dates
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(currentYear + 3);

  // Format date for display
  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Handle date change from calendar
  const onDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle year selection
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setShowCustomYearPicker(false);

    // Update the calendar to show the selected year
    const newDate = new Date();
    newDate.setFullYear(year);
    newDate.setMonth(0); // January

    // If selected year is current year, make sure we don't go to past months
    if (year === currentYear) {
      const currentMonth = new Date().getMonth();
      newDate.setMonth(currentMonth);
    }
  };

  const handleContinuePress = () => {
    // Validate inputs
    if (!numberOfGuests) {
      Alert.alert("Missing Information", "Please enter the number of guests");
      return;
    }
    if (!selectedDate) {
      Alert.alert("Missing Information", "Please select a date");
      return;
    }

    setIsLoading(true);
    setModalVisiblity(true);
  };

  // Handle booking submission
  const handleBooking = async (paymentMethodId: number) => {
    if (!numberOfGuests) {
      Alert.alert("Missing Information", "Please enter the number of guests");
      return;
    }
    if (!selectedDate) {
      Alert.alert("Missing Information", "Please select a date");
      return;
    }

    try {
      // Prepare booking data
      const bookingData = {
        experience_id: parseInt(id as string),
        number_of_guests: parseInt(numberOfGuests),
        payment_method_id: paymentMethodId,
        reservations: [
          {
            date: selectedDate.toISOString(),
            time_slot: new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              10,
              0,
              0
            ).toISOString(), // Default to 10:00 AM
          },
        ],
        special_requests: specialRequests,
      };

      console.log("Creating booking with data:", bookingData);

      // Create booking on backend
      const response = await authFetch(`${FLASK_URL}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      const newBooking = await response.json();
      console.log("Booking created successfully:", newBooking);

      // Navigate to booking info page with the new booking ID
      router.push({
        pathname: "/experience/bookingInfo",
        params: { bookingId: newBooking.id },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      Alert.alert(
        "Booking Failed",
        error instanceof Error
          ? error.message
          : "Unable to create booking. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const customDayHeaderStylesCallback = () => {
    return {
      textStyle: {
        color: COLORS.accent,
        fontSize: 12,
        fontFamily: "Montserrat-Regular",
      },
    };
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* Header with back button */}
      <View className="flex-row items-center px-5 py-4 border-b border-textSecondary/20">
        <TouchableOpacity className="p-1" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.primaryText} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-semibold text-textPrimary font-montserrat-bold mr-10">
          Booking Details
        </Text>
      </View>

      <ScrollView className="px-5 py-4">
        {/* Experience Card */}
        <View className="flex-row bg-textPrimary/10 rounded-xl p-4 mb-6 items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-lg font-bold text-textPrimary font-playfair-bold">
              {title || "Experience Title"}
            </Text>
            <Text className="text-lg text-accent font-montserrat-bold mt-1">
              ${price || "0"} per person
            </Text>
          </View>
          <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-400">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl as string }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full justify-center items-center bg-gray-500">
                <Text className="text-white text-xs">Image</Text>
              </View>
            )}
          </View>
        </View>

        {/* Booking Form */}
        <View className="bg-textPrimary/5 rounded-xl p-5">
          {/* Number of Guests */}
          <View className="mb-5">
            <Text className="text-base font-medium text-textPrimary mb-2 font-montserrat">
              Number of guests
            </Text>
            <TextInput
              className="bg-white rounded-lg px-4 py-3 text-base text-gray-800"
              value={numberOfGuests}
              onChangeText={setNumberOfGuests}
              placeholder="Enter number of guests"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>

          {/* Date Picker */}
          <View className="mb-5">
            <Text className="text-base font-medium text-textPrimary mb-3 font-montserrat">
              Experience Date
            </Text>

            {/* Date Display */}
            <TouchableOpacity
              className="bg-white rounded-lg px-4 py-3 mb-3"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-xs text-gray-600 mb-1">Select Date</Text>
              <Text
                className={
                  selectedDate
                    ? "text-sm text-gray-800 font-montserrat"
                    : "text-sm text-gray-400"
                }
              >
                {selectedDate
                  ? formatDateDisplay(selectedDate)
                  : "Choose your experience date"}
              </Text>
            </TouchableOpacity>

            {/* Calendar Modal */}
            <Modal
              visible={showDatePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-11/12 bg-background rounded-xl p-4 max-h-[80%]">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-textPrimary font-playfair-bold">
                      Select Experience Date
                    </Text>
                  </View>

                  <CalendarPicker
                    startFromMonday={false}
                    allowRangeSelection={false}
                    minDate={minDate}
                    maxDate={maxDate}
                    initialDate={
                      new Date(selectedYear, new Date().getMonth(), 1)
                    }
                    todayBackgroundColor={`${COLORS.accent}33`}
                    selectedDayColor={COLORS.accent}
                    selectedDayTextColor={COLORS.background}
                    onDateChange={onDateChange}
                    textStyle={{
                      fontFamily: "Montserrat-Regular",
                      color: COLORS.primaryText,
                    }}
                    weekdays={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
                    months={[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ]}
                    previousTitle="‹"
                    nextTitle="›"
                    previousTitleStyle={{
                      color: COLORS.accent,
                      fontSize: 22,
                    }}
                    nextTitleStyle={{
                      color: COLORS.accent,
                      fontSize: 22,
                    }}
                    monthTitleStyle={{
                      color: COLORS.primaryText,
                      fontSize: 18,
                      fontFamily: "Montserrat-Bold",
                    }}
                    dayLabelsWrapper={{
                      borderBottomWidth: 0,
                      borderTopWidth: 0,
                      paddingBottom: 10,
                      borderColor: `${COLORS.accent}33`,
                    }}
                    customDayHeaderStyles={customDayHeaderStylesCallback}
                    selectedStartDate={selectedDate}
                    disabledDatesTextStyle={{
                      color: "#666666",
                      textDecorationLine: "line-through",
                    }}
                    restrictMonthNavigation={true}
                    width={320}
                    height={350}
                  />

                  <TouchableOpacity
                    className="bg-accent rounded-lg py-3 mt-4 items-center"
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text className="text-background text-base font-bold font-montserrat">
                      Confirm Date
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Custom Year Picker Modal */}
            <Modal
              visible={showCustomYearPicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowCustomYearPicker(false)}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-3/4 bg-background rounded-xl p-4 max-h-[50%]">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-textPrimary">
                      Select Year
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowCustomYearPicker(false)}
                    >
                      <Ionicons
                        name="close"
                        size={24}
                        color={COLORS.primaryText}
                      />
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={futureYears}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className={`py-3 px-4 rounded-lg mb-2 ${
                          item === selectedYear ? "bg-accent" : "bg-accent/20"
                        }`}
                        onPress={() => handleYearSelect(item)}
                      >
                        <Text
                          className={`text-center font-montserrat ${
                            item === selectedYear
                              ? "text-background font-bold"
                              : "text-textPrimary"
                          }`}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </Modal>
          </View>

          {/* Special Requests */}
          <View className="mb-5">
            <Text className="text-base font-medium text-textPrimary mb-2 font-montserrat">
              Special Requests
            </Text>
            <TextInput
              className="bg-white rounded-lg px-4 py-3 text-base text-gray-800 min-h-[120px]"
              value={specialRequests}
              onChangeText={setSpecialRequests}
              placeholder="Any special requests or accommodations needed?"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Book Button and Total Price */}
      <View className="bg-background border-t border-textSecondary/20">
        {/* Total Price Display */}
        {numberOfGuests && price && (
          <View className="px-5 py-3 flex-row justify-between items-center">
            <Text className="text-textPrimary font-montserrat">
              Total Price:
            </Text>
            <Text className="text-xl text-accent font-montserrat-bold">
              ${parseInt(numberOfGuests) * parseInt((price as string) || "0")}
            </Text>
          </View>
        )}

        {/* Book Button */}
        <View className="p-5 pt-2">
          <TouchableOpacity
            className={`bg-accent rounded-3xl py-4 items-center justify-center`}
            onPress={() => handleContinuePress()}
          >
            <Text className="text-background text-lg font-semibold font-montserrat-bold">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {modalVisiblity && (
        <SelectPaymentMethod
          visibility={modalVisiblity}
          setVisibility={setModalVisiblity}
          handleBooking={handleBooking}
        />
      )}
    </SafeAreaView>
  );
}
