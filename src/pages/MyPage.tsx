import { Pressable, Text, View } from "react-native";

export default function MyPageScreen({ navigation }) {
  return (
    <View className="items-center flex-1 bg-white">
      <View className="w-32 h-32 mt-20 bg-gray-200 rounded-full"></View>
      <Text className="mt-4 text-xl font-semibold">홍길동</Text>
      <Text className="mt-3">여행을 사랑하는 홍길동입니다</Text>
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
        onPress={() => navigation.navigate("ProfileUpdate")}
        className="px-20 py-2 mt-14 border rounded-lg border-[#a38f86]"
      >
        <Text className="text-[#a38f86]">프로필 수정</Text>
      </Pressable>
    </View>
  );
}
