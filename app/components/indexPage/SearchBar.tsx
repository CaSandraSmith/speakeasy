import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, Pressable, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createPortal } from 'react-dom';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

export default function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchBarPosition, setSearchBarPosition] = useState({ x: 0, y: 0, width: 0 });

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.trim().length > 0) {
        try {
          console.log('Fetching suggestions for:', value.trim());
          const response = await fetch(`http://localhost:5001/search?q=${encodeURIComponent(value.trim())}`);
          const data = await response.json();
          console.log('Received suggestions:', data.suggestions);
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleSearch = (searchValue: string) => {
    if (searchValue.trim()) {
      setShowSuggestions(false);
      router.push({
        pathname: '/(stack)/experience',
        params: { search: searchValue.trim() }
      });
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setShowSuggestions(false);
    handleSearch(suggestion);
    onChangeText(suggestion);
  };

  const onSearchBarLayout = (event: any) => {
    const { x, y, width } = event.nativeEvent.layout;
    setSearchBarPosition({ x, y, width });
  };

  const renderDropdown = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    const dropdownContent = (
      <View
        style={{
          position: 'fixed',
          top: searchBarPosition.y - 90,
          left: searchBarPosition.x,
          width: searchBarPosition.width,
          backgroundColor: 'white',
          borderRadius: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxHeight: 240,
          zIndex: 999999,
        }}
      >
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSuggestionPress(item)}
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0',
              }}
            >
              <Text style={{ color: '#1A1A1A', fontFamily: 'Montserrat' }}>{item}</Text>
            </Pressable>
          )}
        />
      </View>
    );

    if (Platform.OS === 'web') {
      return createPortal(dropdownContent, document.body);
    }

    return dropdownContent;
  };

  return (
    <View className="relative" onLayout={onSearchBarLayout}>
      <View className="flex-row items-center bg-textPrimary/10 rounded-full px-4 py-3 mb-6">
        <TextInput
          className="flex-1 text-textPrimary font-montserrat text-base"
          placeholder="Search experiences..."
          placeholderTextColor="#DCD7C9"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => handleSearch(value)}
          returnKeyType="search"
          onFocus={() => value.trim().length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <TouchableOpacity onPress={() => handleSearch(value)}>
          <Ionicons name="search" size={24} color="#DCD7C9" />
        </TouchableOpacity>
      </View>
      {renderDropdown()}
    </View>
  );
}
