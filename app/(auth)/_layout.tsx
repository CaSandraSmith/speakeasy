import { useUser } from "../../context/userContext";
import { Redirect } from "expo-router";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const { user } = useUser();

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen name="passcode" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}
