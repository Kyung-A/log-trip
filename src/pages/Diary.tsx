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
            <View key={v.id} className="w-full h-auto mb-3 bg-white">
              <View className="flex-row items-center p-4 gap-x-2">
                <View className="rounded-full w-14 h-14 bg-slate-200"></View>
                <Text>{v.username}</Text>
              </View>

              <Swiper
                key="my"
                loop
                controlsEnabled={false}
                containerStyle={{
                  width: "100%",
                  height: 350,
                }}
              >
                {v.images.map((img) => (
                  <Image
                    key={img}
                    source={{ uri: img }}
                    resizeMode="cover"
                    className="w-full h-full mx-auto"
                  />
                ))}
              </Swiper>

              <View className="flex-col px-4 my-3 gap-y-3">
                <View className="flex-row gap-x-4">
                  {v.cities.map((v) => (
                    <View
                      key={v.name}
                      className="px-2 py-1 bg-gray-100 rounded-md"
                    >
                      <Text className="text-base">{v.name}</Text>
                      <Text className="-mt-0.5 text-sm text-gray-600">
                        {v.countryName}
                      </Text>
                    </View>
                  ))}
                </View>
                <View className="flex-row items-center gap-x-2">
                  <Ionicons name="calendar-outline" size={18} color="#4b5563" />
                  <Text className="text-base text-gray-600">
                    {v.travelDate}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").height - 370,
                }}
              >
                <Image
                  source={require("../../assets/test.png")}
                  resizeMode="cover"
                  className="w-full h-full"
                />
              </View>
            </View>
          ) : (
            <View key={v.id} className="w-full h-auto mb-2 bg-white">
              <View className="flex-row items-center p-4 gap-x-2">
                <View className="rounded-full w-14 h-14 bg-slate-200"></View>
                <Text>{v.username}</Text>
              </View>

              <Swiper
                key="my"
                loop
                controlsEnabled={false}
                containerStyle={{
                  width: "100%",
                  height: 350,
                }}
              >
                {v.images.map((img) => (
                  <Image
                    key={img}
                    source={{ uri: img }}
                    resizeMode="cover"
                    className="w-full h-full mx-auto"
                  />
                ))}
              </Swiper>

              <View className="flex-col px-4 my-3 gap-y-3">
                <Text className="text-xl font-semibold">{v.title}</Text>

                <View className="flex-row gap-x-4">
                  {v.cities.map((v) => (
                    <View
                      key={v.name}
                      className="px-2 py-1 bg-gray-100 rounded-md"
                    >
                      <Text className="text-base">{v.name}</Text>
                      <Text className="-mt-0.5 text-sm text-gray-600">
                        {v.countryName}
                      </Text>
                    </View>
                  ))}
                </View>

                <View className="flex-row items-center gap-x-2">
                  <Ionicons name="calendar-outline" size={18} color="#4b5563" />
                  <Text className="text-base text-gray-600">
                    {v.travelDate}
                  </Text>
                </View>

                <Text>{v.content}</Text>
              </View>
            </View>
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
