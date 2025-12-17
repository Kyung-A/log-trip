import { TabBarProvider } from "@/shared";
import { Stack } from "expo-router";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <TabBarProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="createDiary" options={{ headerShown: false }} />
        <Stack.Screen name="createCompanion" options={{ headerShown: false }} />
      </Stack>
    </TabBarProvider>
  );
}
