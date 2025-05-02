import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ShowExperience() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Experience ID: {id}</Text>
      {/* Use experienceId to fetch or render experience details */}
    </View>
  );
}
