module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            'assets': './assets',
          }
        },
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
