import { Tabs } from "expo-router";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ComposeTabButton, useTabBarVisibility } from "@/shared";

const TAB_ICONS: Record<string, any> = {
  index: { Lib: Ionicons, name: "map", size: 19 },
  diary: { Lib: FontAwesome, name: "suitcase", size: 18 },
  plan: { Lib: MaterialIcons, name: "schedule", size: 22 },
  mypage: { Lib: Ionicons, name: "person", size: 19 },
};

export default function TabLayout() {
  const { isTabBarVisible } = useTabBarVisibility();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          paddingHorizontal: 14,
          display: isTabBarVisible ? "flex" : "none",
        },
        headerShown: false,
        tabBarActiveTintColor: "#a38f86",
        tabBarInactiveTintColor: "#A9A9A9",
        tabBarIcon: ({ focused, color }) => {
          const icon = TAB_ICONS[route.name];
          if (!icon) return null;
          return <icon.Lib name={icon.name} size={icon.size} color={color} />;
        },
        tabBarButton: (props) =>
          route.name === "write" ? (
            <ComposeTabButton />
          ) : (
            <TouchableOpacity {...(props as TouchableOpacityProps)} />
          ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "세계지도" }} />
      <Tabs.Screen name="diary" options={{ title: "여행" }} />
      <Tabs.Screen name="write" options={{ tabBarLabel: "" }} />
      <Tabs.Screen name="plan" options={{ title: "일정" }} />
      <Tabs.Screen name="mypage" options={{ title: "마이페이지" }} />
    </Tabs>
  );
}
