export default ({ config }) => ({
  expo: {
    name: "logtrip",
    slug: "mobile",
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "com.nek777.mytripapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      usesAppleSignIn: true,
      bundleIdentifier: "com.nek777.mytripapp",
      buildNumber: "17",
      infoPlist: {
        CFBundleDisplayName: "로그트립",
        CFBundleName: "로그트립",
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: ["com.nek777.mytripapp"],
          },
          {
            CFBundleTypeRole: "Editor",
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
        NSCameraUsageDescription: "사진 촬영을 위해 카메라 권한이 필요합니다.",
        NSPhotoLibraryUsageDescription:
          "사진 업로드를 위해 앨범 접근 권한이 필요합니다.",
        NSPhotoLibraryAddUsageDescription:
          "사진 저장을 위해 앨범 접근 권한이 필요합니다.",
      },
    },
    android: {
      package: "com.nek777.mytripapp",
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
