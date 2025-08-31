import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiaryCreateScreen from './pages/DiaryCreate';
import ProfileUpdateScreen from './pages/ProfileUpdate';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { Text, TouchableOpacity, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import PhoneAuthScreen from './pages/PhoneAuth';
import LoginScreen from './pages/Login';
import { deleteUser, getUser } from './entities/auth';
import { TabBar } from './shared';
import CompanionCreateScreen from './pages/CompanionCreate';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast, { ErrorToast } from 'react-native-toast-message';
import CompanionDetailScreen from './pages/CompanionDetail';

import './global.css';

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();
const queryClient = new QueryClient();

const toastConfig = {
  error: props => (
    <ErrorToast
      {...props}
      contentContainerStyle={{ paddingHorizontal: 12, height: 40 }}
      style={{
        height: 40,
        backgroundColor: '#e35959',
        borderLeftWidth: 0,
      }}
      text1Style={{
        color: '#fff',
        fontSize: 13,
        fontWeight: 500,
      }}
    />
  ),
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');

  const Stack = createNativeStackNavigator();
  const [isReady, setIsReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    async function prepare() {
      const user = await getUser();
      if (user) {
        setInitialRoute('Home');
      } else {
        setInitialRoute('Login');
      }

      setIsReady(true);
    }
    prepare();
  }, []);

  if (!isReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ActionSheetProvider>
        <GestureHandlerRootView className="flex-1">
          <BottomSheetModalProvider>
            <NavigationContainer>
              <View className="flex-1" onLayout={onLayoutRootView}>
                <Stack.Navigator id={undefined} initialRouteName={initialRoute}>
                  <Stack.Screen
                    name="Home"
                    component={TabBar}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
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
                    name="CompanionCreate"
                    component={CompanionCreateScreen}
                    options={({ navigation }) => ({
                      headerTitle: () => (
                        <Text className="text-lg font-semibold">
                          동행 구하기
                        </Text>
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
                    name="CompanionDetail"
                    component={CompanionDetailScreen}
                    options={({ navigation }) => ({
                      headerTitle: '',
                      headerLeft: () => (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Home', { screen: '동행' })
                          }
                        >
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
                    name="PhoneAuth"
                    component={PhoneAuthScreen}
                    options={({ navigation }) => ({
                      headerTitle: () => (
                        <Text className="text-lg font-semibold">본인인증</Text>
                      ),
                      headerLeft: () => (
                        <TouchableOpacity
                          onPress={async () => {
                            const user = await getUser();
                            if (user) {
                              const response = await deleteUser(user.id);
                              if (response.success) {
                                navigation.goBack();
                              }
                            }
                          }}
                        >
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
                        <Text className="text-lg font-semibold">
                          프로필 수정
                        </Text>
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
                <Toast config={toastConfig} topOffset={70} />
              </View>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </QueryClientProvider>
  );
}
