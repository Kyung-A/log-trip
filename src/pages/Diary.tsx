import { Pressable, View, Text, Image, FlatList } from "react-native";
import { DrawingiContentPost, TextContentPost } from "@/features/list/ui";
import Feather from "react-native-vector-icons/Feather";
import { useCallback, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { deleteDiary, getDiaries, getUser } from "@/apis";
import { IDiary } from "@/apis/createDiary";
import Swiper from "react-native-web-swiper";
import { useFocusEffect } from "@react-navigation/native";

const SNAP_POINTS = ["15%"];

export default function DiaryScreen({ navigation }) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [data, setData] = useState<IDiary[]>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<IDiary>();

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedPostId(null);
    }
  }, []);

  const handleDeleteDiary = useCallback(async () => {
    const { status } = await deleteDiary(selectedPostId);
    if (status === 204) {
      fetchData();
      bottomSheetRef.current?.close();
    }
  }, [selectedPostId]);

  const fetchData = useCallback(async () => {
    setRefreshing(true);

    const user = await getUser();
    const result = await getDiaries(user.id);
    setData(result);

    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <>
      {data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View key={item.id} className="w-full h-auto mb-2 bg-white">
              <View className="flex-row items-center justify-between p-4">
                <Pressable
                  onPress={() => navigation.navigate("마이페이지")}
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
                <Pressable
                  onPress={() => {
                    bottomSheetRef.current?.expand();
                    setSelectedPostId(item);
                  }}
                >
                  <Feather name="more-vertical" size={20} />
                </Pressable>
              </View>

              {item.diary_images && item.diary_images.length > 0 && (
                <View className="mb-3">
                  <Swiper
                    key="my"
                    loop
                    containerStyle={{
                      width: "100%",
                      height: 400,
                    }}
                    controlsProps={{
                      prevPos: false,
                      nextPos: false,
                      dotsTouchable: true,
                      dotsPos: "bottom",
                      dotActiveStyle: { backgroundColor: "#d5b2a7" },
                    }}
                  >
                    {item.diary_images.map((img) => (
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
          refreshing={refreshing}
          onRefresh={fetchData}
        />
      ) : (
        <View className="items-center justify-center flex-1 gap-6">
          <Image
            source={require("../../assets/images/logo.png")}
            className="object-cover w-32 h-32"
          />
          <Text className="text-lg">나만의 여행 일기를 작성해보세요!</Text>
        </View>
      )}

      <BottomSheet
        index={-1}
        snapPoints={SNAP_POINTS}
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        onChange={handleSheetChanges}
      >
        <BottomSheetView className="px-6">
          <Pressable
            onPress={handleDeleteDiary}
            className="flex-row items-center w-full px-4 py-3 bg-gray-100 rounded gap-x-2"
          >
            <Feather name="trash-2" size={20} color="#ef4444" />
            <Text className="w-full text-lg font-semibold text-red-500">
              삭제
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
