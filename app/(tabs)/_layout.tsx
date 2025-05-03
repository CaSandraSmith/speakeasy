import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "../../context/userContext";
import { Redirect } from "expo-router";
import { COLORS } from '../constants/colors';
import TabBar from "../components/tabsNavigation/TabBar";

export default function TabLayout() {
  const { user } = useUser();
  
  if (!user) {
    return <Redirect href="/passcode" />;
  }
  
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home"
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore"
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile"
        }}
      />
    </Tabs>
  );
}
