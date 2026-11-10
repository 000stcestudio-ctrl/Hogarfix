import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Radius, Spacing, Accessibility } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface QuickChipProps {
  label: string;
  onPress: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export function QuickChip({ label, onPress, selected = false, style, icon }: QuickChipProps) {
  const { isDarkMode, isLargeText } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const fontSize = 15 * (isLargeText ? 1.15 : 1);

  return (
    <Pressable
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          minHeight: 44,
          backgroundColor: selected
            ? theme.primary
            : isDarkMode
              ? '#222731'
              : '#F1F4F9',
          borderColor: selected
            ? theme.primary
            : isDarkMode
              ? '#343B48'
              : '#E2E8F0',
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}>
      {icon && <>{icon}</>}
      <Text
        style={[
          styles.label,
          {
            fontSize,
            color: selected ? '#FFFFFF' : theme.text,
            fontWeight: selected ? '700' : '600',
            marginLeft: icon ? Spacing.xs : 0,
          },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    marginRight: Spacing.sm,
  },
  label: {},
});
