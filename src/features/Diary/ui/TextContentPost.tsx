import { View, Text, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-web-swiper";

export default function TextContentPost({ data }) {
  return (
    <View key={data.id} className="w-full h-auto mb-2 bg-white">
      <View className="flex-row items-center p-4 gap-x-2">
        <View className="rounded-full w-14 h-14 bg-slate-200"></View>
        <Text>{data.username}</Text>
      </View>

      <Swiper
        key="my"
        loop
        controlsEnabled={false}
        containerStyle={{
          width: "100%",
          height: 350,
        }}
      >
        {data.images.map((img) => (
          <Image
            key={img}
            source={{ uri: img }}
            resizeMode="cover"
            className="w-full h-full mx-auto"
          />
        ))}
      </Swiper>

      <View className="flex-col px-4 my-3 gap-y-3">
        <Text className="text-xl font-semibold">{data.title}</Text>

        <View className="flex-row gap-x-4">
          {data.cities.map((v) => (
            <View key={data.name} className="px-2 py-1 bg-gray-100 rounded-md">
              <Text className="text-base">{data.name}</Text>
              <Text className="-mt-0.5 text-sm text-gray-600">
                {data.countryName}
              </Text>
            </View>
          ))}
        </View>

        <View className="flex-row items-center gap-x-2">
          <Ionicons name="calendar-outline" size={18} color="#4b5563" />
          <Text className="text-base text-gray-600">{data.travelDate}</Text>
        </View>

        <Text>{data.content}</Text>
      </View>
    </View>
  );
}
