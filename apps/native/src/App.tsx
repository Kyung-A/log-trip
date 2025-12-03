import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiaryCreateScreen from './pages/DiaryCreate';
import ProfileUpdateScreen from './pages/ProfileUpdate';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { Text, TouchableOpacity, View } from 'react-native';
import PhoneAuthScreen from './pages/PhoneAuth';
import LoginScreen from './pages/Login';
import { getUser, getUserProfile } from './entities/auth';
import { supabase, TabBar } from './shared';
import CompanionCreateScreen from './pages/CompanionCreate';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast, { ErrorToast, SuccessToast } from 'react-native-toast-message';
import CompanionDetailScreen from './pages/CompanionDetail';
import CompanionUpdateScreen from './pages/CompanionUpdate';
import ApplyStatusScreen from './pages/ApplyStatus';
import RecruitStatusScreen from './pages/RecruitStatus';
import EmailLoginScreen from './pages/EmailLogin';
import EmailSignUpScreen from './pages/EmailSignUp';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const toastConfig = {
  error: props => (
    <ErrorToast
      {...props}
      contentContainerStyle={{ paddingHorizontal: 12, height: 40 }}
      style={{
        height: 40,
        backgroundColor: '#ecc8c4',
        borderLeftColor: '#a43336',
      }}
      text1Style={{
        color: '#a43336',
        fontSize: 13,
        fontWeight: 500,
      }}
    />
  ),
  success: props => (
    <SuccessToast
      {...props}
      contentContainerStyle={{ paddingHorizontal: 12, height: 40 }}
      style={{
        height: 40,
        backgroundColor: '#def3d6',
        borderLeftColor: '#596e50',
      }}
      text1Style={{
        color: '#596e50',
        fontSize: 13,
        fontWeight: 500,
      }}
    />
  ),
};

const MoveBackButton = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <FontAwesome6 name="arrow-left" size={20} color="#646464" />
    </TouchableOpacity>
  );
};

const navRef = createNavigationContainerRef();

async function createSessionFromUrl(url: string) {
  const { params } = QueryParams.getQueryParams(url);
  const access_token = (params as any)?.access_token as string | undefined;
  const refresh_token = (params as any)?.refresh_token as string | undefined;
  if (!access_token || !refresh_token) return;

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) {
    console.error('setSession error:', error.message);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.email_confirmed_at && navRef.isReady()) {
    navRef.reset({ index: 0, routes: [{ name: 'PhoneAuth' }] });
  }
}

function useSupabaseEmailLinking() {
  const handled = useRef<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl && !handled.current.has(initialUrl)) {
        handled.current.add(initialUrl);
        await createSessionFromUrl(initialUrl);
      }
    })();

    const sub = Linking.addEventListener('url', async ({ url }) => {
      if (!handled.current.has(url)) {
        handled.current.add(url);
        await createSessionFromUrl(url);
      }
    });

    return () => sub.remove();
  }, []);
}

export default function App() {
  useSupabaseEmailLinking();
  const Stack = createNativeStackNavigator();

  const [initialRoute, setInitialRoute] = useState<string>('Login');
  const [isReady, setIsReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    async function prepare() {
      const user = await getUser();
      const profile = await getUserProfile(user?.id);

      if (user && profile) {
        setInitialRoute('Home');
      } else if (user && !profile) {
        setInitialRoute('Login');
      } else {
        setInitialRoute('Login');
      }

      setIsReady(true);
    }
    prepare();
  }, []);

  // console.log(isReady);
  if (!isReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <NavigationContainer ref={navRef}>
              <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                {/* <Stack.Navigator id={undefined} initialRouteName={initialRoute}>
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
                    name="EmailLogin"
                    component={EmailLoginScreen}
                    options={({ navigation }) => ({
                      headerTitle: () => (
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                          이메일 로그인
                        </Text>
                      ),
                      headerLeft: () => (
                        <MoveBackButton navigation={navigation} />
                      ),
                    })}
                  />
                  <Stack.Screen
                    name="EmailSignUp"
                    component={EmailSignUpScreen}
                    options={({ navigation }) => ({
                      headerTitle: () => (
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                          회원가입
                        </Text>
                      ),
                      headerLeft: () => (
                        <MoveBackButton navigation={navigation} />
                      ),
                    })}
                  />
                  <Stack.Screen
                    name="DiaryCreate"
                    component={DiaryCreateScreen}
                    options={({ navigation }) => ({
                      headerTitle: () => (
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                          일기 작성
                        </Text>
                      ),
                      headerLeft: () => (
                        <MoveBackButton navigation={navigation} />
                      ),
                    })}
                  />
                  <Stack.Screen
                    name="CompanionCreate"
                    component={CompanionCreateScreen}
                    options={({ navigation }) => ({
                      headerTitle: () => (
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                          동행 구하기
                        </Text>
                      ),
                      headerLeft: () => (
                        <MoveBackButton navigation={navigation} />
                      ),
                    })}
                  />
                  <Stack.Screen
                    name="CompanionUpdate"
                    component={CompanionUpdateScreen}
                    options={({ navigation }) => ({
                      headerTitle: () => (
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                          동행 글 수정하기
                        </Text>
                      ),
                      headerLeft: () => (
                        <MoveBackButton navigation={navigation} />
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
                    options={() => ({
                      headerTitle: () => (
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                          추가정보
                        </Text>
                      ),
                      headerLeft: () => '',
                    })}
                  />
                  <Stack.Screen
                    name="ProfileUpdate"
                    component={ProfileUpdateScreen}
                    options={({ navigation }) => ({
                      headerTitle: () => (
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                          프로필 수정
                        </Text>
                      ),
                      headerLeft: () => (
                        <MoveBackButton navigation={navigation} />
                      ),
                    })}
                  />
                  <Stack.Screen
                    name="ApplyStatus"
                    component={ApplyStatusScreen}
                    options={({ navigation }) => ({
                      headerTitle: () => (
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                          나의 동행 신청 현황
                        </Text>
                      ),
                      headerLeft: () => (
                        <MoveBackButton navigation={navigation} />
                      ),
                    })}
                  />
                  <Stack.Screen
                    name="RecruitStatus"
                    component={RecruitStatusScreen}
                    options={({ navigation }) => ({
                      headerTitle: () => (
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                          나의 동행 모집 현황
                        </Text>
                      ),
                      headerLeft: () => (
                        <MoveBackButton navigation={navigation} />
                      ),
                    })}
                  />
                </Stack.Navigator> */}
                <Toast config={toastConfig} topOffset={70} />
              </View>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </QueryClientProvider>
  );
}
