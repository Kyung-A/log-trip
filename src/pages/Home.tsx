import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useCallback, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-web-swiper";

export default function HomeScreen() {
  const { showActionSheetWithOptions } = useActionSheet();
  const [imgs, setImgs] = useState<string[] | null>(null);

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

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <Pressable
          onPress={onPress}
          className="w-full bg-gray-200 flex items-center flex-row gap-x-2 justify-center py-2"
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

        <View>
          <Pressable className="w-full p-4 border-gray-300 border-b">
            <Text className="text-xl">도시 선택</Text>
          </Pressable>
        </View>
      </ScrollView>
      <BottomSheet
        // index={1}
        snapPoints={["100%"]}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        // enableDynamicSizing={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <BottomSheetScrollView className="flex-1 bg-white">
          <Text>Awesome 🎉</Text>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}
