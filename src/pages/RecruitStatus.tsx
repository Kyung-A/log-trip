import { useFetchUserId } from '@/entities/auth';
import {
  IApplicantsForMyPost,
  useApplicantsForMyPosts,
  useCancelApply,
} from '@/entities/companion-application';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const statusLabel = {
  pending: (
    <Text className="text-sm font-semibold text-green-700">● 대기중</Text>
  ),
  accepted: (
    <Text className="text-sm font-semibold text-blue-600">● 매칭완료</Text>
  ),
  rejected: <Text className="text-sm font-semibold text-red-800">● 거절</Text>,
  cancelled: (
    <Text className="text-sm font-semibold text-slate-300">● 취소함</Text>
  ),
};

const StatusCard = React.memo(({ item }: { item: IApplicantsForMyPost }) => {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      CompanionDetail: any;
    }>
  >();

  const { mutate } = useCancelApply();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('CompanionDetail', { id: item.companion.id })
      }
      key={item.id}
      className="w-full h-auto mb-2 bg-white"
    >
      <View className="flex-col p-6">
        <Text className="text-lg font-semibold line-clamp-1">
          {item.companion.title}
        </Text>

        <View className="w-full p-4 mt-4 rounded-md bg-zinc-100">
          <TouchableOpacity>
            <View className="flex-row items-center gap-x-2">
              <View className="w-6 h-6 overflow-hidden bg-[#d5b2a7] rounded-full">
                {item.applicant.profile_image ? (
                  <Image
                    source={{ uri: item.applicant.profile_image }}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <View className="items-center justify-center w-full h-full">
                    <Ionicons name="person" size={14} color="#fff" />
                  </View>
                )}
              </View>
              <Text>{item.applicant.nickname}</Text>
            </View>

            <Text className="my-2 whitespace-pre-wrap text-zinc-500">
              {item.message}
            </Text>

            {statusLabel[item.status]}
          </TouchableOpacity>
        </View>

        {item.status === 'pending' && (
          <Pressable
            // onPress={() => mutate(item)}
            className="w-full mt-4 bg-[#f2eeec] rounded-lg"
          >
            <Text className="text-[#a38f86] py-4 text-center font-semibold">
              거절하기
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
});

export default function RecruitStatusScreen() {
  const { data: userId } = useFetchUserId();
  const { data, isRefetching, refetch } = useApplicantsForMyPosts(userId);
  console.log(data);

  return (
    <>
      {data && (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <StatusCard item={item} />}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
    </>
  );
}
