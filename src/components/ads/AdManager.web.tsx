import { View, ViewStyle } from 'react-native';

interface AdManagerProps {
  style?: ViewStyle;
}

// Web Ad Component (AdSense)
const AdManager = ({ style }: AdManagerProps) => {
  const adSlot = __DEV__ ? '' : '2849483324';
  const adClient = __DEV__ ? '' : 'ca-pub-5306494001256992';
  const adLayoutKey = __DEV__ ? '' : '-fb+5w+4e-db+86';

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: 90,
          width: '100%'
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="fluid"
        data-ad-layout-key={adLayoutKey}
      />
    </View>
  );
};

export default AdManager;
