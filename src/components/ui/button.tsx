import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { Colors, Radius, Spacing, Accessibility } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'accent' | 'danger';
export type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const { isDarkMode, isLargeText } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) return isDarkMode ? '#2D323B' : '#E5E7EB';
    switch (variant) {
      case 'primary':
        return pressed ? '#0947C7' : theme.primary;
      case 'accent':
        return pressed ? '#E06B00' : theme.accent;
      case 'secondary':
        return pressed ? (isDarkMode ? '#343B47' : '#E5E9F0') : theme.cardSecondary;
      case 'outline':
        return pressed ? (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(13,91,255,0.05)') : 'transparent';
      case 'danger':
        return pressed ? '#DC2626' : '#EF4444';
      default:
        return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return isDarkMode ? '#6B7280' : '#9CA3AF';
    switch (variant) {
      case 'primary':
      case 'accent':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
        return theme.text;
      case 'outline':
        return theme.primary;
      default:
        return '#FFFFFF';
    }
  };

  const minHeight = size === 'lg' ? 56 : Accessibility.minTouchTarget;
  const fontSize = (size === 'lg' ? 18 : 16) * (isLargeText ? 1.15 : 1);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: getBackgroundColor(pressed),
          minHeight,
          minWidth: Accessibility.minTouchTarget,
          borderRadius: Radius.lg,
          borderCurve: 'continuous',
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: disabled ? (isDarkMode ? '#3E4654' : '#D1D5DB') : theme.primary,
          opacity: pressed ? 0.92 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.iconMargin}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize,
              },
              textStyle,
            ]}>
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRightMargin}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMargin: {
    marginRight: Spacing.sm,
  },
  iconRightMargin: {
    marginLeft: Spacing.sm,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
