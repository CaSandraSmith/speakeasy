import { useUser } from "../../context/userContext";
import { Redirect } from "expo-router";
import { Stack } from "expo-router";

export default function AppLayout() {
  const { user } = useUser();

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen name="showExperience" options={{ headerShown: false }} />
    </Stack>
  );
}
