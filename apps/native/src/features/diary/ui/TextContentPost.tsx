import { useCallback, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import { IDiary } from '@/entities/diary';
import { groupByCountry, GroupByCountryLabel } from '@/features/select-region';

export default function TextContentPost({ data }: { data: IDiary }) {
  const groupedRegions = useMemo(
    () => groupByCountry(data.diary_regions),
    [data],
  );

  const regionItems = useMemo(() => {
    return Object.entries(groupedRegions).map(
      ([countryCode, { country_name, regions }]: any) => ({
        key: countryCode,
        countryName: country_name,
        regions: regions.join(', '),
      }),
    );
  }, [groupedRegions]);

  const renderItem = useCallback(({ item }) => {
    return (
      <GroupByCountryLabel
        countryName={item.countryName}
        regions={item.regions}
      />
    );
  }, []);

  return (
    <View className="flex-col px-4 mb-3 gap-y-3">
      <Text className="text-xl font-semibold">{data.title}</Text>

      <View className="flex-row gap-x-4">
        <FlatList
          data={regionItems}
          keyExtractor={item => item.key}
          renderItem={renderItem}
        />
      </View>

      <View className="flex-row items-center gap-x-2">
        <Ionicons name="calendar-outline" size={18} color="#4b5563" />
        <Text className="text-base text-gray-600">
          {dayjs(data.travel_date).format('YYYY-MM-DD')}
        </Text>
      </View>

      <Text className="py-4 whitespace-pre-wrap">{data.text_content}</Text>
    </View>
  );
}
