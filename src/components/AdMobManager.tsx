import React, { Suspense, useEffect } from 'react';
import { Platform, Text, View, ViewStyle } from 'react-native';

interface AdMobManagerProps {
  style?: ViewStyle;
}

// Web Ad Component (AdSense)
const WebAdManager = ({ style }: AdMobManagerProps) => {
  const adSlot = process.env.ADSENSE_AD_SLOT || '';
  const adClient = process.env.ADSENSE_AD_CLIENT || '';
  const adLayoutKey = process.env.ADSENSE_AD_LAYOUT_KEY || '';

  useEffect(() => {
    // Load AdSense script if not already loaded
    if (typeof window !== 'undefined') {
      // Check if adsbygoogle is already loaded
      if (!(window as any).adsbygoogle) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Push ad to adsbygoogle array
      setTimeout(() => {
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        } catch (error) {
          console.error('Error pushing ad to adsbygoogle:', error);
        }
      }, 100);
    }
  }, [adClient]);

  if (!adClient || !adSlot) {
    // Show placeholder if no ad configuration
    return (
      <View
        style={[
          {
            height: 90,
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#e0e0e0',
          },
          style,
        ]}
      >
        <Text
          style={{
            color: '#999',
            fontSize: 12,
            fontWeight: '500',
          }}
        >
          Advertisement
        </Text>
      </View>
    );
  }

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: 90,
          width: '100%',
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="fluid"
        data-ad-layout-key={adLayoutKey}
      />
    </View>
  );
};

// Main AdMobManager component that selects the appropriate ad implementation
const AdMobManager = ({ style }: AdMobManagerProps) => {
  if (Platform.OS === 'web') {
    return <WebAdManager style={style} />;
  }

  // Lazy load native ad component to prevent web import errors
  const NativeAdManager = React.lazy(() =>
    import('./NativeAdManager').then((module) => ({
      default: module.default,
    })),
  );

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <Suspense fallback={<View style={{ height: 90 }} />}>
        <NativeAdManager style={style} />
      </Suspense>
    </View>
  );
};

export default AdMobManager;
