import React, { useState } from 'react';
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
  FlatList
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import CalendarPicker from 'react-native-calendar-picker';

export default function CreateBooking() {
  const router = useRouter();
  const { id, title, imageUrl } = useLocalSearchParams();
  
  // State
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [showCustomYearPicker, setShowCustomYearPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Get current year and create array of future years
  const currentYear = new Date().getFullYear();
  const futureYears = Array.from({ length: 11 }, (_, i) => currentYear + i);
  
  // Min and max dates
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(currentYear + 10);

  // Format date for display
  const formatDateDisplay = (date: Date | null) => {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Calculate nights
  const calculateNights = () => {
    if (selectedStartDate && selectedEndDate) {
      const timeDiff = selectedEndDate.getTime() - selectedStartDate.getTime();
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  // Handle date change from calendar
  const onDateChange = (date: Date, type: 'START_DATE' | 'END_DATE') => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null); // Reset end date when start date changes
    }
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

  // Handle booking submission
  const handleBooking = () => {
    if (!numberOfGuests) {
      alert('Please enter the number of guests');
      return;
    }
    if (!selectedStartDate || !selectedEndDate) {
      alert('Please select both check-in and check-out dates');
      return;
    }

    // Mock booking data
    const bookingData = {
      experienceId: id,
      numberOfGuests: parseInt(numberOfGuests),
      startDate: selectedStartDate.toISOString(),
      endDate: selectedEndDate.toISOString(),
      specialRequests: specialRequests
    };
    
    // Navigate to bookings tab
    router.push('/experience/bookingInfo');
  };

  // Custom day style for the calendar
  const customDayHeaderStylesCallback = () => {
    return {
      textStyle: {
        color: COLORS.accent,
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
      }
    };
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
          
          {/* Date Range Picker */}
          <View className="mb-5">
            <Text className="text-base font-medium text-textPrimary mb-3 font-montserrat">
              Travel Dates
            </Text>
            
            {/* Date Display */}
            <View className="flex-row gap-3 mb-3">
              {/* Start Date */}
              <TouchableOpacity 
                className="flex-1 bg-white rounded-lg px-4 py-3"
                onPress={() => setShowDatePicker(true)}
              >
                <Text className="text-xs text-gray-600 mb-1">Check-in</Text>
                <Text className={selectedStartDate ? "text-sm text-gray-800 font-montserrat" : "text-sm text-gray-400"}>
                  {selectedStartDate ? formatDateDisplay(selectedStartDate) : 'Select date'}
                </Text>
              </TouchableOpacity>
              
              {/* End Date */}
              <TouchableOpacity 
                className="flex-1 bg-white rounded-lg px-4 py-3"
                onPress={() => setShowDatePicker(true)}
              >
                <Text className="text-xs text-gray-600 mb-1">Check-out</Text>
                <Text className={selectedEndDate ? "text-sm text-gray-800 font-montserrat" : "text-sm text-gray-400"}>
                  {selectedEndDate ? formatDateDisplay(selectedEndDate) : 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Duration display */}
            {selectedStartDate && selectedEndDate && (
              <View className="flex-row items-center justify-center mb-3">
                <Ionicons name="moon-outline" size={16} color={COLORS.secondaryText} />
                <Text className="text-sm text-textSecondary ml-1 font-montserrat">
                  {calculateNights()} nights
                </Text>
              </View>
            )}
            
            {/* Date Range Selection Button */}
            <TouchableOpacity 
              className="bg-accent/20 rounded-lg py-3 items-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-textPrimary font-montserrat">
                {selectedStartDate && selectedEndDate ? 'Change Dates' : 'Select Dates'}
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
                      Select Travel Dates
                    </Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Ionicons name="close" size={24} color={COLORS.primaryText} />
                    </TouchableOpacity>
                  </View>
                  
                  <Text className="text-sm text-textSecondary text-center mb-4 font-montserrat">
                    Select your check-in and check-out dates
                  </Text>
                  
                  {/* Custom Year Selector */}
                  <TouchableOpacity 
                    className="bg-accent/20 rounded-lg px-4 py-2 mb-4 self-center"
                    onPress={() => setShowCustomYearPicker(true)}
                  >
                    <Text className="text-textPrimary font-montserrat">
                      {selectedYear} ›
                    </Text>
                  </TouchableOpacity>
                  
                  <CalendarPicker
                    startFromMonday={false}
                    allowRangeSelection={true}
                    minDate={minDate}
                    maxDate={maxDate}
                    initialDate={new Date(selectedYear, new Date().getMonth(), 1)}
                    todayBackgroundColor={`${COLORS.accent}33`}
                    selectedDayColor={COLORS.primary}
                    selectedDayTextColor={COLORS.primary}
                    selectedRangeStyle={{
                      backgroundColor: `${COLORS.primaryText}`,
                    }}
                    onDateChange={onDateChange}
                    textStyle={{
                      fontFamily: 'Montserrat-Regular',
                      color: COLORS.primaryText,
                    }}
                    weekdays={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                    months={[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
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
                      fontFamily: 'Montserrat-Bold',
                    }}
                    dayLabelsWrapper={{
                      borderBottomWidth: 0,
                      borderTopWidth: 0,
                      paddingBottom: 10,
                      borderColor: `${COLORS.accent}33`,
                    }}
                    customDayHeaderStyles={customDayHeaderStylesCallback}
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    disabledDatesTextStyle={{
                      color: '#666666',
                      textDecorationLine: 'line-through',
                    }}
                    restrictMonthNavigation={true}
                    minRangeDuration={1}
                    width={320}
                    height={350}
                  />
                  
                  <TouchableOpacity 
                    className="bg-accent rounded-lg py-3 mt-4 items-center"
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text className="text-background text-base font-bold font-montserrat">
                      Confirm Dates
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
                    <TouchableOpacity onPress={() => setShowCustomYearPicker(false)}>
                      <Ionicons name="close" size={24} color={COLORS.primaryText} />
                    </TouchableOpacity>
                  </View>
                  
                  <FlatList
                    data={futureYears}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className={`py-3 px-4 rounded-lg mb-2 ${
                          item === selectedYear ? 'bg-textSecondary' : 'bg-textSecondary/20'
                        }`}
                        onPress={() => handleYearSelect(item)}
                      >
                        <Text className={`text-center font-montserrat ${
                          item === selectedYear ? 'text-background font-bold' : 'text-textPrimary'
                        }`}>
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
      
      {/* Book Button */}
      <View className="p-5 bg-background border-t border-textSecondary/20">
        <TouchableOpacity 
          className="bg-accent rounded-3xl py-4 items-center justify-center"
          onPress={handleBooking}
        >
          <Text className="text-background text-lg font-semibold font-montserrat-bold">
            Book Experience
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
