import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "../../context/userContext";
import { Redirect } from "expo-router";
import { COLORS } from '../constants/colors';

export default function TabLayout() {
  const { user } = useUser();
  
  if (!user) {
    return <Redirect href="/passcode" />;
  }
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the default header
        tabBarActiveTintColor: COLORS.secondaryText,
        tabBarInactiveTintColor: COLORS.primaryText,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 5,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name="home" 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name="navigate" 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name="document-text" 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name="heart" 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
