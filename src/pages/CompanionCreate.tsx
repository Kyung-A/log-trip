import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { CountriesBottomSheet } from "@/features/diary/ui";
import DatePicker from "react-native-date-picker";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "@/entities/auth";
import { IRegion } from "@/shared/types";
import dayjs from "dayjs";
import { PickerIOS } from "@react-native-picker/picker";

export default function CompanionCreateScreen() {
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [formData, setFormData] = useState([]);
  const [isShowTopBar, setShowTopBar] = useState<boolean>(true);

  const [selectedLanguage, setSelectedLanguage] = useState();
  const [resultSelectedCountries, setResultSelectedCountries] = useState<
    IRegion[]
  >([]);

  const [date, setDate] = useState(new Date());
  const [openDateModal, setOpenDateModal] = useState(false);

  const handleOpenPress = useCallback(() => {
    setShowTopBar(false);
    bottomSheetRef.current?.expand();
  }, []);

  const handleChangeFormValues = useCallback((key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const getUserId = useCallback(async () => {
    const { id } = await getUser();
    setFormData((prev) => ({ ...prev, user_id: id }));
  }, []);

  const handleSubmit = async () => {};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable className="pt-1.5" onPress={handleSubmit}>
          <Text className="text-lg text-blue-500 underline">등록</Text>
        </Pressable>
      ),
    });
  }, [formData]);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: isShowTopBar });
  }, [navigation, isShowTopBar]);

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <Pressable
          onPress={handleOpenPress}
          className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
        >
          <Text className="mr-4 text-xl">도시 선택</Text>
          <View className="flex flex-row flex-wrap flex-1 gap-2">
            {resultSelectedCountries.map((v) => (
              <Text
                key={v.region_code}
                className="p-2 rounded bg-[#ebebeb] font-semibold"
              >
                {v.region_name}
              </Text>
            ))}
          </View>
        </Pressable>

        <Pressable className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300">
          <Text className="mr-4 text-xl">동행 수</Text>
          <PickerIOS
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }
          >
            <PickerIOS.Item label="1" value="1" />
            <PickerIOS.Item label="2" value="2" />
          </PickerIOS>
        </Pressable>

        <Pressable
          onPress={() => setOpenDateModal(true)}
          className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
        >
          <Text className="mr-4 text-xl">
            {dayjs(date).format("YYYY-MM-DD") ?? "여행일"}
          </Text>
          <DatePicker
            modal
            mode="date"
            open={openDateModal}
            date={date}
            locale="ko-KR"
            onConfirm={(date) => {
              setOpenDateModal(false);
              setDate(date);
              handleChangeFormValues("travel_date", date);
            }}
            onCancel={() => {
              setOpenDateModal(false);
            }}
          />
        </Pressable>

        <View className="p-4">
          <TextInput
            className="text-xl font-semibold"
            placeholder="제목을 작성해주세요"
            onChangeText={(value) => handleChangeFormValues("title", value)}
          />
          <TextInput
            className="pb-20 mt-4 text-lg"
            placeholder="내용을 작성해주세요"
            multiline={true}
            textAlignVertical="top"
            onChangeText={(value) =>
              handleChangeFormValues("text_content", value)
            }
          />
        </View>
      </ScrollView>

      <CountriesBottomSheet
        bottomSheetRef={bottomSheetRef}
        resultSelectedCountries={resultSelectedCountries}
        setResultSelectedCountries={setResultSelectedCountries}
        handleChangeFormValues={handleChangeFormValues}
        setShowTopBar={setShowTopBar}
      />
    </>
  );
}
