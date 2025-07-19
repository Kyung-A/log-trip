import { useActionSheet } from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useLayoutEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ProfileUpdateScreen() {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();

  const [profileImg, setProfileImg] = useState<string>();

  const handleDeleted = useCallback(() => setProfileImg(null), []);

  const handleResult = useCallback((res: ImagePicker.ImagePickerResult) => {
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setProfileImg(res.assets[0].uri);
    }
  }, []);

  const pickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 1,
      quality: 0.8,
    });

    handleResult(result);
  }, []);

  const takeWithCamera = useCallback(async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    handleResult(result);
  }, []);

  const onPress = useCallback(() => {
    const options = ["카메라 촬영", "앨범에서 선택", "삭제", "취소"];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 3,
        destructiveButtonIndex: 2,
      },
      (idx) => {
        if (idx === 0) takeWithCamera();
        else if (idx === 1) pickFromLibrary();
        else if (idx === 2) handleDeleted();
        else if (idx === 3) return;
      }
    );
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable className="pt-1.5" onPress={() => console.log("저장")}>
          <Text className="text-lg text-blue-500 underline">저장</Text>
        </Pressable>
      ),
    });
  }, []);

  return (
    <View className="items-center flex-1 bg-white">
      <View className="relative w-32 h-32 mt-20 bg-[#d5b2a7] rounded-full">
        {profileImg ? (
          <Image
            source={{ uri: profileImg }}
            className="object-cover w-full h-full rounded-full"
          />
        ) : (
          <View className="items-center justify-center w-full h-full">
            <Ionicons name="person" size={60} color="#fff" />
          </View>
        )}
        <Pressable
          onPress={onPress}
          className="absolute right-0 bg-[#cdc6c3] rounded-full w-10 h-10 items-center justify-center"
        >
          <FontAwesome name="camera" size={18} color="#fff" />
        </Pressable>
      </View>
      <TextInput
        className="w-40 mt-4 text-xl font-semibold text-center"
        placeholder="이름을 작성해주세요"
        defaultValue="홍길동"
      />
      <TextInput
        className="w-64 mt-3 text-center"
        placeholder="소개를 작성해주세요"
        defaultValue="여행을 사랑하는 홍길동입니다"
      />
    </View>
  );
}
