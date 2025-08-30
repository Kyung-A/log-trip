import { useFetchCompanionDetail } from '@/entities/companion';
import { groupByCountry } from '@/features/select-region';
import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CompanionDetailScreen() {
  const {
    params: { id },
  } = useRoute<RouteProp<any>>();
  const { data } = useFetchCompanionDetail(id);

  const groupedRegions = useMemo(
    () => data && groupByCountry(data?.companion_regions),
    [data],
  );

  const regionItems = useMemo(() => {
    return (
      groupedRegions &&
      Object.entries(groupedRegions)?.map(
        ([countryCode, { country_name, regions }]: any) => ({
          key: countryCode,
          countryName: country_name,
          regions: regions.join(', '),
        }),
      )
    );
  }, [groupedRegions]);

  return (
    <>
      {data && (
        <ScrollView className="w-full h-screen bg-white gap-y-6">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-xl font-semibold">{data.title}</Text>
            <Text className="mt-1 text-sm text-slate-500">
              {dayjs(data.created_at).format('YYYY-MM-DD HH:mm')} 작성
            </Text>
          </View>

          <View className="px-4 pt-6 pb-10 gap-y-6">
            <View>
              <Text className="text-base font-semibold">여행 일정</Text>

              <View className="p-3 mt-2 rounded-lg bg-zinc-100 gap-y-1">
                <View className="flex-row gap-x-2">
                  <Ionicons name="calendar-outline" size={16} color="#4b5563" />
                  <Text className="text-gray-800">
                    {dayjs(data.start_date).format('YY.MM.DD')} ~{' '}
                    {dayjs(data.end_date).format('YY.MM.DD')} (
                    {dayjs(data.end_date).diff(data.start_date, 'days')}일)
                  </Text>
                </View>

                <View className="flex-row gap-x-2">
                  <Ionicons name="map-outline" size={16} color="#4b5563" />
                  <View className="flex-row gap-x-2">
                    <Text className="text-gray-800">여행 장소 :</Text>
                    {regionItems.map(v => (
                      <Text key={v.key} className="text-gray-800">
                        {v.countryName} - {v.regions}
                      </Text>
                    ))}
                  </View>
                </View>

                <View className="flex-row gap-x-2">
                  <Ionicons name="location-outline" size={16} color="#4b5563" />
                  <Text className="text-gray-800">
                    만남 장소 : {data.place}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text className="text-base font-semibold">동행 유형</Text>

              <View className="p-3 mt-2 rounded-lg bg-zinc-100 gap-y-1">
                <View className="flex-row gap-x-2">
                  <Ionicons name="person" size={16} color="#4b5563" />
                  <Text className="text-gray-800">
                    {data.gender_preference === 'R'
                      ? '무관'
                      : data.gender_preference === 'M'
                        ? '남자만'
                        : '여자만'}
                  </Text>
                </View>

                <View className="flex-row gap-x-2">
                  <Ionicons name="people-sharp" size={16} color="#4b5563" />
                  <Text className="text-gray-800">
                    현재 인원 : 0 / {data.companion_count}
                  </Text>
                </View>
              </View>
            </View>

            <Text className="py-6 text-gray-800 whitespace-pre-wrap">
              {data.content}
            </Text>

            <View className="p-3 rounded-lg bg-zinc-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-2">
                  <View className="w-12 h-12 overflow-hidden rounded-full">
                    <Image
                      source={{ uri: data.user_info.profile_image }}
                      className="object-cover w-full h-full"
                    />
                  </View>
                  <View>
                    <Text className="font-semibold">
                      {data.user_info.nickname}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-0.5">
                      {data.user_info.gender === 'female' ? '여자' : '남자'} ·{' '}
                      {data.user_info.about}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward-sharp"
                  size={20}
                  color="#9a9a9a"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <View className="fixed bottom-0 w-full px-4 pt-4 bg-white border-t border-gray-200 pb-14">
        <TouchableOpacity
          className={`w-full rounded-lg ${dayjs().isAfter(data?.deadline_at) ? 'bg-gray-300' : 'bg-[#d5b2a7]'}`}
        >
          <Text
            className={`py-4 font-bold text-center ${dayjs().isAfter(data?.deadline_at) ? 'text-zinc-500' : 'text-white'}`}
            disabled={dayjs().isAfter(data?.deadline_at)}
          >
            동행 신청하기
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
