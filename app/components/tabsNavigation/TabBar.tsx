import { View } from 'react-native';
import React from 'react';
import TabBarButton from './TabBarButton';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 pb-6 px-0" style={{ backgroundColor: 'transparent' }}>
      <View className="flex-row justify-around items-center mx-5 py-3 px-3 rounded-full shadow-lg border border-textPrimary/10" 
        style={{ backgroundColor: 'rgba(26, 54, 54, 0.7)' }} // Semi-transparent background
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          
          // Rest of your existing code...
          let label: string;
          if (typeof options.tabBarLabel === 'function') {
            const labelComponent = options.tabBarLabel({
              focused: state.index === index,
              color: state.index === index ? '#D6BD98' : '#DCD7C9',
              position: 'below-icon',
              children: route.name
            });
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
