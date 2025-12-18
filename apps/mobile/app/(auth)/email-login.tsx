import { resendEmail, useEmailLogin } from "@/shared";
import { router } from "expo-router";
import { useCallback, useState } from "react";
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
  const [resendMail, setResendMail] = useState<boolean>(false);
  const { control, handleSubmit, getValues } = useForm();
  const login = useEmailLogin();

  const handleResendMail = useCallback(async () => {
    const email = getValues("email");
    await resendEmail(email);

    Toast.show({
      type: "success",
      text1: "메일을 확인해주세요.",
    });
  }, [getValues]);

  const handleLogin = handleSubmit(
    async (formData) => {
      const result = await login(formData.email, formData.password);

      if (result?.includes("Invalid login credentials")) {
        Toast.show({
          type: "error",
          text1: "잘못된 이메일 또는 비밀번호 입니다.",
        });
        return;
      }

      if (result?.includes("Email not confirmed")) {
        Toast.show({
          type: "error",
          text1: "이메일 인증을 완료해주세요.",
        });
        setResendMail(true);
        return;
      }
    },
    (error) => {
      Toast.show({
        type: "error",
        text1: Object.values(error)[0].message as string,
      });
    }
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
                fontSize: 18,
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
                paddingVertical: 16,
                fontSize: 18,
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
                fontSize: 18,
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
                paddingVertical: 16,
                fontSize: 18,
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

      {resendMail && (
        <View
          style={{
            paddingVertical: 8,
            marginHorizontal: "auto",
            alignItems: "center",
          }}
        >
          <Text>인증 메일 다시 보내기</Text>
          <TouchableOpacity onPress={handleResendMail} style={{ marginTop: 8 }}>
            <Text
              style={{
                paddingVertical: 8,
                fontWeight: "600",
                textAlign: "center",
                color: "#ea580c",
              }}
            >
              메일 재전송
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
            fontSize: 18,
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
