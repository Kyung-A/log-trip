import { Pressable, ScrollView, View, Text } from "react-native";
import { DrawingiContentPost, TextContentPost } from "@/features/Diary/ui";
import Feather from "react-native-vector-icons/Feather";
import { useCallback, useRef } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const MOCK_DATA = [
  {
    id: 1,
    username: "홍길동",
    title: "",
    content: "",
    images: [
      "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
      "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
      "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
    ],
    drawingContent: "",
    cities: [
      { countryName: "일본", name: "홋카이도" },
      { countryName: "일본", name: "오사카" },
      { countryName: "일본", name: "교토" },
      { countryName: "베트남", name: "다낭" },
    ],
    isDrawing: true,
    createdAt: "2025-03-24 12:11:54",
    travelDate: "2025-03-24",
  },
  {
    id: 2,
    username: "홍길동",
    title: "",
    content: "",
    images: [],
    drawingContent: "",
    cities: [
      { countryName: "일본", name: "홋카이도" },
      { countryName: "일본", name: "오사카" },
      { countryName: "일본", name: "교토" },
      { countryName: "베트남", name: "다낭" },
    ],
    isDrawing: true,
    createdAt: "2025-03-24 12:11:54",
    travelDate: "2025-03-24",
  },
  {
    id: 3,
    username: "홍길동",
    title: "일본 여행기",
    content:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.\nIf you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.\n\n It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
    images: [
      "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
    ],
    drawingContent: "",
    cities: [{ countryName: "일본", name: "홋카이도" }],
    isDrawing: false,
    createdAt: "2025-03-24 12:11:54",
    travelDate: "2025-03-24",
  },
];

const SNAP_POINTS = ["15%"];

export default function DiaryScreen({ navigation }) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <>
      <ScrollView className="bg-[#eaeaea]">
        {MOCK_DATA.map((v) => (
          <View key={v.id} className="w-full h-auto mb-2 bg-white">
            <View className="flex-row items-center justify-between p-4">
              <Pressable
                onPress={() => navigation.navigate("마이페이지")}
                className="flex-row items-center gap-x-2"
              >
                <View className="rounded-full w-14 h-14 bg-slate-200"></View>
                <Text>{v.username}</Text>
              </Pressable>
              <Pressable onPress={() => bottomSheetRef.current?.expand()}>
                <Feather name="more-vertical" size={20} />
              </Pressable>
            </View>

            {v.isDrawing ? (
              <DrawingiContentPost data={v} />
            ) : (
              <TextContentPost data={v} />
            )}
          </View>
        ))}
      </ScrollView>

      <BottomSheet
        index={-1}
        snapPoints={SNAP_POINTS}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <BottomSheetView className="px-6">
          <Pressable
            onPress={() => console.log("삭제")}
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
