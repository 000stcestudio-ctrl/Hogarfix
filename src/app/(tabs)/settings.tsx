import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { AppCard } from '@/components/ui/card';
import { AppButton } from '@/components/ui/button';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    user,
    isDarkMode,
    toggleDarkMode,
    isLargeText,
    toggleLargeText,
  } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const titleSize = 26 * (isLargeText ? 1.15 : 1);
  const cardTitleSize = 18 * (isLargeText ? 1.15 : 1);
  const bodySize = 15 * (isLargeText ? 1.15 : 1);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => router.replace('/'),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción borrará tus datos y solicitudes del dispositivo. ¿Deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Definitivamente',
          style: 'destructive',
          onPress: () => router.replace('/'),
        },
      ]
    );
  };

  const showMembershipInfo = () => {
    Alert.alert(
      'Membresía para Técnicos',
      'En Hogarfix, los técnicos pagan una membresía mensual ($10 USD o aprox. $40.000 COP) para mantener su perfil verificado y visible en el directorio.\n\nPara los clientes, el uso de la app es 100% gratuito: no cobramos comisiones ni intermediamos pagos bancarios.',
      [
        { text: 'Entendido', style: 'cancel' },
        {
          text: 'Soy Técnico / Activar',
          onPress: () => router.push('/(auth)/membership'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>
            Configuración
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: bodySize }]}>
            Preferencias de accesibilidad y datos de tu cuenta.
          </Text>
        </View>

        {/* 1. Tarjeta de Perfil del Usuario */}
        <AppCard style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={[styles.profileAvatar, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.profileAvatarText, { color: theme.primary }]}>
                {user.name ? user.name.charAt(0) : 'U'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.profileName, { color: theme.text, fontSize: cardTitleSize }]}>
                {user.name}
              </Text>
              <Text style={[styles.profileEmail, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                {user.email}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={theme.primary} style={{ marginRight: Spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary, fontSize: bodySize - 3 }]}>
                Teléfono de contacto:
              </Text>
              <Text style={[styles.infoVal, { color: theme.text, fontSize: bodySize - 1 }]}>
                {user.phone}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={theme.primary} style={{ marginRight: Spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary, fontSize: bodySize - 3 }]}>
                Dirección registrada:
              </Text>
              <Text style={[styles.infoVal, { color: theme.text, fontSize: bodySize - 1 }]}>
                {user.address}
              </Text>
            </View>
          </View>
        </AppCard>

        {/* 2. Sección de Accesibilidad */}
        <Text style={[styles.sectionHeading, { color: theme.text, fontSize: cardTitleSize }]}>
          Accesibilidad y Visualización
        </Text>

        <AppCard style={styles.optionsCard}>
          {/* Switch Modo Oscuro */}
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <View style={[styles.iconPill, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={22}
                  color={theme.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.switchTitle, { color: theme.text, fontSize: bodySize }]}>
                  Modo Oscuro
                </Text>
                <Text style={[styles.switchDesc, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                  Reduce el brillo para descansar la vista
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D5DB', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Switch Texto Grande */}
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <View style={[styles.iconPill, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="text-outline" size={22} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.switchTitle, { color: theme.text, fontSize: bodySize }]}>
                  Texto Grande
                </Text>
                <Text style={[styles.switchDesc, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                  Aumenta el tamaño de letra en toda la app
                </Text>
              </View>
            </View>
            <Switch
              value={isLargeText}
              onValueChange={toggleLargeText}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </AppCard>

        {/* 3. Información del Modelo de Negocio */}
        <Text style={[styles.sectionHeading, { color: theme.text, fontSize: cardTitleSize }]}>
          Transparencia y Reglas
        </Text>

        <AppCard
          onPress={showMembershipInfo}
          style={styles.infoCard}>
          <View style={styles.infoCardRow}>
            <View style={[styles.iconPill, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="ribbon-outline" size={22} color="#FF7A00" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoCardTitle, { color: theme.text, fontSize: bodySize }]}>
                Membresía para Profesionales
              </Text>
              <Text style={[styles.infoCardDesc, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                $10 USD / $40.000 COP mensual. Sin cobro de comisiones a los clientes.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </View>
        </AppCard>

        {/* 4. Botones de Cierre de Sesión y Eliminación */}
        <View style={styles.dangerZone}>
          <AppButton
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="secondary"
            size="lg"
            style={{ marginBottom: Spacing.md }}
            leftIcon={<Ionicons name="log-out-outline" size={22} color={theme.text} />}
          />

          <AppButton
            title="Eliminar Cuenta"
            onPress={handleDeleteAccount}
            variant="outline"
            size="md"
            style={{ borderColor: '#FCA5A5' }}
            textStyle={{ color: '#EF4444' }}
            leftIcon={<Ionicons name="trash-outline" size={20} color="#EF4444" />}
          />
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
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
  },
  profileCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  profileAvatarText: {
    fontSize: 28,
    fontWeight: '800',
  },
  profileName: {
    fontWeight: '700',
  },
  profileEmail: {
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  infoLabel: {
    fontWeight: '500',
  },
  infoVal: {
    fontWeight: '700',
  },
  sectionHeading: {
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  optionsCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.md,
  },
  iconPill: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  switchTitle: {
    fontWeight: '700',
  },
  switchDesc: {
    marginTop: 1,
  },
  infoCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.md,
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardTitle: {
    fontWeight: '700',
  },
  infoCardDesc: {
    marginTop: 2,
  },
  dangerZone: {
    marginTop: Spacing.sm,
  },
});
