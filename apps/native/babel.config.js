module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo']],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: { '@': './src' },
          extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
        },
      ],
      [
        'module:react-native-dotenv',
        {
          envName: 'MAPBOX_KEY',
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
