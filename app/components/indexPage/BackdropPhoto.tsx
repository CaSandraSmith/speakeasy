import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

const { width, height } = Dimensions.get('window');

interface Destination {
  id: string;
  name: string;
  image: any;
  rating?: number;
  reviews?: number;
}

interface BackdropPhotoProps {
  destination: Destination;
  index: number;
  scrollX: SharedValue<number>;
}

export default function BackdropPhoto({ destination, index, scrollX }: BackdropPhotoProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0, 1, 0]
      )
    }
  });
  
  return (
    <Animated.Image 
      source={destination.image} 
      style={[StyleSheet.absoluteFillObject, stylez]}
      resizeMode="cover" // This ensures the image covers the full screen
      blurRadius={15}
    />
  );
}
