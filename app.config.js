import "dotenv/config";

export default ({ config }) => ({
  ...config,
  name: "my-trip-app",
  slug: "my-trip-app",
  version: "1.0.0",
  ios: {
    bundleIdentifier: "com.nek777.mytripapp",
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
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
      "react-native-maps",
      {
        iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    ],
  ],
});
