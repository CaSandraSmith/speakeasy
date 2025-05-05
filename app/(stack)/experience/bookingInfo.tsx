import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image, 
  SafeAreaView, 
  StatusBar,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function BookingInfo() {
  const router = useRouter();
  const { id, title, imageUrl } = useLocalSearchParams();
  
  // State
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Format the date for display
    const formatDate = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('en-US', options);
    };
    
    setFormattedDate(formatDate(date));
  }, [date]);

  // Handle date change
  const onChangeDate = (selectedDate: Date) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  // Handle booking submission
  const handleBooking = () => {
    // Here you would typically validate inputs and submit to your API
    if (!numberOfGuests) {
      alert('Please enter the number of guests');
      return;
    }

    // Mock booking data
    const bookingData = {
      experienceId: id,
      numberOfGuests: parseInt(numberOfGuests),
      date: date.toISOString(),
      specialRequests: specialRequests
    };

    console.log('Booking data:', bookingData);
    
    // Navigate to bookings tab
    router.push('/bookings');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      
      {/* Header with back button */}
      <View className="flex-row items-center px-5 py-4 border-b border-textSecondary/20">
        <TouchableOpacity
          className="p-1"
          onPress={() => router.back()}
        >
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
              {title || 'Experience Title'}
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
            <Text className="text-base font-medium text-textPrimary mb-2 font-montserrat">
              Date
            </Text>
            <TouchableOpacity 
              className="bg-white rounded-lg px-4 py-3 justify-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className={formattedDate ? "text-base text-gray-800" : "text-base text-gray-400"}>
                {formattedDate || 'Select a date'}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={showDatePicker}
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View className="flex-1 justify-center items-center bg-black/50">
                  <View className="w-4/5 bg-background rounded-xl p-5 border border-accent">
                    <View className="flex-row justify-between items-center mb-5 border-b border-textSecondary/30 pb-2">
                      <Text className="text-lg font-bold text-textPrimary">
                        Select Date
                      </Text>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Text className="text-base text-textSecondary">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    {/* Date Selector - Improved Version */}
                    <View className="flex-row justify-around mb-5">
                      {/* Month Selector */}
                      <View className="flex-1 mr-2">
                        <Text className="text-textPrimary font-bold text-center mb-2">Month</Text>
                        <ScrollView className="max-h-40" showsVerticalScrollIndicator={true}>
                          {Array.from({ length: 12 }, (_, i) => {
                            const monthDate = new Date();
                            monthDate.setMonth(monthDate.getMonth() + i);
                            const monthName = monthDate.toLocaleString('default', { month: 'long' });
                            const monthYear = monthDate.getFullYear();
                            const isSelected = date.getMonth() === monthDate.getMonth() && 
                                              date.getFullYear() === monthDate.getFullYear();
                            
                            return (
                              <TouchableOpacity 
                                key={`month-${i}`}
                                className={`p-2 my-1 rounded-lg items-center ${isSelected ? 'bg-accent' : ''}`}
                                onPress={() => {
                                  const newDate = new Date(date);
                                  newDate.setMonth(monthDate.getMonth());
                                  newDate.setFullYear(monthDate.getFullYear());
                                  setDate(newDate);
                                }}
                              >
                                <Text className={`text-base ${isSelected ? 'text-background font-bold' : 'text-textPrimary'}`}>
                                  {monthName} {monthYear !== new Date().getFullYear() ? monthYear : ''}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>
                      
                      {/* Day Selector */}
                      <View className="flex-1 ml-2">
                        <Text className="text-textPrimary font-bold text-center mb-2">Day</Text>
                        <ScrollView className="max-h-40" showsVerticalScrollIndicator={true}>
                          {Array.from({ length: 31 }, (_, i) => {
                            const day = i + 1;
                            const isSelected = date.getDate() === day;
                            
                            // Create a date to check if this day is valid for the selected month
                            const checkDate = new Date(date);
                            checkDate.setDate(day);
                            
                            // Skip rendering if the day doesn't exist in current month
                            if (checkDate.getMonth() !== date.getMonth()) return null;
                            
                            return (
                              <TouchableOpacity 
                                key={`day-${day}`}
                                className={`p-2 my-1 rounded-lg items-center ${isSelected ? 'bg-accent' : ''}`}
                                onPress={() => {
                                  const newDate = new Date(date);
                                  newDate.setDate(day);
                                  setDate(newDate);
                                }}
                              >
                                <Text className={`text-base ${isSelected ? 'text-background font-bold' : 'text-textPrimary'}`}>
                                  {day}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      className="bg-accent rounded-lg p-3 items-center"
                      onPress={() => onChangeDate(date)}
                    >
                      <Text className="text-background text-base font-bold">
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}
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
      
      {/* Book Button */}
      <View className="p-5 bg-background border-t border-textSecondary/20">
        <TouchableOpacity 
          className="bg-accent rounded-3xl py-4 items-center justify-center"
          onPress={handleBooking}
        >
          <Text className="text-white text-lg font-semibold font-montserrat-bold">
            Book
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
