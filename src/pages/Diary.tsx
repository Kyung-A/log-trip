import { Pressable, View, Text, Image, FlatList } from 'react-native';
import { DrawingiContentPost, TextContentPost } from '@/features/diary/ui';
import Feather from 'react-native-vector-icons/Feather';
import { useCallback } from 'react';
import Swiper from 'react-native-web-swiper';
import { IDiary, useFetchDiaries, useDeleteDiary } from '@/entities/diary';
import { useFetchUserId } from '@/entities/auth';
import { useActionSheet } from '@expo/react-native-action-sheet';

export default function DiaryScreen({ navigation }) {
  const { showActionSheetWithOptions } = useActionSheet();

  const { data: userId } = useFetchUserId();
  const { data } = useFetchDiaries(userId);
  const { mutateAsync } = useDeleteDiary();

  const handleDeleteDiary = useCallback(async (item: IDiary) => {
    await mutateAsync(item);
  }, []);

  const handleOpenActionSheet = useCallback((item: IDiary) => {
    const options = ['삭제', '취소'];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 1,
        tintColor: 'red',
      },
      idx => {
        if (idx === 0) handleDeleteDiary(item);
        else if (idx === 1) return;
      },
    );
  }, []);

  return (
    <>
      {data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View key={item.id} className="w-full h-auto mb-2 bg-white">
              <View className="flex-row items-center justify-between p-4">
                <Pressable
                  onPress={() => navigation.navigate('마이페이지')}
                  className="flex-row items-center gap-x-2"
                >
                  <View className="overflow-hidden rounded-full w-14 h-14">
                    <Image
                      source={{ uri: item.user_info.profile_image }}
                      className="object-cover w-full h-full"
                    />
                  </View>
                  <Text>{item.user_info.name}</Text>
                </Pressable>
                <Pressable onPress={() => handleOpenActionSheet(item)}>
                  <Feather name="more-vertical" size={20} />
                </Pressable>
              </View>

              {item.diary_images && item.diary_images.length > 0 && (
                <View className="mb-3">
                  <Swiper
                    key="my"
                    loop
                    containerStyle={{
                      width: '100%',
                      height: 400,
                    }}
                    controlsProps={{
                      prevPos: false,
                      nextPos: false,
                      dotsTouchable: true,
                      dotsPos: 'bottom',
                      dotActiveStyle: { backgroundColor: '#d5b2a7' },
                    }}
                  >
                    {item.diary_images.map(img => (
                      <Image
                        key={img.id}
                        source={{ uri: img.url }}
                        className="object-cover w-full h-full mx-auto"
                      />
                    ))}
                  </Swiper>
                </View>
              )}

              {item.is_drawing ? (
                <DrawingiContentPost data={item} />
              ) : (
                <TextContentPost data={item} />
              )}
            </View>
          )}
        />
      ) : (
        <View className="items-center justify-center flex-1 gap-6">
          <Image
            source={require('@/assets/images/logo.png')}
            className="object-cover w-32 h-32"
          />
          <Text>나만의 여행 일기를 작성해보세요!</Text>
        </View>
      )}
    </>
  );
}
