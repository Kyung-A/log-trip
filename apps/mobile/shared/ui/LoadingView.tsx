import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Easing, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function LoadingView() {
  const animLeft = useRef(new Animated.Value(0.3)).current;
  const animRight = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createLoop = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.3,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    Animated.parallel([
      createLoop(animLeft, 0),
      createLoop(animRight, 700),
    ]).start();
  }, [animLeft, animRight]);

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#f2eeec",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <View style={{ width: 160, height: 160 }}>
        <Image
          source={require("@/assets/images/logo/logtrip-logo.png")}
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
        />
      </View>

      <View style={{ width: 60, height: 60 }}>
        <Svg viewBox="0 0 140 64">
          <AnimatedPath
            d="M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.717-6.002 11.47-7.65 17.305-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z"
            fill="#D5B2A8"
            fillOpacity={animLeft}
          />
          <AnimatedPath
            d="M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.592-2.32 17.307 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z"
            fill="#D5B2A8"
            fillOpacity={animRight}
          />
          <Path
            d="M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z"
            fill="#D5B2A8"
          />
        </Svg>
      </View>
    </View>
  );
}
