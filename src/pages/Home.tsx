import {
  Alert,
  Button,
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
import { useCanvasRef } from "@shopify/react-native-skia";

export default function HomeScreen() {
  const canvasRef = useCanvasRef();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [imgs, setImgs] = useState<string[] | null>(null);
  const [resultSelectedCountries, setResultSelectedCountries] = useState<
    ICountry[]
  >([]);
  const [isDrawingMode, setDrawingMode] = useState<boolean>(false);
  const [isOpenDrawing, setOpenDrawing] = useState<boolean>(false);

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleChangeMode = useCallback((value) => {
    console.log("1111");
    if (value) {
      Alert.alert(
        "드로잉 모드로 전환 하시겠습니까?",
        "드로잉 모드 전환시 작성한 텍스트는 사라집니다.",
        [
          {
            text: "예",
            onPress: () => {
              setDrawingMode(true);
              setOpenDrawing(true);
            },
          },
          { text: "취소", onPress: () => {}, style: "cancel" },
        ]
      );
    } else {
      Alert.alert(
        "텍스트 모드로 전환 하시겠습니까?",
        "텍스트 모드 전환시 작성한 그림은 사라집니다.",
        [
          {
            text: "예",
            onPress: () => setDrawingMode(false),
          },
          { text: "취소", onPress: () => {}, style: "cancel" },
        ]
      );
    }
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

        <Pressable className="flex flex-row flex-wrap items-center justify-between w-full p-4 border-b border-gray-300">
          <Text className="mr-4 text-xl">드로잉 모드</Text>
          <View className="flex flex-row items-center gap-x-2">
            {isDrawingMode && (
              <Button onPress={() => setOpenDrawing(true)} title="열기" />
            )}
            <Switch value={isDrawingMode} onValueChange={handleChangeMode} />
          </View>
        </Pressable>

        {!isDrawingMode ? (
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
        ) : (
          <View></View>
        )}
      </ScrollView>

      <CountriesBottomSheet
        bottomSheetRef={bottomSheetRef}
        resultSelectedCountries={resultSelectedCountries}
        setResultSelectedCountries={setResultSelectedCountries}
      />

      <Drawing
        setOpenDrawing={setOpenDrawing}
        canvasRef={canvasRef}
        isOpenDrawing={isOpenDrawing}
      />
    </>
  );
}
