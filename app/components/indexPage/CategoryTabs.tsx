import { Tag } from '@/app/types';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface CategoryTabsProps {
  categories: Tag[];
  selectedCategory: Tag | null;
  onSelectCategory: (category: Tag) => void;
}

export default function CategoryTabs({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryTabsProps) {
  if (!selectedCategory) return
  return (
    <View className="mb-6">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory.id === category.id 
                ? 'bg-textSecondary' 
                : 'bg-textPrimary/10'
            }`}
          >
            <Text className={`font-montserrat ${
              selectedCategory.id === category.id 
                ? 'text-background' 
                : 'text-textPrimary'
            }`}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
