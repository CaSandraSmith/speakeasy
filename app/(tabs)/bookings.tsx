import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, FlatList } from 'react-native';
import '../globals.css';

// Components
import BookingCard, { Booking } from '../components/bookingsPage/BookingsCard';
import SearchBar from '../components/bookingsPage/SearchBar';
import { getMockBookings } from '../constants/bookingsData';
import Animated from 'react-native-reanimated';

export default function BookingsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<Booking[]>(getMockBookings());
  
  // Filter bookings based on search query
  const filteredBookings = bookings.filter(booking => 
    booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <Text className="text-4xl font-bold text-textPrimary mt-5 mb-8 px-6 font-playfair-bold">
        All Bookings
      </Text>
      
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {/* Bookings List */}
      <Animated.FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-textPrimary text-lg font-montserrat text-center">
              No bookings found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
