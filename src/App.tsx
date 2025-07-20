import React, { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { TabBar } from "./components";
import { NavigationContainer } from "@react-navigation/native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DiaryCreateScreen from "./pages/DiaryCreate";
import ProfileUpdateScreen from "./pages/ProfileUpdate";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { Text, TouchableOpacity, View } from "react-native";

import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const Stack = createNativeStackNavigator();
  const [isReady, setIsReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsReady(true);
    }
    prepare();
  }, []);

  if (!isReady) return null;

  return (
    <ActionSheetProvider>
      <GestureHandlerRootView className="flex-1">
        <BottomSheetModalProvider>
          <NavigationContainer>
            <View className="flex-1" onLayout={onLayoutRootView}>
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
            </View>
          </NavigationContainer>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ActionSheetProvider>
  );
}
