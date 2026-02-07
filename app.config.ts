import { ConfigContext, ExpoConfig } from '@expo/config';
import 'tsx/cjs';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'WikiScape',
  slug: 'wikiscape',
  version: '0.3.0',
  description:
    'A modern, cross-platform Wikipedia reader built with React Native and Expo.',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'wikiscape',
  primaryColor: '#000000',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  githubUrl: 'https://github.com/bryce-hoehn/WikiScape',
  android: {
    package: 'com.wikiscape.app',
    versionCode: 3,
    adaptiveIcon: {
      foregroundImage: './src/assets/images/icon.png',
      backgroundColor: '#ffffff'
    },
    permissions: ['RECORD_AUDIO', 'MODIFY_AUDIO_SETTINGS']
  },
  ios: {
    bundleIdentifier: 'com.wikiscape.app',
    buildNumber: '0.3.0'
  },
  web: {
    output: 'static',
    favicon: './src/assets/images/scroll.png',
    bundler: 'metro',
    name: 'WikiScape',
    shortName: 'WikiScape',
    lang: 'en',
    scope: '/',
    themeColor: '#000000',
    backgroundColor: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    startUrl: '/'
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './src/assets/images/icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000'
        }
      }
    ],
    [
      './plugins/withAndroidSigningConfig.ts',
      {
        storeFile: '../../release.keystore',
        keyAlias: process.env.ANDROID_KEY_ALIAS,
        storePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
        keyPassword: process.env.ANDROID_KEYSTORE_PASSWORD
      }
    ],
    'expo-web-browser',
    'expo-localization',
    'expo-font',
    'expo-asset',
    'expo-av',
    'expo-video'
  ],
  experiments: {
    typedRoutes: true
  },
  runtimeVersion: {
    policy: 'appVersion'
  },
  sdkVersion: '54.0.0'
});
