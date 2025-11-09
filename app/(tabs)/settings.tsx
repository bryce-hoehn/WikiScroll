import { PreferencesContext } from '@/context/PreferencesContext';
import { useVisitedArticles } from '@/hooks';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Appbar, Button, Card, Divider, Switch, Text, useTheme } from 'react-native-paper';

export default function SettingsScreen() {
  const theme = useTheme();
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
  const { clearVisitedArticles, visitedArticles } = useVisitedArticles();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetReadingHistory = () => {
    Alert.alert(
      'Reset Reading History',
      'Are you sure you want to clear your reading history? This action cannot be undone and will affect your personalized recommendations.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await clearVisitedArticles();
              Alert.alert(
                'Success',
                'Your reading history has been cleared successfully.',
                [{ text: 'OK' }]
              );
            } catch {
              Alert.alert(
                'Error',
                'Failed to clear reading history. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsResetting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      {/* App Bar */}
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.surface,
        }}
        mode='center-aligned'
      >
        <Appbar.Content
          title="Settings"
          titleStyle={{
            fontWeight: '700',
            fontSize: 20,
            color: theme.colors.onSurface,
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          alignItems: 'center',
        }}
      >
        {/* App Settings Section */}
        <Card style={{ 
          width: '100%', 
          maxWidth: 400,
          marginBottom: 16,
          borderRadius: 12, 
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Card.Content style={{ padding: 0 }}>
            <View style={{ padding: 16, paddingBottom: 8 }}>
              <Text variant="titleMedium" style={{ fontWeight: '600', marginBottom: 4 }}>
                App Settings
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Customize your Wikipedia Expo experience
              </Text>
            </View>
            
            <Divider style={{ marginHorizontal: 16 }} />
            
            <View style={{ padding: 16 }}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                paddingVertical: 8
              }}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium" style={{ fontWeight: '500' }}>
                    Dark Mode
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                    Switch between light and dark themes
                  </Text>
                </View>
                <Switch 
                  value={isThemeDark} 
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
                  thumbColor={isThemeDark ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Data Management Section */}
        <Card style={{ 
          width: '100%', 
          maxWidth: 400,
          borderRadius: 12, 
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Card.Content style={{ padding: 0 }}>
            <View style={{ padding: 16, paddingBottom: 8 }}>
              <Text variant="titleMedium" style={{ fontWeight: '600', marginBottom: 4 }}>
                Data Management
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Manage your app data and privacy
              </Text>
            </View>
            
            <Divider style={{ marginHorizontal: 16 }} />
            
            <View style={{ padding: 16 }}>
              <View style={{ marginBottom: 16 }}>
                <Text variant="bodyMedium" style={{ fontWeight: '500', marginBottom: 4 }}>
                  Reading History
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
                  {visitedArticles.length} articles in your history
                </Text>
                <Button
                  mode="outlined"
                  onPress={handleResetReadingHistory}
                  disabled={isResetting || visitedArticles.length === 0}
                  loading={isResetting}
                  style={{ borderRadius: 8 }}
                  textColor={theme.colors.error}
                  icon="delete"
                >
                  {isResetting ? 'Resetting...' : 'Clear Reading History'}
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* App Information Section */}
        <Card style={{ 
          width: '100%', 
          maxWidth: 400,
          marginTop: 16,
          borderRadius: 12, 
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Card.Content style={{ padding: 0 }}>
            <View style={{ padding: 16, paddingBottom: 8 }}>
              <Text variant="titleMedium" style={{ fontWeight: '600', marginBottom: 4 }}>
                About Wikipedia Expo
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Explore Wikipedia in a beautiful, modern interface
              </Text>
            </View>
            
            <Divider style={{ marginHorizontal: 16 }} />
            
            <View style={{ padding: 16 }}>
              <View style={{ marginBottom: 12 }}>
                <Text variant="bodySmall" style={{ fontWeight: '500', marginBottom: 2 }}>
                  Version
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  1.0.0
                </Text>
              </View>
              
              <View>
                <Text variant="bodySmall" style={{ fontWeight: '500', marginBottom: 2 }}>
                  Data Privacy
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 18 }}>
                  Your reading history is stored locally on your device and is never shared with external servers.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
}
