import React from "react";
import { TabBar } from "./components";
import { NavigationContainer } from "@react-navigation/native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import "./global.css";

export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <TabBar />
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
