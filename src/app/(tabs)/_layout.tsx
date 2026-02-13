import BottomAppBar from '@/components/ui/layout/BottomAppBar';
import ResponsiveContainer from '@/components/ui/layout/ResponsiveContainer';
import { BREAKPOINTS } from '@/constants/breakpoints';
import { Slot } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const showTabBar = width <= BREAKPOINTS.lg;

  return (
    <View style={{ flex: 1 }}>
      <ResponsiveContainer>
        <Slot />
      </ResponsiveContainer>
      {showTabBar && <BottomAppBar />}
    </View>
  );
}
