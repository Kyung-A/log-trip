import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@/pages/Home";
import DiaryScreen from "@/pages/Diary";

const Tab = createBottomTabNavigator();

export default function TabBar() {
  return (
    <Tab.Navigator id={undefined}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Diary" component={DiaryScreen} />
    </Tab.Navigator>
  );
}
