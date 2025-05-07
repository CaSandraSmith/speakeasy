import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { Experience } from '@/app/types';

const {width} = Dimensions.get("screen");
const _imageWidth = Platform.select({
  web: Math.min(width * 0.4, 400), // Limit max width on web
  default: width * 0.7
});
const _imageHeight = _imageWidth * 1.7; 

interface DestinationCardProps {
  destination: Experience;
  index: number;
  scrollX: SharedValue<number>;
  onPress: () => void;
}

export default function DestinationCard({ destination, index, scrollX, onPress }: DestinationCardProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [index-1, index, index+1],
            [1.6, 1, 1.6]
          ),
        },
        {
          rotate: `${interpolate(
            scrollX.value,
            [index-1, index, index+1],
            [15, 0, -15]
          )}deg`
        }
      ]
    }
  });
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        width: _imageWidth,
        height: _imageHeight,
        borderRadius: 16,
        overflow: "hidden",
      }}
      activeOpacity={0.9}
    >
      <Animated.Image
        source={{uri: destination.images?.[0].image_url}}
        style={[{ width: '100%', height: '100%' }, stylez]}
        resizeMode="cover"
      />
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
      }} 
      className="bg-gradient-to-t from-black/80 to-transparent"
      >
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={20} color="#DCD7C9" />
          <Text className="text-textPrimary font-montserrat-bold text-lg ml-2">
            {destination.title}
          </Text>
        </View>
        {destination.average_rating && (
          <View className="flex-row items-center mt-1">
            <Ionicons name="star" size={16} color="#D6BD98" />
            <Text className="text-textSecondary font-montserrat ml-1">
              {destination.average_rating} ({destination.reviews?.length} reviews)
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
