import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  Extrapolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width, height } = Dimensions.get('window');

interface Destination {
  id: string;
  name: string;
  image: any;
}

interface BackdropPhotoProps {
  destination: Destination;
  index: number;
  scrollX: SharedValue<number>;
}

export default function BackdropPhoto({ destination, index, scrollX }: BackdropPhotoProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.Image
      source={{ uri: destination.image }}
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: "#000", // fallback during transition
        },
        animatedStyle,
      ]}
      resizeMode="cover"
      blurRadius={15}
    />
  );
}
