import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Header() {
  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center mt-4 mb-6">
      <Text 
        className="text-textPrimary font-montserrat-bold text-3xl"
        style={{
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2
        }}
      >
        Let's Discover
      </Text>
      
      <TouchableOpacity 
        onPress={() => router.push('/profile')}
        className="bg-background/20 rounded-full w-12 h-12 items-center justify-center"
      >
        <Text className="text-textPrimary font-montserrat-medium text-sm">
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
