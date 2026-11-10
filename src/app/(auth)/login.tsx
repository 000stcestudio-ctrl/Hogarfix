import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { AppButton } from '@/components/ui/button';

export default function LoginScreen() {
  const router = useRouter();
  const { isDarkMode, isLargeText } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const [email, setEmail] = useState('mconsuelo@correo.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  const titleSize = 26 * (isLargeText ? 1.15 : 1);
  const labelSize = 16 * (isLargeText ? 1.15 : 1);
  const inputSize = 16 * (isLargeText ? 1.15 : 1);

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* Back header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Volver a la pantalla anterior"
            style={[
              styles.backButton,
              { backgroundColor: isDarkMode ? '#252B35' : '#F1F4F9' },
            ]}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text, fontSize: titleSize }]}>
            Iniciar Sesión
          </Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: labelSize }]}>
          Ingresa a tu cuenta para consultar tus servicios o contactar técnicos.
        </Text>

        {/* Inputs */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text, fontSize: labelSize }]}>
              Correo Electrónico
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}>
              <Ionicons
                name="mail-outline"
                size={22}
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text, fontSize: inputSize }]}
                value={email}
                onChangeText={setEmail}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text, fontSize: labelSize }]}>
              Contraseña
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text, fontSize: inputSize }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor={theme.textMuted}
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel="Mostrar u ocultar contraseña"
                style={styles.eyeButton}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <AppButton
            title="Ingresar a Hogarfix"
            onPress={handleLogin}
            variant="primary"
            size="lg"
            style={{ marginTop: Spacing.sm }}
            leftIcon={<Ionicons name="log-in-outline" size={22} color="#FFFFFF" />}
          />
        </View>

        {/* Register prompt */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.textSecondary, fontSize: labelSize }]}>
            ¿Aún no tienes cuenta?
          </Text>
          <Pressable
            onPress={() => router.push('/(auth)/register')}
            accessibilityRole="button"
            accessibilityLabel="Ir a crear cuenta">
            <Text style={[styles.footerLink, { color: theme.primary, fontSize: labelSize }]}>
              Crear Cuenta
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: Spacing.lg,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontWeight: '800',
  },
  subtitle: {
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  formCard: {
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontWeight: '700',
    marginBottom: Spacing.xs + 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 54,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 50,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: Spacing.md,
    gap: Spacing.xs + 2,
  },
  footerText: {},
  footerLink: {
    fontWeight: '800',
  },
});
