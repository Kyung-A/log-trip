import React from "react";
import { TabBar } from "./components";
import { NavigationContainer } from "@react-navigation/native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DiaryCreateScreen from "./pages/DiaryCreate";

import "./global.css";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <ActionSheetProvider>
      <GestureHandlerRootView className="flex-1">
        <BottomSheetModalProvider>
          <NavigationContainer>
            <Stack.Navigator id={undefined}>
              <Stack.Screen
                name="Home"
                component={TabBar}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="DiaryCreate" component={DiaryCreateScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ActionSheetProvider>
  );
}
