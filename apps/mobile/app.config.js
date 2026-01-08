export default ({ config }) => ({
  expo: {
    name: "logtrip",
    slug: "mobile",
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: process.env.EXPO_PUBLIC_SERVICE_URL_SCHEME,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      usesAppleSignIn: true,
      bundleIdentifier: process.env.EXPO_PUBLIC_SERVICE_URL_SCHEME,
      buildNumber: "14",
      infoPlist: {
        CFBundleDisplayName: "로그트립",
        CFBundleName: "로그트립",
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              `kakao${process.env.EXPO_PUBLIC_KAKAO_API_KEY}`,
            ],
          },
        ],
        LSApplicationQueriesSchemes: [
          "kakaokompassauth",
          "storykompassauth",
          "kakaolink",
        ],
      },
    },
    android: {
      package: process.env.EXPO_PUBLIC_SERVICE_URL_SCHEME,
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "@react-native-seoul/naver-login",
        {
          urlScheme: process.env.EXPO_PUBLIC_SERVICE_URL_SCHEME,
        },
      ],
      [
        "@react-native-seoul/kakao-login",
        {
          kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_API_KEY,
          kotlinVersion: "1.9.0",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
});
