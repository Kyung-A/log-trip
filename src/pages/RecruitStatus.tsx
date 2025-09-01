import { useFetchUserId } from '@/entities/auth';
import {
  IApplicantsForMyPost,
  useAcceptCompanion,
  useApplicantsForMyPosts,
  useCancelApply,
} from '@/entities/companion-application';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
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

const StatusCard = React.memo(
  ({ item, userId }: { item: IApplicantsForMyPost; userId: string }) => {
    const navigation = useNavigation<
      NativeStackNavigationProp<{
        CompanionDetail: any;
      }>
    >();

    const [visible, setVisible] = useState<boolean>(false);
    const [applyMessage, setApplyMessage] = useState<string>();

    const { mutateAsync } = useAcceptCompanion();

    const handleAcceptCompanion = useCallback(async () => {
      const body = {
        id: item.id,
        decided_by: userId,
        decision_message: applyMessage,
        decided_at: dayjs(),
        companion_id: item?.companion.id,
      };

      const result = await mutateAsync(body);
      if (result.status === 204) {
        setVisible(false);
      }
    }, [applyMessage, item.id, item?.companion.id, userId]);

    return (
      <>
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
              <View className="flex-row mt-4 gap-x-2">
                <Pressable
                  onPress={() => setVisible(true)}
                  className="bg-[#a38f86] rounded-lg w-1/2"
                >
                  <Text className="text-[#f2eeec] py-4 text-center font-bold">
                    수락
                  </Text>
                </Pressable>

                <Pressable
                  // onPress={() => mutate(item)}
                  className="bg-[#f2eeec] rounded-lg w-1/2"
                >
                  <Text className="text-[#a38f86] py-4 text-center font-bold">
                    거절
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </Pressable>

        <Modal visible={visible} transparent animationType="fade">
          <Pressable
            className="flex-1 bg-[#00000076] items-center justify-center"
            onPress={() => setVisible(false)}
          >
            <View className="w-5/6 p-6 bg-white rounded-lg">
              <Text className="text-lg font-semibold">수락할 신청자와</Text>
              <Text className="text-lg font-semibold">
                원할한 소통을 위해 메세지를 남겨주세요!
              </Text>
              <TextInput
                className="p-4 mt-4 rounded-md bg-slate-100 min-h-28 placeholder:text-gray-400"
                placeholder="앞으로 연락은 XXX으로 해주시면 됩니다."
                multiline
                maxLength={200}
                onChangeText={setApplyMessage}
              />
              <TouchableOpacity
                onPress={handleAcceptCompanion}
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
    );
  },
);

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
          renderItem={({ item }) => <StatusCard item={item} userId={userId} />}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
    </>
  );
}
