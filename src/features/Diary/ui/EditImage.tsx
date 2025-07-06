import React from "react";
import { Pressable, View, Image } from "react-native";
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
}) {
  return (
    <View className="absolute top-0 left-0 z-10 flex flex-col items-center w-full h-full pt-20 bg-black gap-y-20">
      <Pressable
        onPress={handleCloseEditMode}
        className="absolute z-20 w-16 h-16 top-4 left-3"
      >
        <Ionicons name="close" size={30} color="#fff" />
      </Pressable>

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
