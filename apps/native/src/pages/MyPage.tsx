import {
  deleteUser,
  deleteUserProfile,
  useFetchUserId,
  useFetchUserProfile,
} from '@/entities/auth';
import { useFetchMyCounter } from '@/entities/my';
import { logout } from '@/features/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface IProfile {
  year_of_birth: string;
  created_at: string;
  gender: string;
  id: string;
  mobile_carrier: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  platform: string;
  about: string;
  profile_image: string;
}

export default function MyPageScreen({ navigation }) {
  const qc = useQueryClient();

  const { data: userId } = useFetchUserId();
  const { data: profile } = useFetchUserProfile(userId);
  const { data: counters } = useFetchMyCounter(userId);

  const handleLogout = useCallback(async () => {
    await logout();
    qc.clear();
    navigation.navigate('Login');
  }, []);

  // TODO: 데이터 모두 삭제할지 말지?
  const handleDeleteUser = useCallback(async () => {
    await deleteUserProfile(userId);
    await deleteUser(userId);
    qc.clear();
    navigation.navigate('Login');
  }, []);

  return (
    <View className="items-center flex-1 bg-white">
      <View className="w-32 h-32 mt-20 bg-[#d5b2a7] rounded-full">
        {profile?.profile_image ? (
          <Image
            source={{ uri: profile.profile_image }}
            className="object-cover w-full h-full rounded-full"
          />
        ) : (
          <View className="items-center justify-center w-full h-full">
            <Ionicons name="person" size={60} color="#fff" />
          </View>
        )}
      </View>
      <Text className="mt-4 text-xl font-semibold">{profile?.nickname}</Text>
      <Text className="mt-3">
        {profile?.about ?? '간단한 자기소개를 작성해 주세요!'}
      </Text>
      <View className="flex-row items-center mt-6">
        <View className="items-center px-6">
          <Text className="text-sm text-gray-500">여행 일기</Text>
          <Text className="text-lg mt-0.5 font-semibold text-[#a38f86]">
            {counters?.diaries_count}
          </Text>
        </View>

        <View className="h-10 w-[1px] bg-gray-200"></View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ApplyStatus')}
          className="items-center px-6"
        >
          <Text className="text-sm text-gray-500">동행 신청 현황</Text>
          <Text className="text-lg mt-0.5 font-semibold text-[#a38f86]">
            {counters?.applied_count}
          </Text>
        </TouchableOpacity>

        <View className="h-10 w-[1px] bg-gray-200"></View>

        <TouchableOpacity
          onPress={() => navigation.navigate('RecruitStatus')}
          className="items-center px-6"
        >
          <Text className="text-sm text-gray-500">동행 모집 현황</Text>
          <Text className="text-lg mt-0.5 font-semibold text-[#a38f86]">
            {counters?.received_count}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProfileUpdate', {
            id: profile.id,
            profile_image: profile.profile_image,
            nickname: profile.nickname,
            about: profile.about,
          })
        }
        className="px-20 py-2 mt-14 border rounded-lg border-[#a38f86]"
      >
        <Text className="text-[#a38f86]">프로필 수정</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} className="mt-6">
        <Text className="text-[#a38f86] underline">로그아웃</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDeleteUser} className="mt-4">
        <Text className="text-[#a38f86] text-sm">계정 탈퇴</Text>
      </TouchableOpacity>
    </View>
  );
}
