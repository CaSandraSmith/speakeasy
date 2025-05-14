import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Search experiences..." 
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-textPrimary/10 rounded-full px-4 py-3 mx-8 mb-6">
      <TextInput
        className="flex-1 text-textPrimary text-base font-montserrat mr-3"
        placeholder={placeholder}
        placeholderTextColor="#8A8A8A"
        value={value}
        onChangeText={onChangeText}
      />
      <Ionicons name="search" size={22} color="#DCD7C9" />
    </View>
  );
}
