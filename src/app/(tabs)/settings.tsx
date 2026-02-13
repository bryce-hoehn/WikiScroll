import { SPACING } from '@/constants/spacing';
import { useThemeContext } from '@/stores/ThemeProvider';
import * as Application from 'expo-application';
import React, { useState } from 'react';
import { Linking, Platform, ScrollView, View } from 'react-native';
import { Divider, List, Menu } from 'react-native-paper';

export default function SettingsScreen() {
  const { currentTheme, setTheme } = useThemeContext();
  const [themeMenuVisible, setThemeMenuVisible] = useState(false);

  const themeOptions = [
    { label: 'Automatic', value: 'automatic' },
    { label: 'Light', value: 'light' },
    { label: 'Light Medium Contrast', value: 'light-medium-contrast' },
    { label: 'Light High Contrast', value: 'light-high-contrast' },
    { label: 'Dark', value: 'dark' },
    { label: 'Dark Medium Contrast', value: 'dark-medium-contrast' },
    { label: 'Dark High Contrast', value: 'dark-high-contrast' },
    { label: 'Papyrus', value: 'papyrus' }
  ];

  const getThemeDisplayName = (themeValue: string) => {
    const option = themeOptions.find((opt) => opt.value === themeValue);
    return option ? option.label : 'Automatic';
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          padding: SPACING.sm,
          paddingBottom: SPACING.sm,
          alignSelf: 'center',
          width: '100%'
        }}
      >
        {/* App Settings Section */}
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <Menu
            visible={themeMenuVisible}
            onDismiss={() => setThemeMenuVisible(false)}
            anchorPosition="bottom"
            anchor={
              <List.Item
                title="Theme"
                description={`${getThemeDisplayName(currentTheme)} • Choose light, dark, or automatic theme based on system settings`}
                left={(props) => <List.Icon {...props} icon="palette" />}
                right={(props) => <List.Icon {...props} icon="chevron-down" />}
                onPress={() => setThemeMenuVisible(true)}
                titleStyle={{ fontWeight: '500' }}
                descriptionNumberOfLines={2}
              />
            }
          >
            {themeOptions.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  setTheme(option.value as any);
                  setThemeMenuVisible(false);
                }}
                title={option.label}
                leadingIcon={
                  currentTheme === option.value ? 'check' : undefined
                }
              />
            ))}
          </Menu>
        </List.Section>

        <Divider style={{ marginVertical: SPACING.sm }} />

        {/* App Information Section */}
        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Version"
            description={Application.nativeApplicationVersion}
            left={(props) => (
              <List.Icon {...props} icon="information-outline" />
            )}
            titleStyle={{ fontWeight: '500' }}
          />
          <List.Item
            title="Report Bugs"
            description="Found a bug or have feedback? Report it on GitHub"
            left={(props) => <List.Icon {...props} icon="bug-outline" />}
            right={(props) => <List.Icon {...props} icon="open-in-new" />}
            onPress={() => {
              const url = 'https://github.com/bryce-hoehn/WikiScape/issues';
              if (Platform.OS === 'web') {
                window.open(url, '_blank', 'noopener,noreferrer');
              } else {
                Linking.openURL(url).catch((err: Error) => {
                  if (typeof __DEV__ !== 'undefined' && __DEV__) {
                    console.error('Failed to open GitHub issues:', err);
                  }
                });
              }
            }}
            titleStyle={{ fontWeight: '500' }}
            descriptionNumberOfLines={2}
          />
          <List.Item
            title="Data Privacy"
            description="Your reading history and bookmarks are stored locally on your device and never shared with external servers. All data remains private."
            left={(props) => (
              <List.Icon {...props} icon="shield-check-outline" />
            )}
            titleStyle={{ fontWeight: '500' }}
            descriptionNumberOfLines={3}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
}
