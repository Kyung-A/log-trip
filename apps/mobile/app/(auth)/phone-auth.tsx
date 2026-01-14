import { getUser, registerPushToken, supabase } from "@/shared";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";

const DEFAULT_VALUES = {
  nickname: "",
  year_of_birth: "",
  gender: "",
  mobileCarrier: "",
  phone: "",
};

export default function PhoneAuthScreen() {
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
        name: user?.user_metadata?.name
          ? user?.user_metadata?.name
          : formData.nickname,
        year_of_birth: formData.year_of_birth,
        gender: formData.gender,
        platform: platform,
      });
      resultStatus = status;
    } else {
      const { status } = await supabase
        .from("users")
        .update({
          email: user?.email,
          nickname: formData.nickname,
          name: user?.user_metadata?.name
            ? user?.user_metadata?.name
            : formData.nickname,
          year_of_birth: formData.year_of_birth,
          gender: formData.gender,
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
                  lineHeight: 24,
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

        <View>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>성별</Text>
          <Controller
            control={control}
            name="gender"
            rules={{
              required: "성별은 필수입니다.",
            }}
            render={({ field: { onChange, value } }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 24,
                  marginTop: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (!value || value === "M") {
                      onChange("F");
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 6,
                  }}
                >
                  {value === "F" ? (
                    <Ionicons name="checkbox" size={26} color="#000" />
                  ) : (
                    <Ionicons name="checkbox-outline" size={26} color="#ccc" />
                  )}
                  <Text style={{ fontSize: 18 }}>여성</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!value || value === "F") {
                      onChange("M");
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 6,
                  }}
                >
                  {value === "M" ? (
                    <Ionicons name="checkbox" size={26} color="#000" />
                  ) : (
                    <Ionicons name="checkbox-outline" size={26} color="#ccc" />
                  )}
                  <Text style={{ fontSize: 18 }}>남성</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>태어난 연도</Text>
          <Controller
            control={control}
            name="year_of_birth"
            rules={{
              required: "태어난 연도는 필수입니다.",
            }}
            render={({ field: { onChange, value } }) => {
              const curYear = dayjs().get("year");
              const minYear = 1900;
              const maxYear = curYear - 18;

              const years = [];
              for (let y = maxYear; y >= minYear; y--) {
                years.push(y);
              }

              return (
                <View style={{ width: "100%" }}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={{ height: 180 }}
                  >
                    {years?.map((year) => (
                      <Picker.Item key={year} label={`${year}`} value={year} />
                    ))}
                  </Picker>
                </View>
              );
            }}
          />
        </View>

        <TouchableOpacity
          onPress={createUser}
          style={{
            justifyContent: "center",
            borderRadius: 6,
            backgroundColor:
              watch("nickname") === "" ||
              watch("year_of_birth") === "" ||
              watch("gender") === ""
                ? "#e5e7eb"
                : "#bfdbfe",
          }}
          disabled={
            watch("nickname") === "" ||
            watch("year_of_birth") === "" ||
            watch("gender") === ""
          }
        >
          <Text
            style={{
              paddingVertical: 18,
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
              color:
                watch("nickname") === "" ||
                watch("year_of_birth") === "" ||
                watch("gender") === ""
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
