import { ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

const withAndroidPlugin: ConfigPlugin = (config) => {
  // Get AdMob App ID from environment variable
  const adID = process.env.ADMOB_APP_ID || '';

  return withAndroidManifest(config, (config) => {
    const mainApplication = config?.modResults?.manifest?.application?.[0];

    // Only add the AdMob App ID if it's configured
    if (mainApplication && adID) {
      // Ensure meta-data array exists
      if (!mainApplication['meta-data']) {
        mainApplication['meta-data'] = [];
      }

      // Add the AdMob App ID as a meta-data entry
      mainApplication['meta-data'].push({
        $: {
          'android:name': 'com.google.android.gms.ads.APPLICATION_ID',
          'android:value': adID
        }
      });
    }

    return config;
  });
};

export default withAndroidPlugin;
