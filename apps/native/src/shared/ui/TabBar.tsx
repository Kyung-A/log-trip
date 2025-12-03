import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/pages/Home';
import DiaryScreen from '@/pages/Diary';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import DummyScreen from '@/pages/Dummy';
import MyPageScreen from '@/pages/MyPage';
import CompanionScreen from '@/pages/Companion';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

function ComposeTabButton() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <Popover
      from={
        <Pressable
          onPress={() => setVisible(true)}
          className="absolute z-10 self-center -top-5"
        >
          <Ionicons name="add-circle" size={60} color="#d5b2a8" />
        </Pressable>
      }
      popoverStyle={{ backgroundColor: '#d5b2a8', borderRadius: 6 }}
      backgroundStyle={{ backgroundColor: 'transparent' }}
      isVisible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View className="bg-[#d5b2a8] py-4 w-28">
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
            navigation.navigate('DiaryCreate');
          }}
        >
          <Text className="text-lg font-semibold text-center text-white">
            일기 쓰기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
            navigation.navigate('CompanionCreate');
          }}
          className="mt-2"
        >
          <Text className="text-lg font-semibold text-center text-white">
            동행 모집
          </Text>
        </TouchableOpacity>
      </View>
    </Popover>
  );
}

export default function TabBar() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 80,
          overflow: 'visible',
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === '세계지도') {
            return (
              <Ionicons
                name="map"
                size={19}
                color={focused ? '#a38f86' : '#A9A9A9'}
              />
            );
          } else if (route.name === '동행') {
            return (
              <Ionicons
                name="people"
                size={20}
                color={focused ? '#a38f86' : '#A9A9A9'}
              />
            );
          } else if (route.name === '내여행') {
            return (
              <FontAwesome
                name="suitcase"
                size={18}
                color={focused ? '#a38f86' : '#A9A9A9'}
              />
            );
          } else if (route.name === '마이페이지') {
            return (
              <Ionicons
                name="person"
                size={19}
                color={focused ? '#a38f86' : '#A9A9A9'}
              />
            );
          }
        },
        tabBarActiveTintColor: '#a38f86',
        tabBarInactiveTintColor: '#A9A9A9',
      })}
    >
      <Tab.Screen name="세계지도" component={HomeScreen} />
      <Tab.Screen name="동행" component={CompanionScreen} />
      <Tab.Screen
        name="글쓰기"
        component={DummyScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: props => <ComposeTabButton {...props} />,
        }}
      />
      <Tab.Screen name="내여행" component={DiaryScreen} />
      <Tab.Screen name="마이페이지" component={MyPageScreen} />
    </Tab.Navigator>
  );
}
