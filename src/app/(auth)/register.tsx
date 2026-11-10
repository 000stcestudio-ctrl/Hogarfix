import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { AppButton } from '@/components/ui/button';

export default function RegisterScreen() {
  const router = useRouter();
  const { isDarkMode, isLargeText, updateUser } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const [name, setName] = useState('María Consuelo Morales');
  const [email, setEmail] = useState('mconsuelo@correo.com');
  const [password, setPassword] = useState('segura123');
  const [phone, setPhone] = useState('+57 301 234 5678');
  const [address, setAddress] = useState('Calle 140 # 19-35, Apto 402, Bogotá');

  const titleSize = 26 * (isLargeText ? 1.15 : 1);
  const labelSize = 16 * (isLargeText ? 1.15 : 1);
  const noteSize = 13 * (isLargeText ? 1.15 : 1);
  const inputSize = 16 * (isLargeText ? 1.15 : 1);

  const handleRegister = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Datos incompletos', 'Por favor llena los campos principales para poder contactarte.');
      return;
    }

    updateUser({
      name,
      email,
      phone,
      address,
    });

    router.push('/(auth)/onboarding');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Header */}
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
            Crear Cuenta
          </Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: labelSize }]}>
          Regístrate para solicitar técnicos a domicilio de manera rápida y segura.
        </Text>

        {/* 1. Nombre */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text, fontSize: labelSize }]}>
            Nombre completo
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <Ionicons name="person-outline" size={22} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text, fontSize: inputSize }]}
              value={name}
              onChangeText={setName}
              placeholder="Ej. Carmen Rodríguez"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>

        {/* 2. Correo */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text, fontSize: labelSize }]}>
            Correo electrónico
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <Ionicons name="mail-outline" size={22} color={theme.textSecondary} style={styles.inputIcon} />
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

        {/* 3. Contraseña */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text, fontSize: labelSize }]}>
            Contraseña
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <Ionicons name="lock-closed-outline" size={22} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text, fontSize: inputSize }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Crea una contraseña segura"
              placeholderTextColor={theme.textMuted}
              secureTextEntry={true}
            />
          </View>
        </View>

        {/* 4. Teléfono */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text, fontSize: labelSize }]}>
            Número de teléfono móvil
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <Ionicons name="call-outline" size={22} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text, fontSize: inputSize }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+57 300 000 0000"
              placeholderTextColor={theme.textMuted}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.helperRow}>
            <Ionicons name="information-circle-outline" size={16} color={theme.primary} />
            <Text style={[styles.helperText, { color: theme.textSecondary, fontSize: noteSize }]}>
              Este número se usará para que los profesionales se comuniquen contigo y coordinen la llegada.
            </Text>
          </View>
        </View>

        {/* 5. Dirección */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text, fontSize: labelSize }]}>
            Dirección de domicilio
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <Ionicons name="location-outline" size={22} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text, fontSize: inputSize }]}
              value={address}
              onChangeText={setAddress}
              placeholder="Calle, Carrera, Barrio y Apto/Casa"
              placeholderTextColor={theme.textMuted}
            />
          </View>
          <View style={styles.helperRow}>
            <Ionicons name="home-outline" size={16} color={theme.primary} />
            <Text style={[styles.helperText, { color: theme.textSecondary, fontSize: noteSize }]}>
              Dirección donde se prestarán los servicios solicitados en tu hogar.
            </Text>
          </View>
        </View>

        {/* Botón Continuar */}
        <AppButton
          title="Continuar al Onboarding"
          onPress={handleRegister}
          variant="primary"
          size="lg"
          style={{ marginTop: Spacing.sm, marginBottom: Spacing.xl }}
          rightIcon={<Ionicons name="arrow-forward" size={22} color="#FFFFFF" />}
        />
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
  helperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.xs + 2,
    gap: Spacing.xs,
  },
  helperText: {
    flex: 1,
    lineHeight: 18,
  },
});
