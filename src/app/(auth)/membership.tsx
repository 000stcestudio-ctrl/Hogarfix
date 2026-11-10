import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { AppButton } from '@/components/ui/button';

export default function MembershipPaymentScreen() {
  const router = useRouter();
  const { isDarkMode, isLargeText, activateSubscription, user } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const [paymentProvider, setPaymentProvider] = useState<'card' | 'mercadopago' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState(user.name || 'Carlos Gómez');
  const [isProcessing, setIsProcessing] = useState(false);

  const titleSize = 24 * (isLargeText ? 1.15 : 1);
  const sectionTitleSize = 18 * (isLargeText ? 1.15 : 1);
  const bodySize = 14 * (isLargeText ? 1.15 : 1);

  // Formateador de tarjeta
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').substring(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').substring(0, 4);
    if (cleaned.length >= 3) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const handleFillDemoCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('789');
    setCardholderName('Carlos Gómez Maestro');
  };

  const handleProcessPayment = () => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    if (cleanNumber.length < 13) {
      Alert.alert('Datos incompletos', 'Por favor ingresa un número de tarjeta válido.');
      return;
    }
    if (expiry.length < 5) {
      Alert.alert('Fecha de vencimiento', 'Por favor ingresa la fecha de vencimiento (MM/AA).');
      return;
    }
    if (cvc.length < 3) {
      Alert.alert('Código de seguridad', 'Por favor ingresa el código CVC de 3 o 4 dígitos.');
      return;
    }
    if (!cardholderName.trim()) {
      Alert.alert('Nombre del titular', 'Por favor ingresa el nombre que aparece en la tarjeta.');
      return;
    }

    setIsProcessing(true);

    // Simulación de pasarela segura (Stripe / Mercado Pago)
    setTimeout(() => {
      setIsProcessing(false);
      activateSubscription({
        cardNumber: cleanNumber,
        expiry,
        cvc,
        cardholderName,
      });

      Alert.alert(
        '¡Membresía Activada!',
        'Tu suscripción de $10 USD/mes está activa. Ya puedes publicar tus fotos, videos y comenzar a recibir solicitudes de clientes.',
        [
          {
            text: 'Ir a mi Panel de Prestador',
            onPress: () => router.replace('/(pro-tabs)/account'),
          },
        ]
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Header con botón para volver */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: isDarkMode ? '#252B35' : '#F1F4F9' },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Volver">
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>
              Pasarela de Pago
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: bodySize }]}>
              Paso obligatorio para prestadores de servicios
            </Text>
          </View>
        </View>

        {/* Tarjeta Resumen del Plan ($10 USD) */}
        <View
          style={[
            styles.planCard,
            {
              backgroundColor: isDarkMode ? '#1E2530' : '#FFFFFF',
              borderColor: '#FF7A00',
            },
          ]}>
          <View style={styles.planHeaderRow}>
            <View>
              <Text style={[styles.planBadge, { color: '#FF7A00' }]}>
                MEMBRESÍA MENSUAL PRO
              </Text>
              <Text style={[styles.planTitle, { color: theme.text, fontSize: sectionTitleSize }]}>
                Acceso Total para Prestador
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={[styles.priceCurrency, { color: theme.text }]}>$10</Text>
              <Text style={[styles.pricePeriod, { color: theme.textSecondary }]}>USD / mes</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Beneficios clave */}
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.benefitText, { color: theme.text, fontSize: bodySize }]}>
                Perfil profesional verificado y visible en el directorio
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.benefitText, { color: theme.text, fontSize: bodySize }]}>
                Contacto directo por chat y llamadas ilimitadas con clientes
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.benefitText, { color: theme.text, fontSize: bodySize }]}>
                Galería para fotos de trabajos y videos para llamar la atención
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.benefitText, { color: theme.text, fontSize: bodySize }]}>
                <Text style={{ fontWeight: '800' }}>0% comisiones:</Text> Todo lo que cobres por tus servicios es 100% tuyo
              </Text>
            </View>
          </View>
        </View>

        {/* Selector de Plataforma / Pasarela */}
        <Text style={[styles.sectionHeading, { color: theme.text, fontSize: sectionTitleSize }]}>
          1. Selecciona tu Pasarela de Pago
        </Text>

        <View style={styles.platformsRow}>
          {/* Opción Tarjeta (Stripe) */}
          <Pressable
            onPress={() => setPaymentProvider('card')}
            style={[
              styles.platformChip,
              {
                backgroundColor: paymentProvider === 'card' ? (isDarkMode ? '#253347' : '#EFF6FF') : theme.card,
                borderColor: paymentProvider === 'card' ? theme.primary : theme.border,
              },
            ]}>
            <Ionicons
              name="card"
              size={22}
              color={paymentProvider === 'card' ? theme.primary : theme.textSecondary}
            />
            <Text
              style={[
                styles.platformChipText,
                {
                  color: paymentProvider === 'card' ? theme.primary : theme.text,
                  fontWeight: paymentProvider === 'card' ? '700' : '500',
                },
              ]}>
              Tarjeta (Stripe)
            </Text>
          </Pressable>

          {/* Opción Mercado Pago */}
          <Pressable
            onPress={() => setPaymentProvider('mercadopago')}
            style={[
              styles.platformChip,
              {
                backgroundColor: paymentProvider === 'mercadopago' ? (isDarkMode ? '#1E3A4C' : '#E0F2FE') : theme.card,
                borderColor: paymentProvider === 'mercadopago' ? '#0284C7' : theme.border,
              },
            ]}>
            <Ionicons
              name="wallet-outline"
              size={22}
              color={paymentProvider === 'mercadopago' ? '#0284C7' : theme.textSecondary}
            />
            <Text
              style={[
                styles.platformChipText,
                {
                  color: paymentProvider === 'mercadopago' ? '#0284C7' : theme.text,
                  fontWeight: paymentProvider === 'mercadopago' ? '700' : '500',
                },
              ]}>
              Mercado Pago
            </Text>
          </Pressable>

          {/* Opción PayPal */}
          <Pressable
            onPress={() => setPaymentProvider('paypal')}
            style={[
              styles.platformChip,
              {
                backgroundColor: paymentProvider === 'paypal' ? (isDarkMode ? '#242D45' : '#EEF2FF') : theme.card,
                borderColor: paymentProvider === 'paypal' ? '#4F46E5' : theme.border,
              },
            ]}>
            <Ionicons
              name="logo-paypal"
              size={22}
              color={paymentProvider === 'paypal' ? '#4F46E5' : theme.textSecondary}
            />
            <Text
              style={[
                styles.platformChipText,
                {
                  color: paymentProvider === 'paypal' ? '#4F46E5' : theme.text,
                  fontWeight: paymentProvider === 'paypal' ? '700' : '500',
                },
              ]}>
              PayPal
            </Text>
          </Pressable>
        </View>

        {/* 2. Requisito de método de pago */}
        <View style={styles.methodHeaderRow}>
          <Text style={[styles.sectionHeading, { color: theme.text, fontSize: sectionTitleSize, marginBottom: 0 }]}>
            2. Agrega tu Método de Pago
          </Text>
          <Pressable onPress={handleFillDemoCard} style={styles.demoFillBtn}>
            <Ionicons name="sparkles" size={14} color={theme.primary} />
            <Text style={[styles.demoFillText, { color: theme.primary }]}>Tarjeta de prueba</Text>
          </Pressable>
        </View>

        <Text style={[styles.requiredNotice, { color: theme.textSecondary, fontSize: bodySize - 1 }]}>
          Requisito obligatorio para continuar y activar tu visibilidad pública.
        </Text>

        {/* Formulario de Tarjeta */}
        <View
          style={[
            styles.formCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}>
          {/* Titular */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize }]}>
              Nombre del titular de la tarjeta
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: isDarkMode ? '#1A212D' : '#F8FAFC' }]}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Como figura en la tarjeta"
                placeholderTextColor={theme.textMuted}
                value={cardholderName}
                onChangeText={setCardholderName}
              />
            </View>
          </View>

          {/* Número de Tarjeta */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize }]}>
              Número de tarjeta
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: isDarkMode ? '#1A212D' : '#F8FAFC' }]}>
              <Ionicons name="card-outline" size={20} color={theme.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                maxLength={19}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
              />
              <View style={styles.cardBrands}>
                <Text style={styles.cardBrandText}>VISA / MC</Text>
              </View>
            </View>
          </View>

          {/* Fila Fecha y CVC */}
          <View style={styles.inlineRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
              <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize }]}>
                Vencimiento
              </Text>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: isDarkMode ? '#1A212D' : '#F8FAFC' }]}>
                <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} style={{ marginRight: 6 }} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="MM/AA"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiry}
                  onChangeText={handleExpiryChange}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
              <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize }]}>
                Código CVC
              </Text>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: isDarkMode ? '#1A212D' : '#F8FAFC' }]}>
                <Ionicons name="lock-closed-outline" size={18} color={theme.textSecondary} style={{ marginRight: 6 }} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="123"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  value={cvc}
                  onChangeText={setCvc}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Garantías de Seguridad */}
        <View style={styles.securityBox}>
          <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          <Text style={[styles.securityText, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
            Transacción cifrada SSL de 256 bits y certificación PCI-DSS. Podrás cancelar o pausar tu suscripción en cualquier momento desde tu panel de Configuración.
          </Text>
        </View>

        {/* Botón de Pago Principal */}
        <View style={styles.actionSection}>
          <AppButton
            title={isProcessing ? 'Procesando pago seguro...' : 'Pagar $10 USD y Activar Perfil'}
            onPress={handleProcessPayment}
            variant="primary"
            size="lg"
            disabled={isProcessing}
            leftIcon={
              isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="checkmark-done" size={22} color="#FFFFFF" />
              )
            }
          />

          <Pressable
            onPress={() => router.back()}
            style={styles.cancelLink}>
            <Text style={[styles.cancelLinkText, { color: theme.textSecondary }]}>
              Volver al inicio
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
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
  },
  planCard: {
    borderRadius: Radius.lg,
    borderWidth: 2,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    boxShadow: '0 4px 18px rgba(255, 122, 0, 0.1)',
    elevation: 3,
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planBadge: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  planTitle: {
    fontWeight: '800',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceCurrency: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 34,
  },
  pricePeriod: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    flex: 1,
    lineHeight: 20,
  },
  sectionHeading: {
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  platformsRow: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.lg,
  },
  platformChip: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    gap: 6,
  },
  platformChipText: {
    fontSize: 12,
    textAlign: 'center',
  },
  methodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  demoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  demoFillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  requiredNotice: {
    marginBottom: Spacing.md,
  },
  formCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontWeight: '700',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    minHeight: 48,
  },
  cardBrands: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  cardBrandText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
  },
  inlineRow: {
    flexDirection: 'row',
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#ECFDF5',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.xl,
  },
  securityText: {
    flex: 1,
    lineHeight: 18,
    color: '#065F46',
  },
  actionSection: {
    gap: Spacing.md,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cancelLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
