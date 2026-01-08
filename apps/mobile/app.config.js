export default ({ config }) => ({
  ...config,
  expo: {
    name: "logtrip",
    slug: "mobile",
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: process.env.EXPO_PUBLIC_SERVICE_URL_SCHEME,
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    ios: {
      supportsTablet: true,
      usesAppleSignIn: true,
      // bundleIdentifier: process.env.EXPO_PUBLIC_SERVICE_URL_SCHEME,
      bundleIdentifier: "com.nek777.mytripapp",
      buildNumber: "10",
      infoPlist: {
        CFBundleDisplayName: "로그트립",
        CFBundleName: "로그트립",
        UIApplicationSceneManifest: {
          UIApplicationSupportsMultipleScenes: false,
          UISceneConfigurations: {},
        },
        ITSAppUsesNonExemptEncryption: false,
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
      "expo-font",
      "expo-secure-store",
      "expo-web-browser",
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
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: "90f89366-a47b-40be-aa4f-55216964efd1",
      },
    },
  },
});
