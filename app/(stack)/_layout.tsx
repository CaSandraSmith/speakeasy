import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="experience/index" 
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="experience/[id]" 
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
