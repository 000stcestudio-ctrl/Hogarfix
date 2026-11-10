import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { AppCard } from '@/components/ui/card';
import { AppButton } from '@/components/ui/button';

export default function ProSettingsScreen() {
  const router = useRouter();
  const {
    user,
    isDarkMode,
    toggleDarkMode,
    isLargeText,
    toggleLargeText,
    language,
    setLanguage,
    subscription,
    cancelSubscription,
    activateSubscription,
    logout,
    setRole,
  } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const [changeCardModal, setChangeCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const titleSize = 24 * (isLargeText ? 1.15 : 1);
  const cardTitleSize = 18 * (isLargeText ? 1.15 : 1);
  const bodySize = 14 * (isLargeText ? 1.15 : 1);

  const isSubActive = subscription.status === 'active';

  // Manejo de cancelación de membresía
  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancelar Membresía Profesional',
      '¿Estás seguro de que deseas cancelar la suscripción de $10 USD/mes?\n\nAl cancelar, tu perfil mantendrá la visibilidad hasta el cierre del ciclo actual de facturación, pero luego dejarás de recibir solicitudes de clientes nuevos.',
      [
        { text: 'Mantener mi membresía', style: 'cancel' },
        {
          text: 'Sí, cancelar suscripción',
          style: 'destructive',
          onPress: () => {
            cancelSubscription();
            Alert.alert(
              'Membresía Cancelada',
              'Tu suscripción ha sido cancelada. No se realizarán más cobros automáticos.'
            );
          },
        },
      ]
    );
  };

  const handleReactivateSubscription = () => {
    activateSubscription({
      cardNumber: '4242424242424242',
      expiry: '12/28',
      cvc: '123',
      cardholderName: user.name || 'Carlos Gómez',
    });
    Alert.alert('¡Membresía Reactivada!', 'Tu plan mensual de $10 USD está activo nuevamente.');
  };

  const handleUpdatePaymentMethod = () => {
    if (!newCardNumber.trim() || !newExpiry.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa los datos de la nueva tarjeta.');
      return;
    }
    activateSubscription({
      cardNumber: newCardNumber,
      expiry: newExpiry,
      cvc: '999',
      cardholderName: user.name || 'Carlos Gómez',
    });
    setChangeCardModal(false);
    setNewCardNumber('');
    setNewExpiry('');
    Alert.alert('Tarjeta Actualizada', 'Tu método de pago ha sido actualizado con éxito.');
  };

  // Cierre de sesión
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Deseas salir de tu cuenta profesional de Hogarfix?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  // Cambiar a modo cliente
  const handleSwitchToClient = () => {
    setRole('client');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>
            Configuración Profesional
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: bodySize }]}>
            Administra tu membresía, idioma, tema y sesión
          </Text>
        </View>

        {/* 1. SECCIÓN: ADMINISTRAR O CANCELAR MEMBRESÍA */}
        <Text style={[styles.sectionHeading, { color: theme.text, fontSize: cardTitleSize }]}>
          Membresía y Facturación ($10 USD / mes)
        </Text>

        <AppCard style={styles.membershipCard}>
          <View style={styles.subStatusRow}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: isSubActive ? '#ECFDF5' : '#FEF2F2' },
              ]}>
              <Ionicons
                name={isSubActive ? 'card' : 'card-outline'}
                size={22}
                color={isSubActive ? '#10B981' : '#EF4444'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.statusPillRow}>
                <Text style={[styles.planTitle, { color: theme.text, fontSize: bodySize + 2 }]}>
                  Plan Profesional Mensual
                </Text>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: isSubActive ? '#ECFDF5' : '#FEF2F2' },
                  ]}>
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: isSubActive ? '#059669' : '#DC2626' },
                    ]}>
                    {isSubActive ? 'ACTIVA' : 'CANCELADA'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.priceTag, { color: '#FF7A00' }]}>
                $10.00 USD / mes (facturación automática)
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary, fontSize: bodySize }]}>
              Método de cobro:
            </Text>
            <Text style={[styles.detailValue, { color: theme.text, fontSize: bodySize }]}>
              {subscription.paymentMethod?.last4
                ? `Visa terminada en ••• ${subscription.paymentMethod.last4}`
                : 'Visa terminada en ••• 4242'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary, fontSize: bodySize }]}>
              Próxima renovación:
            </Text>
            <Text style={[styles.detailValue, { color: theme.text, fontSize: bodySize }]}>
              {subscription.renewsAt || 'Renovación automática cada mes'}
            </Text>
          </View>

          {/* Botones de administración de membresía */}
          <View style={styles.membershipActions}>
            <AppButton
              title="Cambiar Tarjeta de Pago"
              onPress={() => setChangeCardModal(true)}
              variant="outline"
              size="md"
              leftIcon={<Ionicons name="card-outline" size={18} color={theme.text} />}
            />

            {isSubActive ? (
              <AppButton
                title="Cancelar Membresía"
                onPress={handleCancelSubscription}
                variant="outline"
                size="md"
                style={{ borderColor: '#FECACA' }}
                textStyle={{ color: '#DC2626' }}
                leftIcon={<Ionicons name="close-circle-outline" size={18} color="#DC2626" />}
              />
            ) : (
              <AppButton
                title="Reactivar Membresía ($10 USD)"
                onPress={handleReactivateSubscription}
                variant="primary"
                size="md"
                style={{ backgroundColor: '#10B981' }}
                leftIcon={<Ionicons name="refresh" size={18} color="#FFFFFF" />}
              />
            )}
          </View>
        </AppCard>

        {/* 2. SECCIÓN: IDIOMA */}
        <Text style={[styles.sectionHeading, { color: theme.text, fontSize: cardTitleSize }]}>
          Idioma de la Aplicación
        </Text>

        <AppCard style={styles.optionsCard}>
          <View style={styles.languageRow}>
            <Pressable
              onPress={() => setLanguage('es')}
              style={[
                styles.langButton,
                {
                  backgroundColor: language === 'es' ? (isDarkMode ? '#242C39' : '#EFF6FF') : 'transparent',
                  borderColor: language === 'es' ? theme.primary : theme.border,
                },
              ]}>
              <Text style={{ fontSize: 20 }}>🇪🇸</Text>
              <Text
                style={[
                  styles.langButtonText,
                  {
                    color: language === 'es' ? theme.primary : theme.text,
                    fontWeight: language === 'es' ? '800' : '500',
                  },
                ]}>
                Español
              </Text>
              {language === 'es' && (
                <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
              )}
            </Pressable>

            <Pressable
              onPress={() => setLanguage('en')}
              style={[
                styles.langButton,
                {
                  backgroundColor: language === 'en' ? (isDarkMode ? '#242C39' : '#EFF6FF') : 'transparent',
                  borderColor: language === 'en' ? theme.primary : theme.border,
                },
              ]}>
              <Text style={{ fontSize: 20 }}>🇺🇸</Text>
              <Text
                style={[
                  styles.langButtonText,
                  {
                    color: language === 'en' ? theme.primary : theme.text,
                    fontWeight: language === 'en' ? '800' : '500',
                  },
                ]}>
                English
              </Text>
              {language === 'en' && (
                <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
              )}
            </Pressable>
          </View>
        </AppCard>

        {/* 3. SECCIÓN: TEMA (MODO OSCURO / CLARO) */}
        <Text style={[styles.sectionHeading, { color: theme.text, fontSize: cardTitleSize }]}>
          Tema y Accesibilidad
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
                  Fácil lectura y ahorro de batería
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#FF7A00' }}
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
                  Aumenta el tamaño tipográfico
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

        {/* 4. SECCIÓN: CUENTA Y SESIÓN */}
        <Text style={[styles.sectionHeading, { color: theme.text, fontSize: cardTitleSize }]}>
          Cuenta y Sesión
        </Text>

        <View style={styles.sessionSection}>
          <AppButton
            title="Cambiar a Vista de Cliente (Buscar servicios)"
            onPress={handleSwitchToClient}
            variant="outline"
            size="lg"
            leftIcon={<Ionicons name="swap-horizontal" size={22} color={theme.text} />}
          />

          <AppButton
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="secondary"
            size="lg"
            leftIcon={<Ionicons name="log-out-outline" size={22} color={theme.text} />}
          />
        </View>
      </ScrollView>

      {/* Modal para actualizar tarjeta */}
      <Modal
        visible={changeCardModal}
        transparent
        animationType="fade"
        onRequestClose={() => setChangeCardModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text, fontSize: cardTitleSize }]}>
              Actualizar Método de Pago
            </Text>
            <Text style={[styles.modalDesc, { color: theme.textSecondary, fontSize: bodySize }]}>
              Los cobros mensuales de $10 USD se aplicarán a esta nueva tarjeta.
            </Text>

            <View style={styles.inputGroupModal}>
              <Text style={[styles.modalInputLabel, { color: theme.text }]}>Número de Tarjeta</Text>
              <View style={[styles.modalInputWrapper, { borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="4242 •••• •••• 4242"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  value={newCardNumber}
                  onChangeText={setNewCardNumber}
                />
              </View>
            </View>

            <View style={styles.inputGroupModal}>
              <Text style={[styles.modalInputLabel, { color: theme.text }]}>Vencimiento (MM/AA)</Text>
              <View style={[styles.modalInputWrapper, { borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="12/28"
                  placeholderTextColor={theme.textMuted}
                  value={newExpiry}
                  onChangeText={setNewExpiry}
                />
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <AppButton
                title="Cancelar"
                onPress={() => setChangeCardModal(false)}
                variant="outline"
                size="md"
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <AppButton
                title="Guardar Tarjeta"
                onPress={handleUpdatePaymentMethod}
                variant="primary"
                size="md"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  sectionHeading: {
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  membershipCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  subStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planTitle: {
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '900',
  },
  priceTag: {
    fontWeight: '700',
    marginTop: 2,
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs + 2,
  },
  detailLabel: {
    fontWeight: '500',
  },
  detailValue: {
    fontWeight: '700',
  },
  membershipActions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  optionsCard: {
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  languageRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  langButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    gap: 8,
  },
  langButtonText: {
    fontSize: 15,
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
  sessionSection: {
    gap: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  modalTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  modalDesc: {
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  inputGroupModal: {
    marginBottom: Spacing.md,
  },
  modalInputLabel: {
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 13,
  },
  modalInputWrapper: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
});
