import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavItem {
  name: string;
  title: string;
  icon: string;
  iconSet: 'material' | 'material-community';
  route: string;
}

const navItems: NavItem[] = [
  {
    name: 'home',
    title: 'Home',
    icon: 'home',
    iconSet: 'material-community',
    route: '/(tabs)'
  },
  {
    name: 'categories',
    title: 'Categories',
    icon: 'category',
    iconSet: 'material',
    route: '/(tabs)/categories'
  },
  {
    name: 'search',
    title: 'Search',
    icon: 'magnify',
    iconSet: 'material-community',
    route: '/(tabs)/search'
  },
  {
    name: 'bookmarks',
    title: 'Bookmarks',
    icon: 'bookmark',
    iconSet: 'material-community',
    route: '/(tabs)/bookmarks'
  },
  {
    name: 'settings',
    title: 'Settings',
    icon: 'cog',
    iconSet: 'material-community',
    route: '/(tabs)/settings'
  }
];

interface CustomBottomNavProps {
  currentRoute?: string;
}

export default function CustomBottomNav({ currentRoute }: CustomBottomNavProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleNavPress = (route: any) => {
    if (route === '/(tabs)') {
      router.replace(route);
    } else {
      router.push(route);
    }
  };

  const isActive = (route: string) => {
    if (route === '/(tabs)' && currentRoute === '/') {
      return true;
    }
    return currentRoute?.startsWith(route);
  };

  return (
    <View style={[styles.container, {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.outline,
      paddingBottom: insets.bottom,
      height: 60 + insets.bottom
    }]}>
      {navItems.map((item) => {
        const active = isActive(item.route);
        const color = active ? theme.colors.primary : theme.colors.onSurfaceVariant;
        
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => handleNavPress(item.route)}
          >
            {item.iconSet === 'material' ? (
              <MaterialIcons
                name={item.icon as any}
                size={24}
                color={color}
              />
            ) : (
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={color}
              />
            )}
            <Text
              variant="labelSmall"
              style={[styles.label, { color }]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    marginTop: 4,
    fontSize: 10,
  },
});