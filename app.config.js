import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: 'my-trip-app',
  slug: 'my-trip-app',
  version: '1.0.0',
  ios: {
    bundleIdentifier: 'com.nek777.mytripapp',
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },

  android: {
    package: 'com.nek777.mytripapp',
  },

  plugins: [
    [
      'react-native-maps',
      {
        iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    ],
  ],
});