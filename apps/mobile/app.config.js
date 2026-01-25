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
      buildNumber: "21",
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
        NSCameraUsageDescription:
          "사용자의 프로필 이미지 설정 및 일기 내 사진 첨부를 위해 카메라를 사용합니다. (예: 일기 작성 시 오늘 먹은 음식 사진 촬영)",
        NSPhotoLibraryUsageDescription:
          "작성한 일기 이미지나 수정된 프로필 사진을 사용자의 앨범에 저장하기 위해 권한이 필요합니다. (예: 일기에 사용된 이미지 다운로드)",
        NSPhotoLibraryAddUsageDescription:
          "앨범에 저장된 사진을 불러와 프로필을 설정하거나 일기에 첨부하기 위해 접근 권한이 필요합니다. (예: 과거 여행 사진을 일기에 업로드)",
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
