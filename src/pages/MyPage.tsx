import { getUser, getUserProfile, logout } from "@/apis";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export interface IProfile {
  birthday: string;
  created_at: string;
  gender: string;
  id: string;
  mobile_carrier: string;
  name: string;
  nickname: string;
  phone: string;
  platform: string;
  about: string;
  profile_image: string;
}

export default function MyPageScreen({ navigation }) {
  const [profile, setProfile] = useState<IProfile>();

  const handleLogout = useCallback(async () => {
    await logout();
    navigation.navigate("Login");
  }, []);

  const fetchData = useCallback(async () => {
    const user = await getUser();
    const data = await getUserProfile(user.id);
    setProfile(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View className="items-center flex-1 bg-white">
      <View className="w-32 h-32 mt-20 bg-[#d5b2a7] rounded-full">
        {profile?.profile_image ? (
          <Image
            source={{ uri: profile.profile_image }}
            className="object-cover w-full h-full rounded-full"
          />
        ) : (
          <View className="items-center justify-center w-full h-full">
            <Ionicons name="person" size={60} color="#fff" />
          </View>
        )}
      </View>
      <Text className="mt-4 text-xl font-semibold">{profile?.name}</Text>
      <Text className="mt-3">
        {profile?.about ?? "간단한 자기소개를 작성해 주세요!"}
      </Text>
      <View className="flex-row items-center mt-6">
        <View className="items-center px-6">
          <Text className="text-sm text-gray-500">여행 일기</Text>
          <Text className="text-lg mt-0.5 font-semibold text-[#a38f86]">
            10
          </Text>
        </View>
        <View className="h-10 w-[1px] bg-gray-200"></View>
        <View className="items-center px-6">
          <Text className="text-sm text-gray-500">여행한 나라</Text>
          <Text className="text-lg mt-0.5 font-semibold text-[#a38f86]">4</Text>
        </View>
        <View className="h-10 w-[1px] bg-gray-200"></View>
        <View className="items-center px-6">
          <Text className="text-sm text-gray-500">동행 글</Text>
          <Text className="text-lg mt-0.5 font-semibold text-[#a38f86]">0</Text>
        </View>
      </View>
      <Pressable
        onPress={() =>
          navigation.navigate("ProfileUpdate", {
            id: profile.id,
            profile_image: profile.profile_image,
            nickname: profile.nickname,
            about: profile.about,
          })
        }
        className="px-20 py-2 mt-14 border rounded-lg border-[#a38f86]"
      >
        <Text className="text-[#a38f86]">프로필 수정</Text>
      </Pressable>
      <Pressable onPress={handleLogout} className="mt-6">
        <Text className="text-[#a38f86] underline">로그아웃</Text>
      </Pressable>
    </View>
  );
}
