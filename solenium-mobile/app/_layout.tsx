import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Minimalist view, no default headers
          animation: 'fade', // Smooth transitions
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="camera" 
          options={{
            presentation: 'modal', // Camera opens as a full-screen modal
          }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{
            presentation: 'modal', 
          }} 
        />
        <Stack.Screen 
          name="evidence" 
          options={{
            presentation: 'modal', 
          }} 
        />
        <Stack.Screen 
          name="registry_detail" 
          options={{
            presentation: 'modal', 
          }} 
        />
        <Stack.Screen 
          name="switch_account" 
          options={{
            headerShown: false,
          }} 
        />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
