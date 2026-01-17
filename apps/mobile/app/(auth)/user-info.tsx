import { getUser, registerPushToken, supabase } from "@/shared";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const DEFAULT_VALUES = {
  nickname: "",
  about: "",
};

export default function UserInfoScreen() {
  const params = useLocalSearchParams();
  const { platform, accessToken, refreshToken } = params;

  const { control, watch, getValues } = useForm({
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
        name: user?.user_metadata?.name,
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
          name: user?.user_metadata?.name,
          platform: platform,
        })
        .eq("id", user?.id);
      resultStatus = status;
    }

    if (resultStatus === 201 || resultStatus === 200 || resultStatus === 204) {
      await registerPushToken(user?.id);
      router.replace({
        pathname: "/(tabs)",
        params: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    }
  };

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
                  paddingVertical: 16,
                  fontSize: 18,
                  marginTop: 6,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 6,
                }}
                placeholder="닉네임 입력"
                onChangeText={onChange}
                value={value}
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
                  paddingVertical: 16,
                  fontSize: 18,
                  marginTop: 6,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 6,
                }}
                placeholder="간단한 자기소개 작성"
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />

        <TouchableOpacity
          onPress={createUser}
          style={{
            justifyContent: "center",
            borderRadius: 6,
            backgroundColor:
              watch("nickname") === "" || watch("about") === ""
                ? "#e5e7eb"
                : "#bfdbfe",
          }}
          disabled={watch("nickname") === "" || watch("about") === ""}
        >
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
        </TouchableOpacity>
      </View>
    </>
  );
}
