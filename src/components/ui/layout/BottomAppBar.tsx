import { Route, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

const tabs = [
  { name: 'index', route: '/', label: 'Home', icon: 'home' },
  {
    name: 'categories',
    route: '/categories',
    label: 'Categories',
    icon: 'shape'
  },
  {
    name: 'discover',
    route: '/discover',
    label: 'Discover',
    icon: 'compass',
    iconFamily: 'MaterialCommunityIcons'
  },
  {
    name: 'bookmarks',
    route: '/bookmarks',
    label: 'Bookmarks',
    icon: 'bookmark'
  },
  { name: 'settings', route: '/settings', label: 'Settings', icon: 'cog' }
];

export default function BottomAppBar() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname === route;
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.elevation.level2,
        flexDirection: 'row'
      }}
    >
      {tabs.map((tab) => {
        const active = isActive(tab.route);
        const iconColor = active
          ? theme.colors.primary
          : theme.colors.onSurfaceVariant;

        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            key={tab.name}
          >
            <IconButton
              icon={tab.icon}
              iconColor={iconColor}
              size={24}
              onPress={() => router.push(tab.route as Route)}
              style={{ margin: 0 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: iconColor
              }}
            >
              {tab.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
