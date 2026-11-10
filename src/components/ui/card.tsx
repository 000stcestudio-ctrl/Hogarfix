import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
  accessibilityLabel?: string;
}

export function AppCard({
  children,
  style,
  onPress,
  variant = 'elevated',
  accessibilityLabel,
}: CardProps) {
  const { isDarkMode } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const cardStyle: ViewStyle = {
    backgroundColor: theme.card,
    borderRadius: Radius.lg,
    borderCurve: 'continuous',
    padding: Spacing.md,
    borderColor: isDarkMode ? theme.border : '#EDF0F5',
    borderWidth: 1,
    ...(variant === 'elevated' ? Shadows.card : {}),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          cardStyle,
          {
            opacity: pressed ? 0.95 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
          style,
        ]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}
