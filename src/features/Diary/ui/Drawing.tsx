import { Dimensions, PanResponder, Pressable, View } from "react-native";
import React, { useRef, useState } from "react";
import {
  Canvas,
  Path,
  Skia,
  SkPath,
  useCanvasRef,
} from "@shopify/react-native-skia";

export default function Drawing() {
  const canvasRef = useCanvasRef();
  const currentPath = useRef(Skia.Path.Make());
  const [paths, setPaths] = useState<SkPath[]>([]);

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
        setPaths((prev) => [...prev, currentPath.current.copy()]);
      },
    })
  ).current;

  return (
    <View
      className="absolute top-0 left-0 flex-1 bg-red-500"
      {...panResponder.panHandlers}
    >
      <Canvas
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height - 100,
        }}
        ref={canvasRef}
      >
        {paths.map((path, index) => (
          <Path
            key={index}
            path={path}
            color="black"
            style="stroke"
            strokeWidth={3}
          />
        ))}
        <Path
          path={currentPath.current}
          color="black"
          style="stroke"
          strokeWidth={3}
        />
      </Canvas>

      <Pressable className="w-6 h-6 border rounded-full" />
    </View>
  );
}
