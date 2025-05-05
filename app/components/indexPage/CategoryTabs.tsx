import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryTabs({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryTabsProps) {
  return (
    <View className="mb-6">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category 
                ? 'bg-textSecondary' 
                : 'bg-textPrimary/10'
            }`}
          >
            <Text className={`font-montserrat ${
              selectedCategory === category 
                ? 'text-background' 
                : 'text-textPrimary'
            }`}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
