import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { AppCard } from '@/components/ui/card';
import { OnlineBadge } from '@/components/ui/online-badge';
import { AppButton } from '@/components/ui/button';

export default function ProDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { professionals, isDarkMode, isLargeText } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const pro = professionals.find((p) => p.id === id) || professionals[0];

  const titleSize = 24 * (isLargeText ? 1.15 : 1);
  const cardTitleSize = 18 * (isLargeText ? 1.15 : 1);
  const bodySize = 15 * (isLargeText ? 1.15 : 1);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.back()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Volver al directorio"
          style={[
            styles.backButton,
            { backgroundColor: isDarkMode ? '#252B35' : '#F1F4F9' },
          ]}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text, fontSize: titleSize - 4 }]}>
          Perfil del Profesional
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <AppCard style={styles.headerCard}>
          <View style={styles.avatarRow}>
            <View
              style={[
                styles.largeAvatarBox,
                { backgroundColor: theme.primaryLight, borderColor: theme.primary },
              ]}>
              <Text style={[styles.largeAvatarInitial, { color: theme.primary }]}>
                {pro.name.charAt(0)}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={[styles.proName, { color: theme.text, fontSize: titleSize }]}>
                  {pro.name}
                </Text>
                {pro.isVerified && (
                  <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                )}
              </View>

              <Text style={[styles.proTrade, { color: theme.textSecondary, fontSize: bodySize }]}>
                {pro.trade}
              </Text>

              <View style={styles.statusRow}>
                <OnlineBadge isOnline={pro.isOnline} size="md" />
              </View>
            </View>
          </View>

          {/* Stats Bar */}
          <View
            style={[
              styles.statsBar,
              { backgroundColor: isDarkMode ? '#242933' : '#F8FAFC', borderColor: theme.border },
            ]}>
            <View style={styles.statCol}>
              <View style={styles.statRatingRow}>
                <Ionicons name="star" size={18} color="#F59E0B" />
                <Text style={[styles.statVal, { color: theme.text, fontSize: bodySize }]}>
                  {pro.rating.toFixed(1)}
                </Text>
              </View>
              <Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: bodySize - 3 }]}>
                {pro.reviewCount} reseñas
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.text, fontSize: bodySize }]}>
                {pro.experienceYears} años
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: bodySize - 3 }]}>
                Experiencia
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.text, fontSize: bodySize }]}>
                {pro.completedJobs}+
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: bodySize - 3 }]}>
                Trabajos
              </Text>
            </View>
          </View>

          {/* Insignia de Membresía Verificada */}
          <View
            style={[
              styles.membershipBadge,
              {
                backgroundColor: isDarkMode ? 'rgba(13, 91, 255, 0.15)' : '#EFF6FF',
                borderColor: theme.primary,
              },
            ]}>
            <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
            <Text style={[styles.membershipText, { color: theme.primary, fontSize: bodySize - 2 }]}>
              Profesional Suscrito y Verificado por Hogarfix
            </Text>
          </View>
        </AppCard>

        {/* Biografía y Trayectoria */}
        <AppCard style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: cardTitleSize }]}>
            Acerca del profesional
          </Text>
          <Text style={[styles.bioText, { color: theme.textSecondary, fontSize: bodySize }]}>
            {pro.bio}
          </Text>

          <View style={styles.rateHighlightBox}>
            <Ionicons name="pricetag-outline" size={20} color={theme.primary} />
            <Text style={[styles.rateHighlightText, { color: theme.text, fontSize: bodySize - 1 }]}>
              Tarifa de referencia: <Text style={{ fontWeight: '800' }}>{pro.visitRate}</Text>
            </Text>
          </View>
        </AppCard>

        {/* Servicios que ofrece */}
        <AppCard style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: cardTitleSize }]}>
            Servicios principales
          </Text>
          {pro.servicesOffered.map((serv, index) => (
            <View key={index} style={styles.serviceRow}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
              <Text style={[styles.serviceText, { color: theme.text, fontSize: bodySize }]}>
                {serv}
              </Text>
            </View>
          ))}
        </AppCard>

        {/* Reseñas de otros usuarios */}
        <AppCard style={[styles.sectionCard, { marginBottom: 100 }]}>
          <View style={styles.reviewsHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: cardTitleSize }]}>
              Opiniones de vecinos ({pro.reviews.length})
            </Text>
            <View style={styles.starsSummary}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={[styles.starsSummaryVal, { color: theme.text, fontSize: bodySize }]}>
                {pro.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          {pro.reviews.map((rev) => (
            <View
              key={rev.id}
              style={[
                styles.reviewItem,
                { borderBottomColor: isDarkMode ? '#2D333F' : '#F1F4F9' },
              ]}>
              <View style={styles.reviewUserRow}>
                <Text style={[styles.reviewUserName, { color: theme.text, fontSize: bodySize }]}>
                  {rev.userName}
                </Text>
                <Text style={[styles.reviewDate, { color: theme.textMuted, fontSize: bodySize - 3 }]}>
                  {rev.date}
                </Text>
              </View>

              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name={s <= Math.round(rev.rating) ? 'star' : 'star-outline'}
                    size={16}
                    color="#F59E0B"
                  />
                ))}
              </View>

              <Text style={[styles.reviewComment, { color: theme.textSecondary, fontSize: bodySize - 1 }]}>
                "{rev.comment}"
              </Text>
            </View>
          ))}
        </AppCard>
      </ScrollView>

      {/* Barra Inferior Fija Flotante: Contactar al Profesional */}
      <View
        style={[
          styles.bottomFixedBar,
          {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
          },
        ]}>
        <AppButton
          title={`Contactar a ${pro.name.split(' ')[0]}`}
          onPress={() => router.push(`/chat/${pro.id}`)}
          variant="primary"
          size="lg"
          leftIcon={<Ionicons name="chatbubbles-outline" size={24} color="#FFFFFF" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '800',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerCard: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  largeAvatarBox: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  largeAvatarInitial: {
    fontSize: 32,
    fontWeight: '800',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  proName: {
    fontWeight: '800',
  },
  proTrade: {
    marginTop: 2,
  },
  statusRow: {
    marginTop: Spacing.xs,
  },
  statsBar: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing.sm + 2,
    marginBottom: Spacing.md,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statVal: {
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  membershipText: {
    fontWeight: '700',
    flex: 1,
  },
  sectionCard: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  bioText: {
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  rateHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  rateHighlightText: {},
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs + 4,
  },
  serviceText: {
    flex: 1,
  },
  reviewsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  starsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsSummaryVal: {
    fontWeight: '800',
  },
  reviewItem: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewUserName: {
    fontWeight: '700',
  },
  reviewDate: {},
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },
  reviewComment: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
  bottomFixedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    boxShadow: '0 -4px 14px rgba(0, 0, 0, 0.08)',
  },
});
