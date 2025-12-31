import { getUser, registerPushToken, supabase } from "@/shared";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";

const OPTIONS = [
  "SKT",
  "KT",
  "LG U+",
  "SKT 알뜰폰",
  "KT 알뜰폰",
  "LG U+ 알뜰폰",
];

const DEFAULT_VALUES = {
  nickname: "",
  year_of_birth: "",
  gender: "",
  mobileCarrier: "",
  phone: "",
};

// TODO: 주석처리 한 부분은 추후 추가예정
export default function PhoneAuthScreen() {
  // const [selected, setSelected] = useState<string | null>(null);
  // const [visible, setVisible] = useState(false);
  // const [timeLeft, setTimeLeft] = useState<number>(0);
  // const [errorVerifyCode, setErrorVerifyCode] = useState<boolean>(false);

  const params = useLocalSearchParams();
  const { platform, accessToken, refreshToken } = params;

  const { control, watch, getValues } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const createUser = async () => {
    const user = await getUser();
    const formData = getValues();

    await supabase.from("users").insert({
      id: user?.id,
      email: user?.email,
      nickname: formData.nickname,
      name: user?.user_metadata?.name ?? formData.nickname,
      year_of_birth: formData.year_of_birth,
      gender: formData.gender,
      platform: platform,
      // phone: formData.phone,
      // mobile_carrier: formData.mobileCarrier,
    });

    await registerPushToken(user?.id);
    router.replace({
      pathname: "/(tabs)",
      params: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  };

  // const handleSendSMS = handleSubmit(
  //   async formData => {
  //     if (formData.phone.length !== 11) {
  //       Toast.show({
  //         type: 'error',
  //         text1: '올바른 휴대폰 번호가 아닙니다.',
  //       });
  //       return;
  //     }
  //     if (!formData.mobileCarrier) {
  //       Toast.show({
  //         type: 'error',
  //         text1: '이동통신사 선액은 필수입니다.',
  //       });
  //       return;
  //     }

  //     const result = await sendSMS(formData.phone);
  //     if (result.statusCode === '2000') {
  //       setTimeLeft(180);
  //     }
  //   },
  //   error => {
  //     Toast.show({
  //       type: 'error',
  //       text1: Object.values(error)[0].message as string,
  //     });
  //   },
  // );

  // const handleVerifyCode = useCallback(async (code: string) => {
  //   const phone = getValues('phone');

  //   const reislt = await verifyCode({ phone: phone, code: code });

  //   if (reislt.status === 200) {
  //     return await createUser();
  //   } else {
  //     setErrorVerifyCode(true);
  //   }
  // }, []);

  // const onSelect = useCallback((option: string) => {
  //   setSelected(option);
  //   setValue('mobileCarrier', option);
  //   setVisible(false);
  // }, []);

  // const minutes = Math.floor(timeLeft / 60);
  // const seconds = timeLeft % 60;

  // useEffect(() => {
  //   if (timeLeft <= 0) return;

  //   const interval = setInterval(() => {
  //     setTimeLeft(prev => prev - 1);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [timeLeft]);

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
                // editable={timeLeft <= 0}
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

        {/* <View>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>휴대폰 번호</Text>
        <Pressable
          onPress={() => setVisible(true)}
          style={{
            width: "100%",
            paddingHorizontal: 12,
            paddingVertical: 16,
            fontSize: 18,
            lineHeight: 24,
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 6,
            marginTop: 6,
          }}
          disabled={timeLeft > 0}
        >
          <Text style={{ color: selected ? "#000" : "#999" }}>
            {selected || "통신사 선택"}
          </Text>
        </Pressable>

        <View
          style={{
            marginTop: 6,
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between",
            columnGap: 8,
          }}
        >
          <Controller
            control={control}
            name="phone"
            rules={{
              required: "휴대폰 번호는 필수입니다.",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={{
                  flex: 2,
                  paddingHorizontal: 12,
                  paddingVertical: 16,
                  fontSize: 18,
                  lineHeight: 24,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 6,
                }}
                placeholder="'-'빼고 휴대폰 번호 입력"
                onChangeText={onChange}
                value={value}
                editable={timeLeft <= 0}
              />
            )}
          />

          <Pressable
            onPress={handleSendSMS}
            style={{
              flex: 1,
              justifyContent: "center",
              borderRadius: 6,
              backgroundColor:
                timeLeft > 0 || Object.values(watch()).some(v => v === "")
                  ? "#d1d5db"
                  : "#bfdbfe",
            }}
            disabled={
              timeLeft > 0 || Object.values(watch()).some(v => v === "")
            }
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 18,
                textAlign: "center",
                color:
                  timeLeft > 0 || Object.values(watch()).some(v => v === "")
                    ? "#9ca3af"
                    : "#3b82f6",
              }}
            >
              인증하기
            </Text>
          </Pressable>
        </View>
      </View> */}

        {/* {timeLeft > 0 && (
        <View>
          <Text
            style={{
              marginBottom: 4,
              fontWeight: "600",
              color: "#ef4444",
            }}
          >
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </Text>
          <TextInput
            style={{
              paddingHorizontal: 12,
              paddingVertical: 16,
              fontSize: 18,
              lineHeight: 24,
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 6,
            }}
            placeholder="인증번호 4자리 입력"
            onChangeText={value => {
              setErrorVerifyCode(false);
              if (value.length === 6) {
                handleVerifyCode(value);
              }
            }}
            maxLength={6}
          />
          {errorVerifyCode && (
            <Text
              style={{
                marginBottom: 4,
                fontWeight: "600",
                color: "#ef4444",
              }}
            >
              인증번호가 일치하지 않습니다
            </Text>
          )}
        </View>
      )} */}
      </View>

      {/* <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.46)",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => setVisible(false)}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
            width: 320,
          }}
        >
          <FlatList
            data={OPTIONS}
            keyExtractor={item => item}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => onSelect(item)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: index === 5 ? 0 : 1,
                  borderColor: "#d1d5db",
                }}
              >
                <Text style={{ fontSize: 18 }}>{item}</Text>
              </Pressable>
            )}
          />
        </View>
      </Pressable>
    </Modal> */}
    </>
  );
}
