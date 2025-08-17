import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { CountriesBottomSheet } from "@/features/diary/ui";
import DatePicker from "react-native-date-picker";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "@/entities/auth";
import { IRegion } from "@/shared/types";
import dayjs from "dayjs";
import { PickerIOS } from "@react-native-picker/picker";

const SNAP_POINTS = ["30%"];

export default function CompanionCreateScreen() {
  const navigation = useNavigation();
  const citiesBottomSheet = useRef<BottomSheet>(null);
  const numberBottomSheet = useRef<BottomSheet>(null);

  const [formData, setFormData] = useState([]);
  const [isShowTopBar, setShowTopBar] = useState<boolean>(true);

  const [selectedLanguage, setSelectedLanguage] = useState();
  const [resultSelectedCountries, setResultSelectedCountries] = useState<
    IRegion[]
  >([]);

  const [date, setDate] = useState<Date | null>(null);
  const [openDateModal, setOpenDateModal] = useState<boolean>(false);

  const handleOpenNumberBottomSheet = useCallback(() => {
    numberBottomSheet.current?.expand();
  }, []);

  const handleOpenCitiesBottomSheet = useCallback(() => {
    setShowTopBar(false);
    citiesBottomSheet.current?.expand();
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
          onPress={handleOpenCitiesBottomSheet}
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

        <Pressable
          onPress={handleOpenNumberBottomSheet}
          className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
        >
          <Text className="mr-4 text-xl">동행 수</Text>
          <Text className="text-xl">10</Text>
        </Pressable>

        <Pressable
          onPress={() => setOpenDateModal(true)}
          className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
        >
          <Text className="mr-4 text-xl">모집 마감일</Text>
          {date && (
            <Text className="text-xl">
              {dayjs(date).format("YYYY-MM-DD hh:mm")}
            </Text>
          )}
          <DatePicker
            modal
            mode="datetime"
            open={openDateModal}
            date={date || new Date()}
            locale="ko-KR"
            onConfirm={(date) => {
              setOpenDateModal(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpenDateModal(false);
            }}
          />
        </Pressable>

        <Pressable
          // onPress={() => setOpenDateModal(true)}
          className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
        >
          <Text className="mr-4 text-xl">모집 마감일</Text>
          {date && (
            <Text className="text-xl">
              {dayjs(date).format("YYYY-MM-DD hh:mm")}
            </Text>
          )}
          <DatePicker
            modal
            mode="datetime"
            // open={openDateModal}
            date={date || new Date()}
            locale="ko-KR"
            // onConfirm={(date) => {
            //   setOpenDateModal(false);
            //   setDate(date);
            // }}
            // onCancel={() => {
            //   setOpenDateModal(false);
            // }}
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
        bottomSheetRef={citiesBottomSheet}
        resultSelectedCountries={resultSelectedCountries}
        setResultSelectedCountries={setResultSelectedCountries}
        handleChangeFormValues={handleChangeFormValues}
        setShowTopBar={setShowTopBar}
      />

      <BottomSheet
        index={-1}
        snapPoints={SNAP_POINTS}
        ref={numberBottomSheet}
        onChange={(e) => console.log(e)}
        enablePanDownToClose={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <BottomSheetView>
          <PickerIOS
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }
          >
            {Array.from({ length: 50 }, (_, i) => (
              <PickerIOS.Item key={i + 1} label={String(i + 1)} value={i + 1} />
            ))}
          </PickerIOS>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
