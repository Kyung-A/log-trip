import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  findNodeHandle,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function ComposeTabButton() {
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
    if (handle) {
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        setLayout({ x: pageX, y: pageY, width, height });
        setVisible(true);
      });
    }
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
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }}>
            {layout && (
              <View style={modalStyle}>
                <View style={arrowStyle} />
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                    router.navigate("/createDiary");
                  }}
                >
                  <Text style={textStyle}>일기 쓰기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                    router.navigate("/createPlan");
                  }}
                >
                  <Text style={textStyle}>여행 일정</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const modalStyle: any = {
  position: "absolute",
  left: SCREEN_WIDTH / 2,
  bottom: 112,
  width: 92,
  transform: [{ translateX: -(92 / 2) }],
  backgroundColor: "#d5b2a8",
  borderRadius: 8,
  elevation: 5,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 20,
  paddingVertical: 4,
};
const arrowStyle: any = {
  position: "absolute",
  bottom: -6,
  left: "50%",
  marginLeft: -6,
  width: 12,
  height: 12,
  backgroundColor: "#d5b2a8",
  transform: [{ rotate: "45deg" }],
};
const textStyle: any = {
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
  color: "#fff",
  paddingVertical: 8,
};
