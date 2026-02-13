import { LAYOUT } from '@/constants/layout';
import { SPACING } from '@/constants/spacing';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Href, Route, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';
import { List, useTheme } from 'react-native-paper';

// Define a type for navigation items to ensure type safety
type NavItem = {
  route: Href;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function NavDrawer() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname === route;
  };

  const navItems: NavItem[] = [
    { route: '/', label: 'Home', icon: 'home' },
    { route: '/categories', label: 'Categories', icon: 'shape' },
    { route: '/discover', label: 'Discover', icon: 'compass' },
    { route: '/bookmarks', label: 'Bookmarks', icon: 'bookmark' },
    { route: '/settings', label: 'Settings', icon: 'cog' }
  ];

  return (
    <View
      style={{
        width: LAYOUT.DRAWER_WIDTH,
        paddingTop: 100
      }}
    >
      {navItems.map((item, index) => (
        <List.Item
          key={item.route as Route}
          title={item.label}
          style={{ marginLeft: SPACING.xl, marginRight: SPACING.lg }}
          titleStyle={{ fontSize: 24 }}
          left={(props) => {
            const iconColor = isActive(item.route as Route)
              ? theme.colors.primary
              : theme.colors.onSurfaceVariant;
            return (
              <MaterialCommunityIcons
                {...props}
                size={32}
                name={item.icon}
                color={iconColor}
              />
            );
          }}
          onPress={() => router.push(item.route)}
        />
      ))}
    </View>
  );
}
