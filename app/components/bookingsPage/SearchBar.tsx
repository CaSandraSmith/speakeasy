import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChangeText, 
  placeholder = "Search bookings..." 
}) => {
  return (
    <View className="flex-row items-center bg-textPrimary/10 rounded-full px-5 py-3 mx-2 mb-6">
      <Ionicons name="search" size={22} color="#8A8A8A" style={{ marginRight: 8 }} />
      <TextInput
        className="flex-1 text-textPrimary text-base font-montserrat"
        placeholder={placeholder}
        placeholderTextColor="#8A8A8A"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBar;
