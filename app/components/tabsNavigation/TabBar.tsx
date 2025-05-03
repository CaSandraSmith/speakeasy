import { View } from 'react-native';
import React from 'react';
import TabBarButton from './TabBarButton';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-transparent pb-6 px-0">
      <View className="flex-row justify-around items-center bg-background/95 mx-5 py-3 px-3 rounded-full shadow-lg border border-textPrimary/10">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          
          // Handle label properly accounting for function type
          let label: string;
          if (typeof options.tabBarLabel === 'function') {
            // Call the function with appropriate props
            const labelComponent = options.tabBarLabel({
              focused: state.index === index,
              color: state.index === index ? '#D6BD98' : '#DCD7C9',
              position: 'below-icon',
              children: route.name
            });
            // Extract string from the component if possible
            label = typeof labelComponent === 'string' ? labelComponent : route.name;
          } else if (typeof options.tabBarLabel === 'string') {
            label = options.tabBarLabel;
          } else if (options.title !== undefined) {
            label = options.title;
          } else {
            label = route.name;
          }

          if(['_sitemap', '+not-found'].includes(route.name)) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.name}
              className="flex-1"
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              label={label}
            />
          );
        })}
      </View>
    </View>
  );
}
