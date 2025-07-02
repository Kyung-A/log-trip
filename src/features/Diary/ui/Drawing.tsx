import { Dimensions, PanResponder, Pressable, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Canvas,
  Path,
  Skia,
  SkPath,
  useCanvasRef,
} from "@shopify/react-native-skia";
import Fontisto from "react-native-vector-icons/Fontisto";

type ColoredPath = {
  path: SkPath;
  color: string;
};

const COLORS = {
  red: "#ef4444",
  yellow: "#facc15",
  orange: "#fb923c",
  green: "#15803d",
  blue: "#3b82f6",
  purple: "#a855f7",
  pink: "#ec4899",
  gray: "#78716c",
  black: "#000",
};

export default function Drawing() {
  const canvasRef = useCanvasRef();
  const currentPath = useRef<SkPath>(Skia.Path.Make());
  const currentColor = useRef<string>(COLORS.black);
  const [paths, setPaths] = useState<ColoredPath[]>([]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        currentPath.current = Skia.Path.Make();
        currentPath.current.moveTo(locationX, locationY);
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        currentPath.current.lineTo(locationX, locationY);
      },
      onPanResponderRelease: () => {
        setPaths((prev) => [
          ...prev,
          { path: currentPath.current.copy(), color: currentColor.current },
        ]);
      },
    })
  ).current;

  const handleChangeColor = (color: string) => {
    currentColor.current = color;
  };

  return (
    <View
      className="absolute top-0 left-0 flex-1 bg-white"
      {...panResponder.panHandlers}
    >
      <Canvas
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height - 250,
        }}
        ref={canvasRef}
      >
        {paths.map((p, index) => (
          <Path
            key={`draw-${index}`}
            path={p.path}
            color={p.color}
            style="stroke"
            strokeWidth={3}
          />
        ))}
        <Path
          path={currentPath.current}
          color={currentColor.current}
          style="stroke"
          strokeWidth={3}
        />
      </Canvas>

      <View className="flex flex-row items-end w-full px-4 gap-x-2">
        {Object.entries(COLORS).map(([key, color]) => (
          <Pressable
            key={key}
            onPress={() => handleChangeColor(color)}
            style={{ backgroundColor: color }}
            className="w-8 h-8 rounded-full"
          />
        ))}
        <Pressable className="flex flex-col items-center justify-center ml-auto border-2 border-white rounded-full shadow w-14 h-14 bg-rose-400">
          <Fontisto name="plus-a" size={30} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
