import { useFetchUserId } from '@/entities/auth';
import {
  IApplyStatus,
  useCancelApply,
  useMyApplyStatus,
} from '@/entities/companion-application';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, FlatList, Pressable, Image } from 'react-native';

const statusLabel = {
  pending: (
    <Text className="text-sm font-semibold text-green-700">● 대기중</Text>
  ),
  accepted: (
    <Text className="text-sm font-semibold text-blue-600">● 매칭완료</Text>
  ),
  rejected: <Text className="text-sm font-semibold text-red-800">● 거절</Text>,
  cancelled: (
    <Text className="text-sm font-semibold text-slate-300">● 신청취소</Text>
  ),
};

const StatusCard = React.memo(({ item }: { item: IApplyStatus }) => {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      CompanionDetail: any;
    }>
  >();

  const { mutate } = useCancelApply();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('CompanionDetail', { id: item.companion_id })
      }
      key={item.id}
      className="w-full h-auto mb-2 bg-white"
    >
      <View className="flex-col p-6">
        <View className="flex-row items-center justify-between">
          <Text className="w-5/6 mb-1 text-lg font-semibold line-clamp-1">
            {item.companion.title}
          </Text>
          {/* {item.status === 'accepted' && !item.decision_read_at && (
            <View className="px-2 py-0.5 rounded-md bg-blue-100">
              <Text className="text-xs font-semibold text-blue-600">NEW</Text>
            </View>
          )} */}
        </View>

        {statusLabel[item.status]}

        {item.status === 'accepted' && (
          <View className="w-full p-4 mt-2 rounded-md bg-zinc-100">
            <Text>모집자의 메세지</Text>
            <Text className="mt-1 whitespace-pre-wrap text-zinc-500">
              {item.decision_message}
            </Text>
          </View>
        )}

        {(item.status === 'pending' || item.status === 'accepted') && (
          <Pressable
            onPress={() => mutate(item)}
            className="w-full mt-4 bg-[#f2eeec] rounded-lg"
          >
            <Text className="text-[#a38f86] py-4 text-center font-bold">
              취소하기
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
});

export default function ApplyStatusScreen() {
  const { data: userId } = useFetchUserId();
  const { data, isRefetching, refetch } = useMyApplyStatus(userId);

  return (
    <>
      {data && data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <StatusCard item={item} />}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      ) : (
        <View className="items-center justify-center flex-1 gap-6">
          <Image
            source={require('@/assets/images/logo.png')}
            className="object-cover w-32 h-32"
          />
          <Text>여행을 함께 할 동행을 구해보세요!</Text>
        </View>
      )}
    </>
  );
}
