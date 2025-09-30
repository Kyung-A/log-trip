import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: '로그트립',
  slug: 'my-trip-app',
  version: '1.0.0',
  extra: {
    ...(config.extra || {}),
    eas: {
      projectId: '38f4faa5-a17e-42f1-a9d8-2a7a74daeb9e',
    },
  },
  scheme: 'com.nek777.mytripapp',
  ios: {
    usesAppleSignIn: true,
    bundleIdentifier: 'com.nek777.mytripapp',
    infoPlist: {
      NSCameraUsageDescription:
        '프로필 사진을 촬영하기 위해 카메라 접근이 필요합니다.',
      NSPhotoLibraryUsageDescription:
        '사진을 선택하기 위해 갤러리 접근이 필요합니다.',
    },
  },
  android: {
    package: 'com.nek777.mytripapp',
  },
  plugins: [
    ['expo-apple-authentication'],
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsDownloadToken: process.env.MAPBOX_KEY,
      },
    ],
    ['@react-native-seoul/naver-login', { urlScheme: 'com.nek777.mytripapp' }],
    [
      '@react-native-seoul/kakao-login',
      { kakaoAppKey: process.env.KAKAO_APP_KEY, kotlinVersion: '1.9.0' },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F2EEEC',
        image: './assets/images/logo.png',
        imageWidth: 250,
        resizeMode: 'contain',
      },
    ],
  ],
});
