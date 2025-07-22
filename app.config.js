import "dotenv/config";

export default ({ config }) => ({
  ...config,
  name: "my-trip-app",
  slug: "my-trip-app",
  version: "1.0.0",
  scheme: "com.nek777.mytripapp",
  ios: {
    bundleIdentifier: "com.nek777.mytripapp",
    infoPlist: {
      NSCameraUsageDescription:
        "프로필 사진을 촬영하기 위해 카메라 접근이 필요합니다.",
      NSPhotoLibraryUsageDescription:
        "사진을 선택하기 위해 갤러리 접근이 필요합니다.",
    },
  },
  android: {
    package: "com.nek777.mytripapp",
  },
  plugins: [
    [
      "@rnmapbox/maps",
      {
        RNMapboxMapsDownloadToken: process.env.MAPBOX_KEY,
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#F2EEEC",
        image: "./assets/images/logo.png",
        imageWidth: 250,
        resizeMode: "contain",
      },
    ],
  ],
});
