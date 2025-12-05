import { Tabs } from "expo-router";
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
} from "react-native";

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
                  top: layout.y - 90,
                  left: layout.x - 18,
                  padding: 16,
                  backgroundColor: "#d5b2a8",
                  borderRadius: 8,
                  elevation: 5,
                  boxShadow: "0px 0px 20px -2px rgba(0,0,0,0.20)",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: 43,
                    width: 12,
                    height: 12,
                    backgroundColor: "#d5b2a8",
                    transform: [{ rotate: "45deg" }],
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
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
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                  }}
                  style={{ marginTop: 10 }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    동행 모집
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 80,
          paddingLeft: 14,
          paddingRight: 14,
          overflow: "visible",
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === "index") {
            return (
              <Ionicons
                name="map"
                size={19}
                color={focused ? "#a38f86" : "#A9A9A9"}
              />
            );
          } else if (route.name === "explore") {
            return (
              <Ionicons
                name="people"
                size={20}
                color={focused ? "#a38f86" : "#A9A9A9"}
              />
            );
          } else if (route.name === "(diary)/index") {
            return (
              <FontAwesome
                name="suitcase"
                size={18}
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
        name="(diary)/index"
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
      <Tabs.Screen
        name="explore"
        options={{
          title: "동행",
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
