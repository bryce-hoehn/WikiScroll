import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

const withIosPlugin: ConfigPlugin = (config) => {
  // Get AdMob App ID from environment variable
  const adID = process.env.ADMOB_APP_ID || '';

  return withInfoPlist(config, (config) => {
    // Only add the AdMob App ID if it's configured
    if (adID) {
      config.modResults.GADApplicationIdentifier = adID;
    }
    return config;
  });
};

export default withIosPlugin;
