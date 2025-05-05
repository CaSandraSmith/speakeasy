import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

export default function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-textPrimary/60 rounded-full px-4 py-3 mb-6">
      <TextInput
        className="flex-1 text-primary font-montserrat"
        placeholder="Search"
        placeholderTextColor="text-primaryText"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={onSubmit}>
        <Ionicons name="search" size={24} color="#DCD7C9" />
      </TouchableOpacity>
    </View>
  );
}
