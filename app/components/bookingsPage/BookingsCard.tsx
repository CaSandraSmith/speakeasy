import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Define the BookingStatus type directly in this file
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

// Define the Booking interface directly in this file
export interface Booking {
  id: number;
  experienceId: number;
  title: string;
  location: string;
  country: string;
  image: any; // Using 'any' for image source type
  startDate: string;
  endDate: string;
  status: BookingStatus;
}

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      className="flex-row bg-[#F5F5F0] rounded-3xl overflow-hidden mb-5"
      onPress={() => router.push(`/experience/${booking.experienceId}`)}
      activeOpacity={0.9}
    >
      <Image 
        source={booking.image} 
        className="w-40 h-40"
        resizeMode="cover"
      />
      
      <View className="flex-1 p-5 justify-between">
        <View>
          <Text className="text-[#1A1A1A] text-2xl font-bold font-playfair-bold mb-1">{booking.title}</Text>
          <Text className="text-[#5A5A5A] text-lg font-montserrat mb-3">{booking.country}</Text>
          
          <View className="mt-1">
            <Text className="text-[#3A3A3A] text-base font-montserrat">{booking.startDate}</Text>
            <Text className="text-[#3A3A3A] text-base font-montserrat">{booking.endDate}</Text>
          </View>
        </View>
        
        <View className={`self-start px-6 py-2 rounded-full ${
          booking.status === 'upcoming' ? 'bg-textSecondary/30' : 'bg-gray-200'
        }`}>
          <Text className={`text-base font-bold font-montserrat-bold ${
            booking.status === 'upcoming' ? 'text-textSecondary' : 'text-[#323232]'
          }`}>
            {booking.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookingCard;
