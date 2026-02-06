import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  MobileAds,
} from 'react-native-google-mobile-ads';

// Configure Ad Units for native platforms
const BANNER_AD_UNIT_ID: string = __DEV__
  ? 'ca-app-pub-3940256099942544/6300978111' // Test banner ad unit
  : process.env.ADMOB_BANNER_AD_UNIT_ID_IOS ||
    process.env.ADMOB_BANNER_AD_UNIT_ID_ANDROID ||
    process.env.ADMOB_BANNER_AD_UNIT_ID ||
    '';

interface NativeAdManagerProps {
  style?: ViewStyle;
}

const NativeAdManager = ({ style }: NativeAdManagerProps) => {
  useEffect(() => {
    // Initialize MobileAds
    MobileAds()
      .initialize()
      .then((adapterStatuses: any) => {
        console.log('AdMob Initialization complete', adapterStatuses);
      });
  }, []);

  return (
    <BannerAd
      unitId={BANNER_AD_UNIT_ID}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdLoaded={() => {
        console.log('Banner ad loaded');
      }}
      onAdFailedToLoad={(error: any) => {
        console.error('Banner ad failed to load', error);
      }}
    />
  );
};

export default NativeAdManager;
