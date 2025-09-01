import { useFetchCompanions } from '@/entities/companion';
import { ICompanion } from '@/entities/companion';
import { groupByCountry, GroupByCountryLabel } from '@/features/select-region';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, Text, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CompanionCard = React.memo(({ item }: { item: ICompanion }) => {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      CompanionDetail: any;
    }>
  >();

  const groupedRegions = useMemo(
    () => groupByCountry(item.companion_regions),
    [item],
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
    <Pressable
      onPress={() => navigation.navigate('CompanionDetail', { id: item.id })}
      key={item.id}
      className="w-full h-auto mb-2 bg-white"
    >
      <View className="flex-col p-4">
        <View className="flex-row gap-x-4">
          <FlatList
            data={regionItems}
            keyExtractor={item => item.key}
            renderItem={renderItem}
          />
        </View>
        <Text className="mt-3 font-semibold line-clamp-1">{item.title}</Text>
        <Text className="mt-1 text-slate-600 line-clamp-2">{item.content}</Text>
        <View className="flex-row items-center my-3 gap-x-2">
          <View className="w-5 h-5 overflow-hidden rounded-full">
            <Image
              source={{ uri: item.user_info.profile_image }}
              className="object-cover w-full h-full"
            />
          </View>
          <Text className="text-sm text-slate-700">
            {item.user_info.nickname} ·{' '}
            {item.user_info.gender === 'female' ? '여자' : '남자'}
          </Text>
        </View>
        {/* // TODO: 카운팅 추가 */}
        <Text className="text-sm font-semibold text-blue-500">
          {item.gender_preference === 'R'
            ? '무관'
            : item.gender_preference === 'M'
              ? '남자만'
              : '여자만'}{' '}
          · 0 / {item.companion_count} ·{' '}
          {dayjs(item.deadline_at).diff(new Date(), 'days') > 0
            ? `모집 마감 ${dayjs(item.deadline_at).diff(new Date(), 'days')}일 전`
            : '곧 마감'}
        </Text>
        <View className="flex-row items-center mt-1 gap-x-2">
          <Ionicons name="calendar-outline" size={16} color="#4b5563" />
          <Text className="text-sm text-gray-600">
            {dayjs(item.start_date).format('YY.MM.DD')} ~{' '}
            {dayjs(item.end_date).format('YY.MM.DD')} (
            {dayjs(item.end_date).diff(item.start_date, 'days')}일)
          </Text>
        </View>
      </View>
    </Pressable>
  );
});

export default function CompanionScreen() {
  const { data, refetch, isRefetching } = useFetchCompanions();

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CompanionCard item={item} />}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </>
  );
}
