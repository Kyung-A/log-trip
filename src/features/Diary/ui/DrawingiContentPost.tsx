import { IDiary } from "@/apis/createDiary";
import dayjs from "dayjs";
import { View, Dimensions, Image, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function DrawingiContentPost({ data }: { data: IDiary }) {
  return (
    <>
      <View className="flex-col px-4 mb-3 gap-y-3">
        <View className="flex-row gap-x-4">
          {data.diary_regions.map((v) => (
            <View
              key={v.region_code}
              className="px-2 py-1 bg-gray-100 rounded-md"
            >
              <Text className="text-base">{v.country_name}</Text>
              <Text className="-mt-0.5 text-sm text-gray-600">
                {v.region_name}
              </Text>
            </View>
          ))}
        </View>

        <View className="flex-row items-center gap-x-2">
          <Ionicons name="calendar-outline" size={18} color="#4b5563" />
          <Text className="text-base text-gray-600">
            {dayjs(data.travel_date).format("YYYY-MM-DD")}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height - 220,
        }}
      >
        <Image
          source={{ uri: data.drawing_content }}
          className="object-fill w-full h-full"
        />
      </View>
    </>
  );
}
