import React from "react";
import { TabBar } from "./components";
import { NavigationContainer } from "@react-navigation/native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DiaryCreateScreen from "./pages/DiaryCreate";
import ProfileUpdateScreen from "./pages/ProfileUpdate";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { Text, TouchableOpacity } from "react-native";

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
              <Stack.Screen
                name="DiaryCreate"
                component={DiaryCreateScreen}
                options={({ navigation }) => ({
                  headerTitle: () => (
                    <Text className="text-lg font-semibold">일기 작성</Text>
                  ),
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <FontAwesome6
                        name="arrow-left"
                        size={20}
                        color="#646464"
                      />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="ProfileUpdate"
                component={ProfileUpdateScreen}
                options={({ navigation }) => ({
                  headerTitle: () => (
                    <Text className="text-lg font-semibold">프로필 수정</Text>
                  ),
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <FontAwesome6
                        name="arrow-left"
                        size={20}
                        color="#646464"
                      />
                    </TouchableOpacity>
                  ),
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ActionSheetProvider>
  );
}
