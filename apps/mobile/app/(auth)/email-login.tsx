import { checkIfUserExists, emailLogin } from "@/shared";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

export default function EmailLoginScreen() {
  const { control, handleSubmit } = useForm();

  const handleLogin = handleSubmit(
    async (formData) => {
      try {
        const { session, user } = await emailLogin(
          formData.email,
          formData.password,
        );
        const isUserExists = await checkIfUserExists(user?.id);

        if (isUserExists) {
          router.replace({
            pathname: "/(tabs)",
            params: {
              accessToken: session?.access_token,
              refreshToken: session?.refresh_token,
            },
          });
        } else {
          router.replace({
            pathname: "/(auth)/user-info",
            params: {
              accessToken: session?.access_token,
              refreshToken: session?.refresh_token,
              platform: "email",
            },
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        if (errorMessage.includes("Invalid login credentials")) {
          Toast.show({
            type: "error",
            text1: "잘못된 이메일 또는 비밀번호 입니다.",
          });
          return;
        }

        if (errorMessage.includes("Email not confirmed")) {
          router.replace({
            pathname: "/auth/callback",
            params: {
              email: formData.email,
            },
          });
          Toast.show({
            type: "error",
            text1: "이메일 인증을 완료해주세요.",
          });
          return;
        }
      }
    },
    (validationError) => {
      Toast.show({
        type: "error",
        text1: Object.values(validationError)[0]?.message as string,
      });
    },
  );

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
        backgroundColor: "#ffffff",
        rowGap: 24,
      }}
    >
      <Controller
        control={control}
        name="email"
        rules={{
          required: "이메일은 필수입니다.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "이메일 형식이 올바르지 않습니다.",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              이메일
            </Text>
            <TextInput
              placeholder="이메일 입력"
              onChangeText={onChange}
              value={value}
              style={{
                paddingHorizontal: 12,
                height: 50,
                fontSize: 16,
                lineHeight: 24,
                marginTop: 6,
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 6,
              }}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: "비밀번호는 필수입니다.",
        }}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              비밀번호
            </Text>
            <TextInput
              placeholder="비밀번호 입력"
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              style={{
                paddingHorizontal: 12,
                height: 50,
                fontSize: 16,
                lineHeight: 24,
                marginTop: 6,
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 6,
              }}
            />
          </View>
        )}
      />

      <Pressable
        onPress={handleLogin}
        style={{
          justifyContent: "center",
          backgroundColor: "#bfdbfe",
          borderRadius: 6,
        }}
      >
        <Text
          style={{
            paddingVertical: 18,
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
            color: "#3b82f6",
          }}
        >
          로그인
        </Text>
      </Pressable>

      <TouchableOpacity onPress={() => router.push("/(auth)/email-signup")}>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            textDecorationLine: "underline",
          }}
        >
          이메일로 회원가입
        </Text>
      </TouchableOpacity>
    </View>
  );
}
