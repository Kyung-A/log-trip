import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  CountriesBottomSheet,
  Drawing,
  UploadImages,
} from "@/features/Diary/ui";
import { ICountry } from "@/features/Diary/types";

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [imgs, setImgs] = useState<string[] | null>(null);
  const [resultSelectedCountries, setResultSelectedCountries] = useState<
    ICountry[]
  >([]);
  const [isDrawingMode, setDrawingMode] = useState<boolean>(false);

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <UploadImages imgs={imgs} setImgs={setImgs} />

        <Pressable
          onPress={handleOpenPress}
          className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
        >
          <Text className="mr-4 text-xl">도시 선택</Text>
          <View className="flex flex-row flex-wrap flex-1 gap-2">
            {resultSelectedCountries.map((v) => (
              <Text className="p-2 rounded bg-[#ebebeb] font-semibold">
                {v.name}
              </Text>
            ))}
          </View>
        </Pressable>

        <Pressable className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300">
          <Text className="mr-4 text-xl">드로잉 모드</Text>
          <Switch value={isDrawingMode} onValueChange={setDrawingMode} />
        </Pressable>

        {!isDrawingMode && (
          <View className="p-4">
            <TextInput
              className="text-xl font-semibold"
              placeholder="제목을 작성해주세요"
            />
            <TextInput
              className="mt-4 text-lg"
              placeholder="내용을 작성해주세요"
            />
          </View>
        )}
        {isDrawingMode && <Drawing />}
      </ScrollView>

      <CountriesBottomSheet
        bottomSheetRef={bottomSheetRef}
        resultSelectedCountries={resultSelectedCountries}
        setResultSelectedCountries={setResultSelectedCountries}
      />
    </>
  );
}
