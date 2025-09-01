import { useFetchUserId, useFetchUserProfile } from '@/entities/auth';
import {
  useDeleteCompanion,
  useFetchCompanionDetail,
} from '@/entities/companion';
import { useApply } from '@/entities/companion-application';
import { groupByCountry } from '@/features/select-region';
import { useActionSheet } from '@expo/react-native-action-sheet';
import {
  NavigatorScreenParams,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CompanionDetailScreen() {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      Home: NavigatorScreenParams<{ 동행: string }>;
      CompanionUpdate: any;
      ApplyStatus: any;
    }>
  >();
  const { showActionSheetWithOptions } = useActionSheet();
  const {
    params: { id },
  } = useRoute<RouteProp<any>>();

  const { data } = useFetchCompanionDetail(id);
  const { data: userId } = useFetchUserId();
  const { data: profile } = useFetchUserProfile(userId);
  const { mutateAsync: deleteMutateAsync } = useDeleteCompanion();
  const { mutateAsync: applyMutateAsync } = useApply();

  const [visible, setVisible] = useState<boolean>(false);
  const [applyMessage, setApplyMessage] = useState<string>();

  const gender = useMemo(() => {
    if (data?.gender_preference === 'F' && profile?.gender === 'female') {
      return true;
    } else if (data?.gender_preference === 'M' && profile?.gender === 'male') {
      return true;
    } else if (data?.gender_preference === 'R') {
      return true;
    } else {
      return false;
    }
  }, [data, profile]);

  const applied = useMemo(
    () => data?.applications.some(v => v.applicant_id === userId),
    [data?.applications, userId],
  );

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

  const handleDeleteCompanion = useCallback(
    async (id: string) => {
      const result = await deleteMutateAsync(id);
      if (result.status === 204) {
        navigation.navigate('Home', { screen: '동행' });
      }
    },
    [deleteMutateAsync],
  );

  const handleOpenActionSheet = useCallback(() => {
    const options = ['수정', '삭제', '취소'];

    showActionSheetWithOptions({ options, cancelButtonIndex: 2 }, idx => {
      if (idx === 0) navigation.navigate('CompanionUpdate', { id: data?.id });
      else if (idx === 1) handleDeleteCompanion(data.id);
      else if (idx === 2) return;
    });
  }, [data?.id, navigation]);

  const handleCompanionApplication = useCallback(async () => {
    const body = {
      companion_id: data?.id,
      applicant_id: userId,
      message: applyMessage,
    };

    const result = await applyMutateAsync(body);
    if (result.status === 201 || result.status === 200) {
      setVisible(false);
      navigation.navigate('ApplyStatus');
    }
  }, [applyMessage, data?.id, userId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        userId === data?.user_id && (
          <Pressable className="" onPress={handleOpenActionSheet}>
            <Ionicons name="ellipsis-vertical" size={22} color="#646464" />
          </Pressable>
        ),
    });
  }, [userId, data?.user_id]);

  return (
    data && (
      <>
        <ScrollView className="w-full h-screen bg-white gap-y-6">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-xl font-semibold">{data.title}</Text>
            <Text className="mt-1 text-sm text-slate-500">
              {dayjs(data.created_at).format('YYYY-MM-DD HH:mm')} 작성
            </Text>
          </View>

          <View className="px-4 pt-6 pb-16 gap-y-6">
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
                    현재 인원 : {data.accepted_count} / {data.companion_count}
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

        {userId !== data?.user_id && gender && (
          <View className="fixed bottom-0 w-full px-4 pt-4 bg-white border-t border-gray-200 pb-14">
            <TouchableOpacity
              onPress={() => setVisible(true)}
              className={`w-full rounded-lg ${dayjs().isAfter(data?.deadline_at) || applied || data.is_full ? 'bg-gray-300' : 'bg-[#d5b2a7]'}`}
            >
              <Text
                className={`py-3 font-bold text-center text-lg ${dayjs().isAfter(data?.deadline_at) || applied || data.is_full ? 'text-zinc-400' : 'text-white'}`}
                disabled={dayjs().isAfter(data?.deadline_at)}
              >
                {applied
                  ? '동행 신청 완료'
                  : data.is_full
                    ? '동행 신청 마감'
                    : '동행 신청하기'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal visible={visible} transparent animationType="fade">
          <Pressable
            className="flex-1 bg-[#00000076] items-center justify-center"
            onPress={() => setVisible(false)}
          >
            <View className="w-5/6 p-6 bg-white rounded-lg">
              <Text className="text-lg font-semibold">
                간단한 메세지를 함께 적으면
              </Text>
              <Text className="text-lg font-semibold">
                매칭될 확률이 높아져요!
              </Text>
              <TextInput
                className="p-4 mt-4 rounded-md bg-slate-100 min-h-28 placeholder:text-gray-400"
                placeholder="메세지를 작성해 주세요."
                multiline
                maxLength={200}
                onChangeText={setApplyMessage}
              />
              <TouchableOpacity
                onPress={handleCompanionApplication}
                className="w-full bg-[#d5b2a7] mt-4 rounded-md"
              >
                <Text className="py-2 text-lg font-semibold text-center text-white">
                  완료
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </>
    )
  );
}
