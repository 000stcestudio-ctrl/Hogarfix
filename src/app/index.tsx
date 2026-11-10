import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { AuthBottomSheet } from '@/components/ui/auth-bottom-sheet';
import { UserRole } from '@/types';

export default function WelcomeScreen() {
  const router = useRouter();
  const {
    isDarkMode,
    isLargeText,
    setRole,
    loginWithSocial,
    loginAsGuest,
    subscription,
  } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const [authSheetVisible, setAuthSheetVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const titleSize = 28 * (isLargeText ? 1.15 : 1);
  const sloganSize = 16 * (isLargeText ? 1.15 : 1);
  const cardTitleSize = 20 * (isLargeText ? 1.15 : 1);
  const cardDescSize = 14 * (isLargeText ? 1.15 : 1);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setRole(role);
    setAuthSheetVisible(true);
  };

  const handleAuthAction = async (action: 'google' | 'apple' | 'guest') => {
    try {
      setIsLoadingAuth(true);

      if (action === 'guest') {
        await loginAsGuest(selectedRole);
      } else {
        await loginWithSocial(action, selectedRole);
      }

      setAuthSheetVisible(false);
      setIsLoadingAuth(false);

      if (selectedRole === 'client') {
        // Redirige al flujo ya hecho de clientes
        router.replace('/(tabs)');
      } else {
        // Para el prestador: si no tiene membresía activa, abre la pasarela de pago obligatoria
        if (subscription.status === 'active') {
          router.replace('/(pro-tabs)/account');
        } else {
          router.push('/(auth)/membership');
        }
      }
    } catch {
      setIsLoadingAuth(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Logo and Brand Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
            <Ionicons name="home" size={44} color="#FFFFFF" />
            <View style={styles.gearBadge}>
              <Ionicons name="construct" size={20} color="#FFFFFF" />
            </View>
          </View>

          <Text style={[styles.brandTitle, { color: theme.text, fontSize: titleSize }]}>
            Hogar<Text style={{ color: theme.primary }}>fix</Text>
          </Text>

          <Text style={[styles.slogan, { color: theme.textSecondary, fontSize: sloganSize }]}>
            La plataforma que conecta los mejores especialistas con tu hogar de forma directa y transparente.
          </Text>
        </View>

        {/* Sección central: Selector de Rol (2 Botones Principales) */}
        <View style={styles.selectionSection}>
          <Text style={[styles.sectionPrompt, { color: theme.text, fontSize: cardTitleSize }]}>
            ¿Cómo deseas ingresar hoy?
          </Text>
          <Text style={[styles.sectionSubprompt, { color: theme.textSecondary, fontSize: cardDescSize }]}>
            Selecciona tu perfil para brindarte la mejor experiencia adaptada a ti:
          </Text>

          {/* BOTÓN 1: BUSCO UN SERVICIO (CLIENTE) */}
          <Pressable
            onPress={() => handleSelectRole('client')}
            accessibilityRole="button"
            accessibilityLabel="Botón Busco un servicio"
            style={({ pressed }) => [
              styles.roleCard,
              {
                backgroundColor: theme.card,
                borderColor: selectedRole === 'client' ? theme.primary : theme.border,
                borderWidth: 2,
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              },
            ]}>
            <View style={[styles.roleIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="search" size={28} color={theme.primary} />
            </View>

            <View style={styles.roleCardContent}>
              <View style={styles.roleBadgeRow}>
                <Text style={[styles.roleCardTitle, { color: theme.text, fontSize: cardTitleSize }]}>
                  Busco un servicio
                </Text>
                <View style={[styles.pillBadge, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.pillBadgeText, { color: '#059669' }]}>100% Gratis</Text>
                </View>
              </View>

              <Text style={[styles.roleCardDescription, { color: theme.textSecondary, fontSize: cardDescSize }]}>
                Encuentra fontaneros, cerrajeros, electricistas y técnicos certificados para tu casa. Trato directo sin comisiones intermediarias.
              </Text>

              <View style={styles.cardActionRow}>
                <Text style={[styles.cardActionText, { color: theme.primary }]}>
                  Explorar y solicitar técnicos
                </Text>
                <Ionicons name="arrow-forward" size={18} color={theme.primary} />
              </View>
            </View>
          </Pressable>

          {/* BOTÓN 2: BRINDO UN SERVICIO (PRESTADOR / TÉCNICO) */}
          <Pressable
            onPress={() => handleSelectRole('provider')}
            accessibilityRole="button"
            accessibilityLabel="Botón Brindo un servicio"
            style={({ pressed }) => [
              styles.roleCard,
              styles.proCard,
              {
                backgroundColor: isDarkMode ? '#1E2530' : '#FFFFFF',
                borderColor: '#FF7A00',
                borderWidth: 2,
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              },
            ]}>
            <View style={[styles.roleIconCircle, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="construct" size={28} color="#FF7A00" />
            </View>

            <View style={styles.roleCardContent}>
              <View style={styles.roleBadgeRow}>
                <Text style={[styles.roleCardTitle, { color: theme.text, fontSize: cardTitleSize }]}>
                  Brindo un servicio
                </Text>
                <View style={[styles.pillBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.pillBadgeText, { color: '#B45309' }]}>$10 USD / mes</Text>
                </View>
              </View>

              <Text style={[styles.roleCardDescription, { color: theme.textSecondary, fontSize: cardDescSize }]}>
                Publica tu trabajo, exhibe tus fotos y videos, y recibe llamadas y chats de clientes directos. 0% comisión por trabajo.
              </Text>

              <View style={styles.cardActionRow}>
                <Text style={[styles.cardActionText, { color: '#EA580C' }]}>
                  Activar membresía y publicar
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#EA580C" />
              </View>
            </View>
          </Pressable>
        </View>

        {/* Garantías y Seguridad */}
        <View style={styles.footerGuarantees}>
          <View style={styles.guaranteeItem}>
            <Ionicons name="shield-checkmark-outline" size={18} color={theme.primary} />
            <Text style={[styles.guaranteeText, { color: theme.textSecondary }]}>
              Técnicos calificados y verificados
            </Text>
          </View>
          <View style={styles.guaranteeItem}>
            <Ionicons name="lock-closed-outline" size={18} color="#10B981" />
            <Text style={[styles.guaranteeText, { color: theme.textSecondary }]}>
              Pagos y datos 100% protegidos
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal / Bottom Sheet de Autenticación con Google, Apple y Continuar sin cuenta */}
      <AuthBottomSheet
        visible={authSheetVisible}
        onClose={() => setAuthSheetVisible(false)}
        selectedRole={selectedRole}
        onSelectAction={handleAuthAction}
        isLoading={isLoadingAuth}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: Spacing.sm,
    boxShadow: '0 8px 20px rgba(13, 91, 255, 0.25)',
    elevation: 4,
  },
  gearBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF7A00',
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  brandTitle: {
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  slogan: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.sm,
    fontWeight: '500',
  },
  selectionSection: {
    marginVertical: Spacing.sm,
  },
  sectionPrompt: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionSubprompt: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  roleCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  proCard: {
    boxShadow: '0 4px 16px rgba(255, 122, 0, 0.08)',
  },
  roleIconCircle: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  roleCardContent: {},
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roleCardTitle: {
    fontWeight: '800',
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  roleCardDescription: {
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardActionText: {
    fontWeight: '700',
    fontSize: 14,
  },
  footerGuarantees: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    gap: 8,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  guaranteeText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
