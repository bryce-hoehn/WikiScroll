import { BREAKPOINTS } from '@/constants/breakpoints';
import { useWindowDimensions } from 'react-native';

export default function useMediaQuery():
  | 'compact'
  | 'medium'
  | 'expanded'
  | 'lg'
  | 'xl' {
  const { width } = useWindowDimensions();

  if (width < BREAKPOINTS.md) {
    return 'compact';
  } else if (width < BREAKPOINTS.lg) {
    return 'medium';
  } else if (width < BREAKPOINTS.lg) {
    return 'expanded';
  } else if (width < BREAKPOINTS.xl) {
    return 'lg';
  } else {
    return 'xl';
  }
}
