import { getUser, supabase } from "@/shared";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  AppState,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";

const DEFAULT_VALUES = {
  nickname: "",
  about: "",
};

export default function UserInfoScreen() {
  const appState = useRef(AppState.currentState);
  const params = useLocalSearchParams();
  const { platform, accessToken, refreshToken } = params;

  const {
    control,
    watch,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const createUser = async () => {
    const user = await getUser();
    const formData = getValues();
    let resultStatus = 0;

    if (platform !== "apple") {
      const { status } = await supabase.from("users").insert({
        id: user?.id,
        email: user?.email,
        nickname: formData.nickname,
        about: formData.about,
        platform: platform,
      });
      resultStatus = status;
    } else {
      const { status } = await supabase
        .from("users")
        .update({
          email: user?.email,
          nickname: formData.nickname,
          about: formData.about,
          platform: platform,
        })
        .eq("id", user?.id);
      resultStatus = status;
    }

    if (resultStatus === 201 || resultStatus === 200 || resultStatus === 204) {
      // ! 알림 권한 추후에 추가
      // await registerPushToken(user?.id); !
      router.replace({
        pathname: "/(tabs)",
        params: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/active|foreground/) &&
          nextAppState === "background"
        ) {
          // * 앱이 백그라운드 모드로 들어가면 세션 삭제
          await supabase.auth.signOut();
          router.replace("/(auth)/login");
        }
        appState.current = nextAppState;
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <>
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
          name="nickname"
          rules={{
            required: "닉네임은 필수입니다.",
          }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>닉네임</Text>
              <TextInput
                style={{
                  paddingHorizontal: 12,
                  height: 50,
                  fontSize: 18,
                  marginTop: 6,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 6,
                }}
                placeholder="닉네임 입력"
                onChangeText={onChange}
                value={value}
                maxLength={10}
              />
            </View>
          )}
        />
        <Controller
          control={control}
          name="about"
          rules={{
            required: "자기소개는 필수입니다.",
          }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>자기소개</Text>
              <TextInput
                style={{
                  paddingHorizontal: 12,
                  height: 50,
                  fontSize: 18,
                  marginTop: 6,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 6,
                }}
                placeholder="간단한 자기소개 작성"
                onChangeText={onChange}
                value={value}
                maxLength={30}
              />
            </View>
          )}
        />

        <Pressable
          onPress={createUser}
          style={{
            justifyContent: "center",
            borderRadius: 6,
            backgroundColor:
              watch("nickname") === "" || watch("about") === "" || isSubmitting
                ? "#e5e7eb"
                : "#bfdbfe",
          }}
          disabled={
            watch("nickname") === "" || watch("about") === "" || isSubmitting
          }
        >
          {isSubmitting ? (
            <ActivityIndicator
              style={{ paddingVertical: 17 }}
              size="small"
              color="#4b5563"
            />
          ) : (
            <Text
              style={{
                paddingVertical: 18,
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
                color:
                  watch("nickname") === "" || watch("about") === ""
                    ? "#9ca3af"
                    : "#3b82f6",
              }}
            >
              완료
            </Text>
          )}
        </Pressable>
      </View>
    </>
  );
}
