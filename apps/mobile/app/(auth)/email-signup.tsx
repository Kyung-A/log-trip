import { supabase, useEmailSignUp } from "@/shared";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Linking,
  Alert,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";

// TODO: 현재 이메일 인증 하기도 전에 회원 가입이 먼저됨, 이메일의 링크를 클릭했을대 회원가입 되게 변경
export default function EmailSignUpScreen() {
  const { control, handleSubmit, getValues } = useForm();
  const signUp = useEmailSignUp();

  const [selected, setSelected] = useState<boolean>(false);
  const [duplicateCheck, setDuplicateCheck] = useState<boolean>(false);

  const handleDuplicateCheck = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("email", getValues("email"))
        .single();

      if (data) {
        Toast.show({
          type: "error",
          text1: "이미 존재하는 이메일입니다.",
        });
        return;
      }

      setDuplicateCheck(true);
    } catch (error) {
      console.error(error);
    }
  }, [getValues]);

  const handleLogin = handleSubmit(
    async (formData) => {
      if (!duplicateCheck) {
        Toast.show({
          type: "error",
          text1: "이메일 중복 체크는 필수입니다.",
        });
        return;
      }

      if (!selected) {
        Toast.show({
          type: "error",
          text1: "개인정보보호 및 이용약관 동의는 필수입니다.",
        });
        return;
      }

      await signUp(formData.email, formData.password);
    },
    (error) => {
      Toast.show({
        type: "error",
        text1: Object.values(error)[0].message as string,
      });
    }
  );

  const openExternal = useCallback(async () => {
    try {
      await Linking.openURL(
        "https://useful-shield-356.notion.site/2636f7963e8d80f994c6c32a77d53e6a"
      );
    } catch (e) {
      Alert.alert("링크 열기에 실패했어요.", String(e));
    }
  }, []);

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
      {/* 이메일 */}
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

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
                justifyContent: "space-between",
                columnGap: 8,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 16,
                  fontSize: 18,
                  lineHeight: 24,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 6,
                }}
                placeholder="이메일 입력"
                onChangeText={onChange}
                value={value}
              />

              <Pressable
                onPress={handleDuplicateCheck}
                disabled={duplicateCheck}
                style={{
                  justifyContent: "center",
                  borderWidth: 1,
                  borderRadius: 6,
                  borderColor: duplicateCheck ? "#e5e7eb" : "#3b82f6",
                  backgroundColor: duplicateCheck ? "#e5e7eb" : "transparent",
                }}
              >
                <Text
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 17,
                    fontWeight: "600",
                    textAlign: "center",
                    fontSize: 16,
                    color: duplicateCheck ? "#9ca3af" : "#3b82f6",
                  }}
                >
                  중복 확인
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* 비밀번호 */}
      <Controller
        control={control}
        name="password"
        rules={{
          required: "비밀번호는 필수입니다.",
          minLength: { value: 6, message: "6자 이상 입력해주세요." },
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
              placeholder="비밀번호 입력"
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          </View>
        )}
      />

      {/* 비밀번호 확인 */}
      <Controller
        control={control}
        name="password2"
        rules={{
          required: "비밀번호 확인은 필수입니다.",
          validate: (v) =>
            v === getValues("password") || "비밀번호가 서로 일치하지 않습니다.",
        }}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              비밀번호 확인
            </Text>

            <TextInput
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
              placeholder="비밀번호 확인 입력"
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          </View>
        )}
      />

      {/* 약관 동의 */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 8,
        }}
      >
        <Pressable onPress={openExternal}>
          <Text
            style={{
              fontSize: 16,
              color: "#4b5563",
            }}
          >
            개인정보보호 및 이용약관 동의 (필수)
          </Text>
        </Pressable>
        <TouchableOpacity onPress={() => setSelected((prev) => !prev)}>
          {selected ? (
            <Ionicons name="checkbox" size={26} color="#000" />
          ) : (
            <Ionicons name="checkbox-outline" size={26} color="#ccc" />
          )}
        </TouchableOpacity>
      </View>

      {/* 회원가입 버튼 */}
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
          회원가입
        </Text>
      </Pressable>
    </View>
  );
}
