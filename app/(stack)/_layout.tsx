import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="experience" 
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
