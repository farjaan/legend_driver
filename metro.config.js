const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    resolveRequest(context, moduleName, platform) {
      if (
        moduleName === 'react-native' &&
        context.originModulePath.includes(
          `${path.sep}react-native-country-picker-modal${path.sep}`,
        )
      ) {
        return {
          filePath: path.resolve(__dirname, 'src/shims/countryPickerReactNative.js'),
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
