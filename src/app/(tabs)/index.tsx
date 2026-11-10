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
import { CATEGORIES } from '@/data/mockData';
import { AppCard } from '@/components/ui/card';
import { OnlineBadge } from '@/components/ui/online-badge';

export default function HomeScreen() {
  const router = useRouter();
  const { user, appointments, professionals, isDarkMode, isLargeText } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const nextAppointment = appointments.find((a) => a.status === 'agendado');

  const searchTags = [
    { label: 'Fuga de agua', query: 'plomeria' },
    { label: 'Cambiar cerradura', query: 'cerrajeria' },
    { label: 'Cortocircuito', query: 'electricidad' },
    { label: 'Aseo a fondo', query: 'aseo' },
    { label: 'Pintura y muros', query: 'obra' },
  ];

  const firstName = user.name ? user.name.split(' ')[0] : 'Vecina';

  const titleSize = 24 * (isLargeText ? 1.15 : 1);
  const subtitleSize = 16 * (isLargeText ? 1.15 : 1);
  const cardTitleSize = 18 * (isLargeText ? 1.15 : 1);
  const bodySize = 15 * (isLargeText ? 1.15 : 1);

  const handleSelectTag = (query: string) => {
    router.push({
      pathname: '/(tabs)/explore',
      params: { category: query },
    });
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/(tabs)/explore',
        params: { q: searchQuery.trim() },
      });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* User Greeting Header */}
        <View style={styles.topHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greetingSubtitle, { color: theme.textSecondary, fontSize: bodySize }]}>
              📍 {user.address ? user.address.split(',')[0] : 'Bogotá'}
            </Text>
            <Text style={[styles.greetingTitle, { color: theme.text, fontSize: titleSize }]}>
              Hola, {firstName} 👋
            </Text>
            <Text style={[styles.greetingQuestion, { color: theme.primary, fontSize: subtitleSize }]}>
              ¿Qué necesitas solucionar hoy?
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/(tabs)/settings')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Ir a configuración y perfil"
            style={[
              styles.avatarButton,
              { backgroundColor: theme.primaryLight, borderColor: theme.primary },
            ]}>
            <Text style={[styles.avatarInitials, { color: theme.primary }]}>
              {firstName.charAt(0)}
            </Text>
          </Pressable>
        </View>

        {/* Buscador Interactivo Central Expandible */}
        <View style={styles.searchSection}>
          <AppCard
            style={[
              styles.searchCard,
              {
                borderColor: isSearchExpanded ? theme.primary : theme.border,
                borderWidth: isSearchExpanded ? 2 : 1,
              },
            ]}>
            <Pressable
              onPress={() => setIsSearchExpanded(true)}
              style={styles.searchHeaderRow}>
              <View style={[styles.searchIconCircle, { backgroundColor: theme.primary }]}>
                <Ionicons name="search" size={24} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.searchMainPrompt, { color: theme.text, fontSize: subtitleSize }]}>
                  {isSearchExpanded ? 'Describe tu problema o profesión:' : 'Toca para buscar o describir tu daño...'}
                </Text>
                {!isSearchExpanded && (
                  <Text style={[styles.searchSubPrompt, { color: theme.textMuted, fontSize: bodySize - 2 }]}>
                    Ej. plomero, cerradura trabada, limpiar casa
                  </Text>
                )}
              </View>
              {isSearchExpanded && (
                <Pressable
                  onPress={() => {
                    setIsSearchExpanded(false);
                    setSearchQuery('');
                  }}
                  accessibilityLabel="Cerrar búsqueda">
                  <Ionicons name="close-circle" size={24} color={theme.textMuted} />
                </Pressable>
              )}
            </Pressable>

            {isSearchExpanded && (
              <View style={styles.expandedInputArea}>
                <View
                  style={[
                    styles.inputFieldBox,
                    { backgroundColor: isDarkMode ? '#171B22' : '#F8FAFC', borderColor: theme.border },
                  ]}>
                  <TextInput
                    style={[styles.textInput, { color: theme.text, fontSize: bodySize }]}
                    placeholder="Escribe aquí (ej. fuga de agua urgente)..."
                    placeholderTextColor={theme.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearchSubmit}
                    autoFocus={true}
                    returnKeyType="search"
                  />
                  {searchQuery.length > 0 && (
                    <Pressable
                      onPress={handleSearchSubmit}
                      style={[styles.sendSearchBtn, { backgroundColor: theme.primary }]}>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </Pressable>
                  )}
                </View>

                {/* Tags sugeridos debajo de la barra */}
                <Text style={[styles.tagsHeading, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                  Sugerencias rápidas:
                </Text>
                <View style={styles.tagsRow}>
                  {searchTags.map((tag) => (
                    <Pressable
                      key={tag.label}
                      onPress={() => handleSelectTag(tag.query)}
                      style={[
                        styles.tagPill,
                        {
                          backgroundColor: isDarkMode ? '#282F3B' : '#EFF6FF',
                          borderColor: isDarkMode ? '#3B4556' : '#DBEAFE',
                        },
                      ]}>
                      <Text style={[styles.tagText, { color: theme.primary, fontSize: bodySize - 2 }]}>
                        ⚡ {tag.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </AppCard>
        </View>

        {/* Próxima Visita / Servicio Pendiente (si existe) */}
        {nextAppointment && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontSize: cardTitleSize }]}>
                🔔 Tu Próxima Visita
              </Text>
              <Pressable onPress={() => router.push('/(tabs)/my-services')}>
                <Text style={[styles.seeAllText, { color: theme.primary, fontSize: bodySize }]}>
                  Ver todos
                </Text>
              </Pressable>
            </View>

            <AppCard
              onPress={() => router.push(`/chat/${nextAppointment.professionalId}`)}
              style={styles.appointmentCard}>
              <View style={styles.appCardHeader}>
                <View style={[styles.calendarIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="calendar" size={24} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.appDate, { color: theme.primary, fontSize: bodySize }]}>
                    {nextAppointment.date}
                  </Text>
                  <Text style={[styles.appProName, { color: theme.text, fontSize: subtitleSize }]}>
                    {nextAppointment.professionalName}
                  </Text>
                  <Text style={[styles.appTrade, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                    {nextAppointment.trade}
                  </Text>
                </View>
                <View style={styles.chatPromptBadge}>
                  <Ionicons name="chatbubbles" size={18} color="#FFFFFF" />
                  <Text style={styles.chatPromptText}>Chat</Text>
                </View>
              </View>

              <View
                style={[
                  styles.paymentNoticeRow,
                  { backgroundColor: isDarkMode ? '#252B35' : '#F8FAFC' },
                ]}>
                <Ionicons name="cash-outline" size={18} color="#10B981" />
                <Text style={[styles.paymentMethodNotice, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                  Pago acordado: <Text style={{ fontWeight: '700', color: theme.text }}>{nextAppointment.paymentMethod}</Text>
                </Text>
              </View>
            </AppCard>
          </View>
        )}

        {/* Categorías Rápidas */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: cardTitleSize }]}>
            Oficios y Especialidades
          </Text>
          <Text style={[styles.sectionSub, { color: theme.textSecondary, fontSize: bodySize - 1 }]}>
            Toca una especialidad para ver técnicos disponibles:
          </Text>

          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/explore',
                    params: { category: cat.id },
                  })
                }
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Ver profesionales de ${cat.name}`}
                style={[
                  styles.categoryCircleBtn,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}>
                <View style={[styles.categoryIconWrap, { backgroundColor: `${cat.color}15` }]}>
                  <Ionicons name={cat.iconName as any} size={30} color={cat.color} />
                </View>
                <Text
                  style={[styles.categoryLabel, { color: theme.text, fontSize: bodySize - 1 }]}
                  numberOfLines={2}>
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Profesionales Destacados */}
        <View style={[styles.sectionBlock, { marginBottom: Spacing.xl }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: cardTitleSize }]}>
              ⭐ Técnicos Destacados
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/explore')}>
              <Text style={[styles.seeAllText, { color: theme.primary, fontSize: bodySize }]}>
                Ver directorio
              </Text>
            </Pressable>
          </View>

          {professionals.slice(0, 3).map((pro) => (
            <AppCard
              key={pro.id}
              onPress={() => router.push(`/pro/${pro.id}`)}
              style={styles.proCardRow}>
              <View style={styles.proCardInner}>
                <View style={[styles.proAvatarBox, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.proAvatarInitials, { color: theme.primary }]}>
                    {pro.name.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.proNameBadgeRow}>
                    <Text style={[styles.proName, { color: theme.text, fontSize: subtitleSize }]}>
                      {pro.name}
                    </Text>
                    {pro.isVerified && (
                      <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
                    )}
                  </View>
                  <Text style={[styles.proTradeText, { color: theme.textSecondary, fontSize: bodySize - 2 }]}>
                    {pro.trade}
                  </Text>

                  <View style={styles.proMetaRow}>
                    <Text style={[styles.proRating, { color: '#F59E0B', fontSize: bodySize - 2 }]}>
                      ★ {pro.rating.toFixed(1)} ({pro.reviewCount} trabajos)
                    </Text>
                    <OnlineBadge isOnline={pro.isOnline} size="sm" />
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={22} color={theme.textMuted} />
              </View>
            </AppCard>
          ))}
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
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greetingSubtitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  greetingTitle: {
    fontWeight: '800',
  },
  greetingQuestion: {
    fontWeight: '700',
    marginTop: 2,
  },
  avatarButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
  },
  searchSection: {
    marginBottom: Spacing.xl,
  },
  searchCard: {
    padding: Spacing.md,
  },
  searchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
  },
  searchIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  searchMainPrompt: {
    fontWeight: '700',
  },
  searchSubPrompt: {
    marginTop: 2,
  },
  expandedInputArea: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    paddingTop: Spacing.md,
  },
  inputFieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 50,
    marginBottom: Spacing.md,
  },
  textInput: {
    flex: 1,
    minHeight: 46,
  },
  sendSearchBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  tagsHeading: {
    fontWeight: '600',
    marginBottom: Spacing.xs + 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
  },
  tagPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  tagText: {
    fontWeight: '600',
  },
  sectionBlock: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontWeight: '800',
  },
  sectionSub: {
    marginBottom: Spacing.md,
  },
  seeAllText: {
    fontWeight: '700',
  },
  appointmentCard: {
    padding: Spacing.md,
  },
  appCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  calendarIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  appDate: {
    fontWeight: '800',
  },
  appProName: {
    fontWeight: '700',
  },
  appTrade: {
    marginTop: 1,
  },
  chatPromptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D5BFF',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    gap: 4,
  },
  chatPromptText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  paymentNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    gap: Spacing.xs,
  },
  paymentMethodNotice: {},
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryCircleBtn: {
    width: '30%',
    flexGrow: 1,
    minHeight: 110,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  categoryIconWrap: {
    width: 54,
    height: 54,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  categoryLabel: {
    fontWeight: '700',
    textAlign: 'center',
  },
  proCardRow: {
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  proCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proAvatarBox: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  proAvatarInitials: {
    fontSize: 22,
    fontWeight: '800',
  },
  proNameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  proName: {
    fontWeight: '700',
  },
  proTradeText: {
    marginTop: 1,
  },
  proMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  proRating: {
    fontWeight: '700',
  },
});
