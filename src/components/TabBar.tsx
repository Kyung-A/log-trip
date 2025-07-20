import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@/pages/Home";
import DiaryScreen from "@/pages/Diary";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { View } from "react-native";
import DummyScreen from "@/pages/Dummy";
import MyPageScreen from "@/pages/MyPage";
import CompanionScreen from "@/pages/Companion";
import LoginScreen from "@/pages/Login";

const Tab = createBottomTabNavigator();

export default function TabBar() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 80,
          overflow: "visible",
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === "세계지도") {
            return (
              <Ionicons
                name="map"
                size={20}
                color={focused ? "#a38f86" : "#A9A9A9"}
              />
            );
          } else if (route.name === "동행") {
            return (
              <Ionicons
                name="people"
                size={20}
                color={focused ? "#a38f86" : "#A9A9A9"}
              />
            );
          } else if (route.name === "내여행") {
            return (
              <FontAwesome5
                name="suitcase"
                size={20}
                color={focused ? "#a38f86" : "#A9A9A9"}
              />
            );
          } else if (route.name === "마이페이지") {
            return (
              <Ionicons
                name="person"
                size={20}
                color={focused ? "#a38f86" : "#A9A9A9"}
              />
            );
          }
        },
        tabBarActiveTintColor: "#a38f86",
        tabBarInactiveTintColor: "#A9A9A9",
      })}
    >
      <Tab.Screen name="세계지도" component={HomeScreen} />
      <Tab.Screen name="동행" component={LoginScreen} />
      <Tab.Screen
        name="글쓰기"
        component={DummyScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <View
              style={{
                width: 60,
                position: "absolute",
                top: -20,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              }}
            >
              <Ionicons name="add-circle" size={60} color="#d5b2a8" />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            (e as unknown as { preventDefault: () => void }).preventDefault();
            navigation.navigate("DiaryCreate");
          },
        })}
      />
      <Tab.Screen name="내여행" component={DiaryScreen} />
      <Tab.Screen name="마이페이지" component={MyPageScreen} />
    </Tab.Navigator>
  );
}
