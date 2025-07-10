import {
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import Swiper from "react-native-web-swiper";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { DrawingiContentPost, TextContentPost } from "@/features/Diary/ui";

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

export default function DiaryScreen({ navigation }) {
  return (
    <>
      <ScrollView className="bg-[#eaeaea]">
        {MOCK_DATA.map((v) =>
          v.isDrawing ? (
            <DrawingiContentPost data={v} />
          ) : (
            <TextContentPost data={v} />
          )
        )}
      </ScrollView>

      <Pressable
        onPress={() => navigation.navigate("DiaryCreate")}
        className="absolute flex flex-col items-center justify-center bg-black rounded-full shadow right-3 bottom-3 w-14 h-14"
      >
        <Fontisto name="plus-a" size={30} color="#fff" />
      </Pressable>
    </>
  );
}
