import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

export default function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
  const router = useRouter();
  
  const handleSearch = () => {
    if (value.trim()) {
      // If there's an onSubmit prop, call it (for cases where custom handling is needed)
      if (onSubmit) {
        onSubmit();
      } else {
        // Directly navigate to experience index page
        router.push('/(stack)/experience');
      }
    }
  };

  return (
    <View className="flex-row items-center bg-textPrimary/10 rounded-full px-4 py-3 mb-6">
      <TextInput
        className="flex-1 text-textPrimary font-montserrat text-base"
        placeholder="Search"
        placeholderTextColor="#DCD7C9"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={handleSearch}>
        <Ionicons name="search" size={24} color="#DCD7C9" />
      </TouchableOpacity>
    </View>
  );
}
