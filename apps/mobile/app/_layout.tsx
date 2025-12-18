import { TabBarProvider } from "@/shared";
import { Stack } from "expo-router";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <TabBarProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="createDiary" />
        <Stack.Screen name="createCompanion" />
      </Stack>
    </TabBarProvider>
  );
}
