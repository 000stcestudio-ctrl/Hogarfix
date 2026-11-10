import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface OnlineBadgeProps {
  isOnline: boolean;
  label?: string;
  size?: 'sm' | 'md';
}

export function OnlineBadge({ isOnline, label, size = 'md' }: OnlineBadgeProps) {
  const { isDarkMode, isLargeText } = useApp();

  const dotSize = size === 'sm' ? 8 : 10;
  const fontSize = (size === 'sm' ? 12 : 14) * (isLargeText ? 1.15 : 1);

  const statusText = label || (isOnline ? 'En línea ahora' : 'Horario comercial');
  const dotColor = isOnline ? Palette.online : '#9CA3AF';
  const bgColor = isOnline
    ? isDarkMode
      ? 'rgba(16, 185, 129, 0.18)'
      : '#E7F9F0'
    : isDarkMode
      ? '#262B34'
      : '#F3F4F6';
  const textColor = isOnline ? (isDarkMode ? '#34D399' : '#047857') : (isDarkMode ? '#9CA3AF' : '#6B7280');

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <View style={[styles.dot, { width: dotSize, height: dotSize, backgroundColor: dotColor }]} />
      <Text style={[styles.label, { fontSize, color: textColor }]}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  dot: {
    borderRadius: Radius.full,
    marginRight: Spacing.xs + 2,
  },
  label: {
    fontWeight: '700',
  },
});
