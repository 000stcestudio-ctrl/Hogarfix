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
import { AppCard } from '@/components/ui/card';
import { AppButton } from '@/components/ui/button';

export default function MyServicesScreen() {
  const router = useRouter();
  const { appointments, rateAppointment, isDarkMode, isLargeText } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const [activeTab, setActiveTab] = useState<'agendados' | 'finalizados'>('agendados');

  const scheduled = appointments.filter((a) => a.status === 'agendado' || a.status === 'en_curso');
  const finished = appointments.filter((a) => a.status === 'finalizado');

  const titleSize = 26 * (isLargeText ? 1.15 : 1);
  const tabTextSize = 16 * (isLargeText ? 1.15 : 1);
  const cardTitleSize = 18 * (isLargeText ? 1.15 : 1);
  const bodySize = 15 * (isLargeText ? 1.15 : 1);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>
            Mis Servicios
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: bodySize }]}>
            Gestiona tus citas programadas y califica trabajos anteriores.
          </Text>
        </View>

        {/* Tab Selector */}
        <View style={[styles.tabBar, { backgroundColor: isDarkMode ? '#222731' : '#EAEFF5' }]}>
          <Pressable
            onPress={() => setActiveTab('agendados')}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'agendados' }}
            style={[
              styles.tabItem,
              {
                backgroundColor: activeTab === 'agendados' ? theme.card : 'transparent',
              },
            ]}>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: activeTab === 'agendados' ? theme.primary : theme.textSecondary,
                  fontSize: tabTextSize,
                  fontWeight: activeTab === 'agendados' ? '800' : '600',
                },
              ]}>
              Agendados ({scheduled.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('finalizados')}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'finalizados' }}
            style={[
              styles.tabItem,
              {
                backgroundColor: activeTab === 'finalizados' ? theme.card : 'transparent',
              },
            ]}>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: activeTab === 'finalizados' ? theme.primary : theme.textSecondary,
                  fontSize: tabTextSize,
                  fontWeight: activeTab === 'finalizados' ? '800' : '600',
                },
              ]}>
              Finalizados ({finished.length})
            </Text>
          </Pressable>
        </View>

        {/* List Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}>
          {activeTab === 'agendados' ? (
            scheduled.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={60} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.text, fontSize: cardTitleSize }]}>
                  No tienes servicios agendados
                </Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary, fontSize: bodySize }]}>
                  Busca un profesional de confianza para solucionar tus arreglos domésticos.
                </Text>
                <AppButton
                  title="Explorar Técnicos"
                  onPress={() => router.push('/(tabs)/explore')}
                  variant="primary"
                  size="md"
                  style={{ marginTop: Spacing.md }}
                />
              </View>
            ) : (
              scheduled.map((item) => (
                <AppCard key={item.id} style={styles.serviceCard}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: '#EFF6FF' }]}>
                      <Text style={[styles.statusBadgeText, { color: theme.primary }]}>
                        ● Cita Programada
                      </Text>
                    </View>
                    <Text style={[styles.dateText, { color: theme.primary, fontSize: bodySize }]}>
                      {item.date}
                    </Text>
                  </View>

                  <View style={styles.proRow}>
                    <View style={[styles.proInitialBox, { backgroundColor: theme.primaryLight }]}>
                      <Text style={[styles.proInitialText, { color: theme.primary }]}>
                        {item.professionalName.charAt(0)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.proName, { color: theme.text, fontSize: cardTitleSize }]}>
                        {item.professionalName}
                      </Text>
                      <Text style={[styles.tradeText, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                        {item.trade}
                      </Text>
                    </View>
                  </View>

                  {item.notes && (
                    <Text style={[styles.notesText, { color: theme.text, fontSize: bodySize - 1 }]}>
                      📌 {item.notes}
                    </Text>
                  )}

                  <View
                    style={[
                      styles.paymentBox,
                      {
                        backgroundColor: isDarkMode ? '#242933' : '#F8FAFC',
                        borderColor: theme.border,
                      },
                    ]}>
                    <Ionicons name="cash-outline" size={20} color="#10B981" />
                    <View style={{ flex: 1, marginLeft: Spacing.xs }}>
                      <Text style={[styles.paymentLabel, { color: theme.textSecondary, fontSize: bodySize - 3 }]}>
                        Medio de pago acordado (trato directo):
                      </Text>
                      <Text style={[styles.paymentVal, { color: theme.text, fontSize: bodySize - 1 }]}>
                        {item.paymentMethod}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    <AppButton
                      title="Abrir Chat con el Profesional"
                      onPress={() => router.push(`/chat/${item.professionalId}`)}
                      variant="primary"
                      size="md"
                      leftIcon={<Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFFFFF" />}
                    />
                  </View>
                </AppCard>
              ))
            )
          ) : finished.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-circle-outline" size={60} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text, fontSize: cardTitleSize }]}>
                Aún no tienes servicios finalizados
              </Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary, fontSize: bodySize }]}>
                Cuando un técnico complete una visita, podrás dejar tu reseña aquí.
              </Text>
            </View>
          ) : (
            finished.map((item) => (
              <AppCard key={item.id} style={styles.serviceCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: '#ECFDF5' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#059669' }]}>
                      ✓ Finalizado y pagado
                    </Text>
                  </View>
                  <Text style={[styles.dateText, { color: theme.textMuted, fontSize: bodySize - 2 }]}>
                    {item.date}
                  </Text>
                </View>

                <View style={styles.proRow}>
                  <View style={[styles.proInitialBox, { backgroundColor: theme.primaryLight }]}>
                    <Text style={[styles.proInitialText, { color: theme.primary }]}>
                      {item.professionalName.charAt(0)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.proName, { color: theme.text, fontSize: cardTitleSize }]}>
                      {item.professionalName}
                    </Text>
                    <Text style={[styles.tradeText, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                      {item.trade}
                    </Text>
                  </View>
                </View>

                {/* Rating Selector Interactivo */}
                <View
                  style={[
                    styles.ratingSection,
                    {
                      backgroundColor: isDarkMode ? '#252B35' : '#F9FAFB',
                      borderColor: theme.border,
                    },
                  ]}>
                  <Text style={[styles.ratingPrompt, { color: theme.text, fontSize: bodySize }]}>
                    {item.ratingGiven
                      ? 'Tu calificación para este profesional:'
                      : '¿Cómo te fue con el servicio? Califica al técnico:'}
                  </Text>

                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (item.ratingGiven || 0) >= star;
                      return (
                        <Pressable
                          key={star}
                          onPress={() => rateAppointment(item.id, star)}
                          accessible={true}
                          accessibilityRole="button"
                          accessibilityLabel={`Calificar con ${star} estrellas`}
                          style={styles.starTouch}>
                          <Ionicons
                            name={isFilled ? 'star' : 'star-outline'}
                            size={32}
                            color={isFilled ? '#F59E0B' : '#9CA3AF'}
                          />
                        </Pressable>
                      );
                    })}
                  </View>

                  {item.ratingGiven ? (
                    <Text style={[styles.ratingThanks, { color: '#059669', fontSize: bodySize - 2 }]}>
                      ⭐ ¡Gracias por tu calificación de {item.ratingGiven} estrellas! Ayuda a otros hogares a elegir con confianza.
                    </Text>
                  ) : null}
                </View>

                <View style={styles.cardActions}>
                  <AppButton
                    title="Ver Perfil del Técnico"
                    onPress={() => router.push(`/pro/${item.professionalId}`)}
                    variant="outline"
                    size="md"
                  />
                </View>
              </AppCard>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.lg,
    paddingBottom: 0,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tabItem: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    minHeight: 46,
  },
  tabLabel: {},
  scrollList: {
    paddingBottom: Spacing.xxl,
  },
  serviceCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusBadgeText: {
    fontWeight: '700',
    fontSize: 13,
  },
  dateText: {
    fontWeight: '700',
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  proInitialBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  proInitialText: {
    fontSize: 22,
    fontWeight: '800',
  },
  proName: {
    fontWeight: '700',
  },
  tradeText: {
    marginTop: 1,
  },
  notesText: {
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  paymentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  paymentLabel: {
    fontWeight: '500',
  },
  paymentVal: {
    fontWeight: '700',
    marginTop: 1,
  },
  cardActions: {
    marginTop: Spacing.xs,
  },
  ratingSection: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ratingPrompt: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  starsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  starTouch: {
    padding: Spacing.xs,
  },
  ratingThanks: {
    fontWeight: '600',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontWeight: '800',
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySub: {
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
});
