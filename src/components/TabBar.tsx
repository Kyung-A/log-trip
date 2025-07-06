import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/pages/Home";
import DiaryScreen from "@/pages/Diary";

const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

export default function TabBar() {
  return (
    <Tab.Navigator id={undefined}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Diary" component={DiaryScreen} />

      {/* <Stack.Screen
        name="WriteDiary"
        component={HomeScreen}
        options={{
          presentation: "modal", // iOS modal 스타일
          animation: "slide_from_bottom", // Android도 동일 애니메이션
          gestureEnabled: false, // 드래그 내려닫기 off
          headerShown: false, // 풀스크린이니 헤더 제거
        }}
      /> */}
    </Tab.Navigator>
  );
}
