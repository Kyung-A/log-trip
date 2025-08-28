import { useMemo } from "react";
import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import { groupByCountry } from "../lib";
import { IDiary } from "@/entities/diary";

export default function TextContentPost({ data }: { data: IDiary }) {
  const groupedRegions = useMemo(
    () => groupByCountry(data.diary_regions),
    [data]
  );

  return (
    <View className="flex-col px-4 mb-3 gap-y-3">
      <Text className="text-xl font-semibold">{data.title}</Text>

      <View className="flex-row gap-x-4">
        {Object.entries(groupedRegions).map(
          ([countryCode, { country_name, regions }]: any) => (
            <View
              key={countryCode}
              className="px-2 py-1 bg-gray-100 rounded-md"
            >
              <Text className="text-base">{country_name}</Text>
              <Text className="text-sm -mt-0.5 text-gray-600">
                {regions.join(", ")}
              </Text>
            </View>
          )
        )}
      </View>

      <View className="flex-row items-center gap-x-2">
        <Ionicons name="calendar-outline" size={18} color="#4b5563" />
        <Text className="text-base text-gray-600">
          {dayjs(data.travel_date).format("YYYY-MM-DD")}
        </Text>
      </View>

      <Text className="py-4">{data.text_content}</Text>
    </View>
  );
}
