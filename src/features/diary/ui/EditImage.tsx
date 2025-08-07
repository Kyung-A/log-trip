import React from "react";
import { Pressable, View, Image, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Canvas, Image as SkImage } from "@shopify/react-native-skia";

const FRAMES = {
  frame1: require("../../../../assets/frame/frame1.png"),
  frame2: require("../../../../assets/frame/frame2.png"),
  frame3: require("../../../../assets/frame/frame3.png"),
};

export default function EditImage({
  canvasRef,
  editImage,
  frameImg,
  setFrameImage,
  handleCloseEditMode,
  handleSaveEditMode,
}) {
  return (
    <View className="absolute top-0 left-0 z-40 flex flex-col items-center w-full h-full pt-40 bg-black gap-y-20">
      <View className="absolute z-50 flex-row justify-between w-full px-4 top-24">
        <Pressable onPress={handleCloseEditMode} className="w-16 h-16">
          <Ionicons name="close" size={30} color="#fff" />
        </Pressable>
        <Button title="완료" onPress={handleSaveEditMode} />
      </View>

      <Canvas
        pointerEvents="none"
        style={{
          width: 350,
          height: 350,
          overflow: "hidden",
        }}
        ref={canvasRef}
      >
        <SkImage
          image={editImage}
          x={0}
          y={0}
          width={350}
          height={350}
          fit="cover"
        />
        <SkImage
          image={frameImg}
          x={0}
          y={0}
          width={350}
          height={350}
          fit="cover"
        />
      </Canvas>

      <View className="flex flex-row items-center gap-x-3">
        {Object.entries(FRAMES).map(([key, value]) => (
          <Pressable
            onPress={() => setFrameImage(value)}
            key={key}
            className="block w-20 h-20"
          >
            <Image source={value} className="w-full h-full object-fit" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
