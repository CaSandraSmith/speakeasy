import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, Pressable, Dimensions, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

interface Suggestion {
  id: number;
  title: string;
}

export default function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
  const router = useRouter();
  const searchBarRef = useRef<View>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchBarPosition, setSearchBarPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.trim().length > 0) {
        try {
          const response = await fetch(`http://localhost:5001/search?q=${encodeURIComponent(value.trim())}`);
          const data = await response.json();
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

  const handleSuggestionPress = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    router.push({
      pathname: `/(stack)/experience/${suggestion.id}`,
      params: { id: suggestion.id },
    });
  };

  const measureSearchBar = () => {
    if (searchBarRef.current) {
      searchBarRef.current.measure((x, y, width, height, pageX, pageY) => {
        setSearchBarPosition({
          x: pageX,
          y: pageY,
          width,
          height
        });
      });
    }
  };

  return (
    <View className="relative">
      <View
        ref={searchBarRef}
        className="flex-row items-center bg-textPrimary/10 rounded-full px-4 py-3 mb-6"
        onLayout={measureSearchBar}
      >
        <TextInput
          className="flex-1 text-textPrimary font-montserrat text-base"
          placeholder="Search experiences..."
          placeholderTextColor="#DCD7C9"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => handleSearch(value)}
          returnKeyType="search"
          onFocus={() => {
            measureSearchBar();
            value.trim().length > 0 && setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <TouchableOpacity onPress={() => handleSearch(value)}>
          <Ionicons name="search" size={24} color="#DCD7C9" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSuggestions && suggestions.length > 0}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuggestions(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setShowSuggestions(false)}
        >
          <View
            style={{
              position: 'absolute',
              top: searchBarPosition.y + searchBarPosition.height,
              left: searchBarPosition.x,
              width: searchBarPosition.width,
              backgroundColor: 'white',
              borderRadius: 12,
              maxHeight: 240,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSuggestionPress(item)}
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f0f0f0',
                  }}
                >
                  <Text style={{ color: '#1A1A1A', fontFamily: 'Montserrat' }}>{item.title}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
