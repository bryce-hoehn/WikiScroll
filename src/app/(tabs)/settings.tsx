import { router } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Platform, ScrollView, View } from 'react-native';
import {
  Button,
  Divider,
  List,
  Menu,
  Modal,
  Portal,
  Switch,
  Text,
  useTheme
} from 'react-native-paper';

import { SPACING } from '@/constants/spacing';
import { useReducedMotion, useVisitedArticles } from '@/hooks';
import { useThemeContext } from '@/stores/ThemeProvider';
import { getAppVersion } from '@/utils/env';

export default function SettingsScreen() {
  const theme = useTheme();
  const { currentTheme, setTheme } = useThemeContext();
  const { visitedArticles } = useVisitedArticles();
  const { reducedMotion, setReducedMotion } = useReducedMotion();
  const [themeMenuVisible, setThemeMenuVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);

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
      <Portal>
        <Modal
          visible={helpVisible}
          onDismiss={() => setHelpVisible(false)}
          contentContainerStyle={{
            backgroundColor: theme.colors.surface,
            padding: SPACING.sm,
            margin: SPACING.sm,
            borderRadius: SPACING.sm
          }}
        >
          <Text
            variant="headlineSmall"
            style={{ marginBottom: SPACING.sm, fontWeight: '700' }}
          >
            Settings Help
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: SPACING.sm, lineHeight: 22 }}
          >
            <Text style={{ fontWeight: '600' }}>Theme:</Text> Choose your
            preferred color scheme. Automatic follows your system settings.
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: SPACING.sm, lineHeight: 22 }}
          >
            <Text style={{ fontWeight: '600' }}>Hide Sensitive Content:</Text>{' '}
            Blurs sensitive images using Wikipedia&apos;s official content
            filter.
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: SPACING.sm, lineHeight: 22 }}
          >
            <Text style={{ fontWeight: '600' }}>Reading Preferences:</Text>{' '}
            Customize your reading experience with line height, paragraph
            spacing, reading width, and font family settings.
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: SPACING.sm, lineHeight: 22 }}
          >
            <Text style={{ fontWeight: '600' }}>Reading History:</Text> View
            articles you&apos;ve recently read. Used for personalized
            recommendations. Access from the Reading section.
          </Text>
          <Button
            mode="contained"
            onPress={() => setHelpVisible(false)}
            style={{ marginTop: SPACING.sm }}
          >
            Got it
          </Button>
        </Modal>
      </Portal>

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

        {/* Accessibility Section */}
        <List.Section>
          <List.Subheader>Accessibility</List.Subheader>
          <List.Item
            title="Reduce Motion"
            description="Disable non-essential animations for a more static experience. Helps reduce motion sensitivity and improves performance."
            left={(props) => <List.Icon {...props} icon="motion-pause" />}
            right={() => (
              <Switch value={reducedMotion} onValueChange={setReducedMotion} />
            )}
            titleStyle={{ fontWeight: '500' }}
            descriptionNumberOfLines={2}
          />
        </List.Section>

        <Divider style={{ marginVertical: SPACING.sm }} />

        {/* Reading Preferences Section */}
        <List.Section>
          <List.Subheader>Reading</List.Subheader>
          <List.Item
            title="Reading Preferences"
            description="Customize line height, paragraph spacing, reading width, and font family"
            left={(props) => <List.Icon {...props} icon="book-open-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(tabs)/settings/reading-preferences')}
            titleStyle={{ fontWeight: '500' }}
            descriptionNumberOfLines={2}
          />
          <List.Item
            title="Reading History"
            description={`${visitedArticles.length} articles visited • View your recently read articles and browsing history`}
            left={(props) => <List.Icon {...props} icon="history" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(tabs)/settings/reading-history')}
            titleStyle={{ fontWeight: '500' }}
            descriptionNumberOfLines={2}
          />
        </List.Section>

        <Divider style={{ marginVertical: SPACING.sm }} />

        {/* App Information Section */}
        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Version"
            description={getAppVersion()}
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
