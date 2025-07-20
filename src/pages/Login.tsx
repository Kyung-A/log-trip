import { Image, Pressable, Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <View className="w-40 h-40">
        <Image
          source={require("../../assets/images/logo.png")}
          className="object-cover w-full h-full"
        />
      </View>
      <View className="mt-14">
        <Pressable className="px-4 py-3 rounded-full w-60 border border-[#a38f86]">
          <Text className="font-bold text-center text-[#a38f86]">
            카카오 로그인
          </Text>
        </Pressable>
        <Pressable className="px-4 py-3 rounded-full w-60 border border-[#a38f86] mt-2">
          <Text className="font-bold text-center text-[#a38f86]">
            네이버 로그인
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
