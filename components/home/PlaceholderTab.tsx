import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';

interface PlaceholderTabProps {
  title: string;
  description: string;
  icon: string;
}

export default function PlaceholderTab({ title, description, icon }: PlaceholderTabProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 40 
    }}>
      <View style={{ 
        width: 80, 
        height: 80, 
        borderRadius: 40,
        backgroundColor: theme.colors.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <IconButton
          icon={icon}
          iconColor={theme.colors.onSurfaceVariant}
          size={40}
          style={{ margin: 0 }}
        />
      </View>
      <Text variant="headlineSmall" style={{ 
        textAlign: 'center', 
        marginBottom: 16, 
        fontWeight: '700',
        color: theme.colors.onSurface
      }}>
        {title}
      </Text>
      <Text variant="bodyLarge" style={{ 
        textAlign: 'center', 
        marginBottom: 32, 
        color: theme.colors.onSurfaceVariant, 
        lineHeight: 24 
      }}>
        {description}
      </Text>
      <Button 
        mode="outlined" 
        onPress={() => router.push('/search')}
        style={{ 
          borderRadius: 12,
          paddingHorizontal: 24
        }}
        contentStyle={{ paddingVertical: 8 }}
        icon="magnify"
      >
        Browse Articles
      </Button>
    </View>
  );
}
