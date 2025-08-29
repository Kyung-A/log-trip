import {IDiary} from '@/entities/diary';
import dayjs from 'dayjs';
import {useMemo} from 'react';
import {View, Dimensions, Image, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {groupByCountry} from '../lib';

export default function DrawingiContentPost({data}: {data: IDiary}) {
  const groupedRegions = useMemo(
    () => groupByCountry(data.diary_regions),
    [data],
  );

  return (
    <>
      <View className="flex-col px-4 mb-3 gap-y-3">
        <View className="flex-row gap-x-4">
          {Object.entries(groupedRegions).map(
            ([countryCode, {country_name, regions}]: any) => (
              <View
                key={countryCode}
                className="px-2 py-1 bg-gray-100 rounded-md"
              >
                <Text className="text-base">{country_name}</Text>
                <Text className="text-sm -mt-0.5 text-gray-600">
                  {regions.join(', ')}
                </Text>
              </View>
            ),
          )}
        </View>

        <View className="flex-row items-center gap-x-2">
          <Ionicons name="calendar-outline" size={18} color="#4b5563" />
          <Text className="text-base text-gray-600">
            {dayjs(data.travel_date).format('YYYY-MM-DD')}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height - 220,
        }}
      >
        <Image
          source={{uri: data.drawing_content}}
          className="object-fill w-full h-full"
        />
      </View>
    </>
  );
}
