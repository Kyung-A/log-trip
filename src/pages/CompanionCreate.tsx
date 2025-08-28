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
import { useNavigation } from "@react-navigation/native";
import { getUser } from "@/entities/auth";
import dayjs from "dayjs";
import { PickerIOS } from "@react-native-picker/picker";
import { DateField } from "@/shared";
import { IRegion, useFetchRegions } from "@/entities/region";
import { CitySelectField } from "@/features/select-region";

const SNAP_POINTS = ["30%"];

export default function CompanionCreateScreen() {
  const navigation = useNavigation();
  const numberBottomSheet = useRef<BottomSheet>(null);

  const [formData, setFormData] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [cities, setCities] = useState<IRegion[]>([]);
  const [date, setDate] = useState<Date | null>(null);

  const { data: regions } = useFetchRegions();

  const handleOpenNumberBottomSheet = useCallback(() => {
    numberBottomSheet.current?.expand();
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

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <CitySelectField
          label="도시 선택"
          value={cities}
          onConfirm={setCities}
          options={regions}
        />

        <Pressable
          onPress={handleOpenNumberBottomSheet}
          className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
        >
          <Text className="mr-4 text-xl">동행 수</Text>
          <Text className="text-xl">10</Text>
        </Pressable>

        <DateField
          defaultLabel="모집 마감일"
          valueLabel={date && dayjs(date).format("YYYY-MM-DD hh:mm")}
          onConfirm={(date) => setDate(date)}
          date={date}
          title="모집 마감일"
        />
        <DateField
          defaultLabel="동행 시작"
          valueLabel={date && dayjs(date).format("YYYY-MM-DD hh:mm")}
          onConfirm={(date) => setDate(date)}
          date={date}
          title="동행 시작"
        />
        <DateField
          defaultLabel="동행 종료"
          valueLabel={date && dayjs(date).format("YYYY-MM-DD hh:mm")}
          onConfirm={(date) => setDate(date)}
          date={date}
          title="동행 종료"
        />

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
