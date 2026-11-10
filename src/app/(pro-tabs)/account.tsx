import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { AppCard } from '@/components/ui/card';
import { AppButton } from '@/components/ui/button';

export default function ProAccountScreen() {
  const router = useRouter();
  const {
    isDarkMode,
    isLargeText,
    providerPublication,
    subscription,
  } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const titleSize = 24 * (isLargeText ? 1.15 : 1);
  const cardTitleSize = 18 * (isLargeText ? 1.15 : 1);
  const bodySize = 14 * (isLargeText ? 1.15 : 1);

  const isSubActive = subscription.status === 'active';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>
              Mi Cuenta Profesional
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: bodySize }]}>
              Resumen de actividad y estado de tu membresía
            </Text>
          </View>

          <View style={[styles.proBadge, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
            <Ionicons name="shield-checkmark" size={16} color="#EA580C" />
            <Text style={styles.proBadgeText}>Prestador Verificado</Text>
          </View>
        </View>

        {/* Tarjeta de Perfil del Prestador */}
        <AppCard style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: providerPublication.avatarUrl }}
              style={styles.avatarImage}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={[styles.profileName, { color: theme.text, fontSize: cardTitleSize }]}>
                  {providerPublication.name}
                </Text>
                <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
              </View>
              <Text style={[styles.tradeText, { color: '#EA580C', fontSize: bodySize }]}>
                {providerPublication.trade}
              </Text>
              <Text style={[styles.locationText, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                <Ionicons name="location-outline" size={12} color={theme.textSecondary} /> {providerPublication.location}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Estado de Membresía */}
          <View
            style={[
              styles.subscriptionBox,
              {
                backgroundColor: isSubActive ? '#ECFDF5' : '#FEF2F2',
                borderColor: isSubActive ? '#A7F3D0' : '#FECACA',
              },
            ]}>
            <View style={styles.subIconRow}>
              <Ionicons
                name={isSubActive ? 'ribbon' : 'alert-circle'}
                size={22}
                color={isSubActive ? '#059669' : '#DC2626'}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.subTitle,
                    { color: isSubActive ? '#065F46' : '#991B1B' },
                  ]}>
                  {isSubActive
                    ? 'Membresía Mensual Activa ($10 USD / mes)'
                    : 'Membresía Pausada o Inactiva'}
                </Text>
                <Text
                  style={[
                    styles.subDetails,
                    { color: isSubActive ? '#047857' : '#B91C1C', fontSize: bodySize - 2 },
                  ]}>
                  {isSubActive
                    ? `Próxima renovación: ${subscription.renewsAt || 'En 30 días'} • Tarjeta ${subscription.paymentMethod?.last4 ? `••• ${subscription.paymentMethod.last4}` : '••• 4242'}`
                    : 'Agrega un método de pago para volver a aparecer en el directorio.'}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/(pro-tabs)/settings')}
              style={styles.manageSubLink}>
              <Text style={[styles.manageSubText, { color: isSubActive ? '#059669' : '#DC2626' }]}>
                Administrar en Configuración
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={isSubActive ? '#059669' : '#DC2626'}
              />
            </Pressable>
          </View>
        </AppCard>

        {/* Métricas y Estadísticas de Impacto */}
        <Text style={[styles.sectionHeading, { color: theme.text, fontSize: cardTitleSize }]}>
          Rendimiento este Mes
        </Text>

        <View style={styles.metricsGrid}>
          {/* Métrica 1 */}
          <View
            style={[
              styles.metricCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="eye-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.metricNumber, { color: theme.text }]}>348</Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
              Vistas de tu perfil
            </Text>
          </View>

          {/* Métrica 2 */}
          <View
            style={[
              styles.metricCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="chatbubbles-outline" size={22} color="#10B981" />
            </View>
            <Text style={[styles.metricNumber, { color: theme.text }]}>29</Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
              Contactos recibidos
            </Text>
          </View>

          {/* Métrica 3 */}
          <View
            style={[
              styles.metricCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="calendar-outline" size={22} color="#FF7A00" />
            </View>
            <Text style={[styles.metricNumber, { color: theme.text }]}>16</Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
              Citas agendadas
            </Text>
          </View>

          {/* Métrica 4 */}
          <View
            style={[
              styles.metricCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="star" size={22} color="#D97706" />
            </View>
            <Text style={[styles.metricNumber, { color: theme.text }]}>4.9</Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
              Calificación (142 reseñas)
            </Text>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <Text style={[styles.sectionHeading, { color: theme.text, fontSize: cardTitleSize }]}>
          Gestión del Servicio
        </Text>

        <View style={styles.quickActions}>
          <AppButton
            title="Editar Mi Publicación (Fotos, Videos, Bio)"
            onPress={() => router.push('/(pro-tabs)/publication')}
            variant="primary"
            size="lg"
            style={{ backgroundColor: '#FF7A00' }}
            leftIcon={<Ionicons name="create-outline" size={22} color="#FFFFFF" />}
          />

          <AppButton
            title="Ver cómo me ven los clientes"
            onPress={() => router.push('/pro/pro-1')}
            variant="outline"
            size="md"
            leftIcon={<Ionicons name="eye-outline" size={20} color={theme.text} />}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 4,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
  },
  profileCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#FF7A00',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    fontWeight: '800',
  },
  tradeText: {
    fontWeight: '700',
    marginTop: 2,
  },
  locationText: {
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  subscriptionBox: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  subIconRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  subTitle: {
    fontWeight: '800',
    fontSize: 14,
  },
  subDetails: {
    marginTop: 2,
    lineHeight: 18,
  },
  manageSubLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
    gap: 4,
  },
  manageSubText: {
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeading: {
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  metricCard: {
    width: '48%',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  metricIconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: '900',
  },
  metricLabel: {
    marginTop: 2,
  },
  quickActions: {
    gap: Spacing.sm,
  },
});
