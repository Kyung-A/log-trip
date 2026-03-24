import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="email-login"
        options={{
          title: "로그인",
          headerBackTitle: "뒤로",
        }}
      />
      <Stack.Screen
        name="email-signup"
        options={{
          title: "회원가입",
          headerBackTitle: "뒤로",
        }}
      />
      <Stack.Screen
        name="user-info"
        options={{
          title: "프로필 입력",
          headerBackTitle: "",
          headerLeft: () => null,
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
