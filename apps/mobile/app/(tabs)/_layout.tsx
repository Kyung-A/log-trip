import { router, Tabs } from "expo-router";
import React, { useRef, useState } from "react";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  Pressable,
  TouchableOpacity,
  View,
  Text,
  Modal,
  findNodeHandle,
  UIManager,
  TouchableWithoutFeedback,
  TouchableOpacityProps,
  Dimensions,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useTabBarVisibility } from "@/shared";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function ComposeTabButton() {
  const anchorRef = useRef(null);
  const [layout, setLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [visible, setVisible] = useState(false);

  const open = () => {
    const handle = findNodeHandle(anchorRef.current);

    if (!handle) return;

    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      setLayout({ x: pageX, y: pageY, width, height });
      setVisible(true);
    });
  };

  return (
    <>
      <Pressable
        ref={anchorRef}
        onPress={open}
        style={{
          position: "absolute",
          top: -20,
          alignSelf: "center",
          zIndex: 10,
        }}
      >
        <Ionicons name="add-circle" size={60} color="#d5b2a8" />
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          >
            {layout && (
              <View
                style={{
                  position: "absolute",
                  left: SCREEN_WIDTH / 2,
                  bottom: 112,
                  width: 92,
                  transform: [{ translateX: -(92 / 2) }],
                  paddingVertical: 14,
                  backgroundColor: "#d5b2a8",
                  borderRadius: 8,
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.2,
                  shadowRadius: 20,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: "50%",
                    marginLeft: -6,
                    width: 12,
                    height: 12,
                    backgroundColor: "#d5b2a8",
                    transform: [{ rotate: "45deg" }],
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                    router.push("/createDiary");
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    일기 쓰기
                  </Text>
                </TouchableOpacity>
                {/* // TODO: 추후 추가 예정 서비스
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                    router.push("/createCompanion");
                  }}
                  style={{ marginTop: 10 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    동행 모집
                  </Text>
                </TouchableOpacity> */}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

export default function TabLayout() {
  const { isTabBarVisible } = useTabBarVisibility();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          paddingLeft: 14,
          paddingRight: 14,
          paddingBottom: 0,
          display: isTabBarVisible ? "flex" : "none",
        },
        headerShown: false,
        contentStyle: {
          paddingTop: 0,
        },
        safeAreaInsets: { top: 0, bottom: 0 },
        tabBarIcon: ({ focused }) => {
          if (route.name === "index") {
            return (
              <Ionicons
                name="map"
                size={19}
                color={focused ? "#a38f86" : "#A9A9A9"}
              />
            );
          } else if (route.name === "companion") {
            // TODO: 추후 추가 예정 서비스
            return;
            // return (
            //   <Ionicons
            //     name="people"
            //     size={20}
            //     color={focused ? "#a38f86" : "#A9A9A9"}
            //   />
            // );
          } else if (route.name === "diary") {
            return (
              <FontAwesome
                name="suitcase"
                size={18}
                color={focused ? "#a38f86" : "#A9A9A9"}
              />
            );
          } else if (route.name === "publicDiary") {
            return (
              <Entypo
                name="slideshare"
                size={19}
                color={focused ? "#a38f86" : "#A9A9A9"}
              />
            );
          } else if (route.name === "mypage") {
            return (
              <Ionicons
                name="person"
                size={19}
                color={focused ? "#a38f86" : "#A9A9A9"}
              />
            );
          }
        },
        tabBarButton: (props) => {
          if (route.name === "write") {
            return <ComposeTabButton />;
          }

          return <TouchableOpacity {...(props as TouchableOpacityProps)} />;
        },
        tabBarActiveTintColor: "#a38f86",
        tabBarInactiveTintColor: "#A9A9A9",
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "세계지도",
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: "내여행",
        }}
      />

      <Tabs.Screen
        name="write"
        options={{
          tabBarLabel: "",
        }}
      />
      {/* // TODO: 추후 추가 예정 서비스
      <Tabs.Screen
        name="companion"
        options={{
          title: "동행",
        }}
      /> */}

      <Tabs.Screen
        name="publicDiary"
        options={{
          title: "일기숲",
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: "마이페이지",
        }}
      />
    </Tabs>
  );
}
