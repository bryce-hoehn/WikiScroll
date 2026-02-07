// https://medium.com/@alessandro.orlich_17521/how-i-manage-signing-configs-with-expo-prebuild-6ea6b7576dff
import { withAppBuildGradle } from '@expo/config-plugins';
import { ExpoConfig } from 'expo/config';

module.exports = function withAndroidSigningConfig(
  config: ExpoConfig,
  signingConfig: {
    storeFile: string;
    storePassword: string;
    keyAlias: string;
    keyPassword: string;
  }
) {
  const releaseBlock = `
        release {
          storeFile file('${signingConfig.storeFile}')
          storePassword '${signingConfig.storePassword}'
          keyAlias '${signingConfig.keyAlias}'
          keyPassword '${signingConfig.keyPassword}'
        }`;
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /signingConfigs \{([\s\S]*?)\}/, // Modify existing signingConfigs without removing debug
      (match) => {
        if (/release \{/.test(match)) {
          return match.replace(/release \{([\s\S]*?)\}/, releaseBlock);
        }
        return match.trim() + releaseBlock;
      }
    );

    config.modResults.contents = config.modResults.contents.replace(
      /buildTypes \{([\s\S]*?)release \{([\s\S]*?)signingConfig signingConfigs\.debug/, // Ensure release config uses signingConfigs.release
      `buildTypes { $1release { $2signingConfig signingConfigs.release`
    );

    return config;
  });
};
