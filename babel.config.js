module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@api': './src/api',
          '@assets': './src/assets',
          '@components': './src/components',
          '@config': './src/config',
          '@constants': './src/constants',
          '@theme': './src/theme',
          '@features': './src/features',
          '@hooks': './src/hooks',
          '@i18n': './src/i18n',
          '@api': './src/api',
          '@navigation': './src/navigation',
          '@store': './src/store',
          '@domain': './src/types',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
