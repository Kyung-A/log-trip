import { View, Dimensions, Image, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-web-swiper";

export default function DrawingiContentPost({ data }) {
  return (
    <>
      {data.images && data.images.length > 0 && (
        <Swiper
          key="my"
          loop
          containerStyle={{
            width: "100%",
            height: 350,
          }}
          controlsProps={{
            prevPos: false,
            nextPos: false,
            dotsTouchable: true,
            dotsPos: "bottom",
            dotActiveStyle: { backgroundColor: "#d5b2a7" },
          }}
        >
          {data.images.map((img) => (
            <Image
              key={img}
              source={{ uri: img }}
              resizeMode="cover"
              className="w-full h-full mx-auto"
            />
          ))}
        </Swiper>
      )}

      <View className="flex-col px-4 my-3 gap-y-3">
        <View className="flex-row gap-x-4">
          {data.cities.map((v) => (
            <View key={v.name} className="px-2 py-1 bg-gray-100 rounded-md">
              <Text className="text-base">{v.name}</Text>
              <Text className="-mt-0.5 text-sm text-gray-600">
                {v.countryName}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex-row items-center gap-x-2">
          <Ionicons name="calendar-outline" size={18} color="#4b5563" />
          <Text className="text-base text-gray-600">{data.travelDate}</Text>
        </View>
      </View>

      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height - 370,
        }}
      >
        <Image
          source={require("../../../../assets/test.png")}
          resizeMode="cover"
          className="w-full h-full"
        />
      </View>
    </>
  );
}
