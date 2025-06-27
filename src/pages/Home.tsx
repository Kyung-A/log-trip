import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  Button,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Swiper from "react-native-web-swiper";
import { COUNTRIES } from "@/constants";

const SNAP_POINTS = ["100%"];

interface ICountry {
  name: string;
  code: string;
  country: string;
  countryName: string;
}

export default function HomeScreen() {
  const { showActionSheetWithOptions } = useActionSheet();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [imgs, setImgs] = useState<string[] | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<ICountry[]>([]);
  const [searchCountries, setSearchCountries] = useState<ICountry[]>(COUNTRIES);
  const [resultSelectedCountries, setResultSelectedCountries] = useState<
    ICountry[]
  >([]);

  const handleDeleted = useCallback(
    (uri: string) => {
      const newValue = imgs.filter((v) => v !== uri);
      setImgs(newValue);
    },
    [imgs]
  );

  const handleResult = useCallback((res: ImagePicker.ImagePickerResult) => {
    if (!res.canceled) setImgs(res.assets.map((v) => v.uri));
  }, []);

  const pickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    handleResult(result);
  }, []);

  const takeWithCamera = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    handleResult(result);
  }, []);

  const onPress = useCallback(() => {
    const options = ["카메라 촬영", "앨범에서 선택", "취소"];

    showActionSheetWithOptions(
      {
        options,
      },
      (idx) => {
        if (idx === 0) takeWithCamera();
        else if (idx === 1) pickFromLibrary();
        else if (idx === 2) return;
      }
    );
  }, []);

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index == -1) {
        setSelectedCountries(resultSelectedCountries);
      }
    },
    [resultSelectedCountries]
  );

  const handleSelectedCountry = useCallback((selectData: ICountry) => {
    setSelectedCountries((prev) => {
      const isSelected = prev.some(
        (data) =>
          data.code === selectData.code && data.country === selectData.country
      );

      if (isSelected) {
        return prev.filter(
          (p) =>
            !(p.code === selectData.code && p.country === selectData.country)
        );
      } else {
        return [...prev, selectData];
      }
    });
  }, []);

  const handleSearchCountry = useCallback((value) => {
    const newList = COUNTRIES.filter(
      (v) => v.name.includes(value) || v.countryName.includes(value)
    );
    setSearchCountries(newList);
  }, []);

  const handleSelectedFinish = useCallback(() => {
    bottomSheetRef.current.close();
    setResultSelectedCountries(selectedCountries);
  }, [selectedCountries]);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current.close();
    setSelectedCountries(resultSelectedCountries);
  }, [resultSelectedCountries]);

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <Pressable
          onPress={onPress}
          className="flex flex-row items-center justify-center w-full py-2 bg-gray-200 gap-x-2"
        >
          <EvilIcons name="camera" size={30} color="#4b5563" />
          <Text className="text-[#4b5563]">사진 추가하기</Text>
        </Pressable>
        <View className="w-full h-[250px]">
          {imgs && imgs.length > 0 ? (
            <Swiper
              key={imgs?.join("|")}
              loop
              containerStyle={{ width: "100%", height: "100%" }}
            >
              {imgs?.map((uri) => (
                <View key={uri} className="w-full h-full">
                  <Image source={{ uri }} className="w-full h-full" />
                  <Pressable
                    onPress={() => handleDeleted(uri)}
                    className="right-2 top-3 border-2 rounded-full border-white bg-[#00000099] absolute"
                  >
                    <Ionicons name="close" size={20} color="#fff" />
                  </Pressable>
                </View>
              ))}
            </Swiper>
          ) : (
            <View className="w-full h-full flex items-center justify-center flex-col bg-[#00000043]">
              <Text className="text-lg">사진을 등록해 주세요!</Text>
            </View>
          )}
        </View>

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
      </ScrollView>

      <BottomSheet
        index={-1}
        snapPoints={SNAP_POINTS}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <BottomSheetScrollView
          stickyHeaderIndices={[0]}
          className="flex-1 bg-white"
        >
          <View className="sticky top-0 h-auto px-6 pb-4 bg-white border-b border-[#ebebeb]">
            <View className="flex flex-row items-center justify-between w-full">
              <Pressable onPress={handleCloseBottomSheet}>
                <Ionicons name="close-outline" size={32} color="#000" />
              </Pressable>
              <Text className="text-xl font-semibold">도시 선택</Text>
              <Button onPress={handleSelectedFinish} title="완료" />
            </View>
            <View className="flex flex-row items-center px-3 py-4 mt-6 rounded-lg bg-[#ebebeb]">
              <Ionicons name="search-outline" size={24} />
              <TextInput
                className="ml-3 text-lg"
                textContentType="addressCity"
                placeholder="도시 또는 나라 검색"
                onChangeText={(e) => handleSearchCountry(e)}
              />
            </View>
            <View className="flex flex-row flex-wrap gap-2 mt-4">
              {selectedCountries.map((v) => (
                <Text
                  key={`${v.code}-${v.country}`}
                  className="p-2 rounded bg-[#ebebeb] font-semibold"
                >
                  {v.name}
                </Text>
              ))}
            </View>
          </View>
          <View className="flex flex-col min-h-screen px-6 py-2 gap-y-6">
            {searchCountries.map((v, idx) => {
              const selected = selectedCountries.some(
                (item) => item.code === v.code && item.country === v.country
              );

              return (
                <Pressable
                  key={`${v.code}-${v.country}-${v.name}-${idx}`}
                  onPress={() => handleSelectedCountry(v)}
                  className="flex flex-row items-center gap-x-2"
                >
                  <MaterialCommunityIcons
                    name={
                      selected ? "checkbox-marked" : "checkbox-blank-outline"
                    }
                    size={28}
                    color={selected ? "#000" : "#ccc"}
                  />
                  <View>
                    <Text className="text-xl">{v.name}</Text>
                    <Text className="mt-0.5 text-base text-gray-600">
                      {v.countryName}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}
