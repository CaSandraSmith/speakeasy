import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable, Text } from 'react-native';
import React, { useEffect } from 'react';
import GetIcon, { IconName } from '../../../assets/icons';


interface TabBarButtonProps {
  isFocused: boolean;
  label: string;
  routeName: string;
  onPress: () => void;
  onLongPress: () => void;
  className?: string;
}

export default function TabBarButton(props: TabBarButtonProps) {
  const { isFocused, label, routeName, onPress, onLongPress, className } = props;
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { damping: 15, stiffness: 150 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    return {
      transform: [{ scale: scaleValue }],
    };
  });

  const color = isFocused ? '#D6BD98' : '#DCD7C9';

  return (
    <Pressable
      className={`items-center justify-center py-2 ${className}`}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Animated.View style={[animatedIconStyle, { marginBottom: 4 }]}>
        {GetIcon(routeName as IconName, { color, size: 24 })}
      </Animated.View>
      <Text
        className={`text-xs ${
          isFocused
            ? 'font-montserrat-bold text-textSecondary'
            : 'font-montserrat text-textPrimary/80'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
