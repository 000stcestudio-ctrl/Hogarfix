import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function ProTabLayout() {
  const { isDarkMode, isLargeText } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const labelFontSize = isLargeText ? 13 : 11;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF7A00', // Color distintivo para el perfil profesional
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 8,
          elevation: 8,
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: labelFontSize,
          marginTop: 2,
        },
      }}>
      {/* 1. Mi Cuenta */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Mi Cuenta',
          tabBarLabel: 'Mi Cuenta',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={25}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Mi Publicación */}
      <Tabs.Screen
        name="publication"
        options={{
          title: 'Mi Publicación',
          tabBarLabel: 'Mi Publicación',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'megaphone' : 'megaphone-outline'}
              size={25}
              color={color}
            />
          ),
        }}
      />

      {/* 3. Configuración */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuración',
          tabBarLabel: 'Configuración',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={25}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
