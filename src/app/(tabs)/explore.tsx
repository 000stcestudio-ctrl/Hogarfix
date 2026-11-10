import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import { AppCard } from '@/components/ui/card';
import { OnlineBadge } from '@/components/ui/online-badge';
import { AppButton } from '@/components/ui/button';

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { professionals, isDarkMode, isLargeText } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [minRatingFilter, setMinRatingFilter] = useState(false);

  useEffect(() => {
    if (params.category && typeof params.category === 'string') {
      setSelectedCategory(params.category);
    }
    if (params.q && typeof params.q === 'string') {
      setSearch(params.q);
    }
  }, [params.category, params.q]);

  const filteredPros = professionals.filter((pro) => {
    // 1. Category match
    if (selectedCategory !== 'todos' && pro.category !== selectedCategory) {
      return false;
    }
    // 2. Rating match
    if (minRatingFilter && pro.rating < 4.85) {
      return false;
    }
    // 3. Search text match
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = pro.name.toLowerCase().includes(q);
      const matchTrade = pro.trade.toLowerCase().includes(q);
      const matchBio = pro.bio.toLowerCase().includes(q);
      const matchServices = pro.servicesOffered.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchTrade && !matchBio && !matchServices) {
        return false;
      }
    }
    return true;
  });

  const titleSize = 26 * (isLargeText ? 1.15 : 1);
  const cardTitleSize = 18 * (isLargeText ? 1.15 : 1);
  const bodySize = 15 * (isLargeText ? 1.15 : 1);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>
            Directorio de Técnicos
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: bodySize }]}>
            Profesionales verificados con membresía activa para tu hogar.
          </Text>
        </View>

        {/* Search Bar Input */}
        <View
          style={[
            styles.searchBarBox,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}>
          <Ionicons name="search" size={22} color={theme.textSecondary} style={{ marginRight: Spacing.sm }} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, fontSize: bodySize }]}
            placeholder="Buscar por nombre, daño u oficio..."
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} accessibilityLabel="Limpiar texto">
              <Ionicons name="close-circle" size={20} color={theme.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Filter Chips Horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}>
          <Pressable
            onPress={() => setSelectedCategory('todos')}
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'todos' }}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedCategory === 'todos' ? theme.primary : theme.card,
                borderColor: selectedCategory === 'todos' ? theme.primary : theme.border,
              },
            ]}>
            <Text
              style={[
                styles.filterChipText,
                {
                  color: selectedCategory === 'todos' ? '#FFFFFF' : theme.text,
                  fontWeight: selectedCategory === 'todos' ? '700' : '600',
                  fontSize: bodySize - 1,
                },
              ]}>
              Todos
            </Text>
          </Pressable>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(isSelected ? 'todos' : cat.id)}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}>
                <Ionicons
                  name={cat.iconName as any}
                  size={16}
                  color={isSelected ? '#FFFFFF' : cat.color}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.text,
                      fontWeight: isSelected ? '700' : '600',
                      fontSize: bodySize - 1,
                    },
                  ]}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            onPress={() => setMinRatingFilter(!minRatingFilter)}
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ selected: minRatingFilter }}
            style={[
              styles.filterChip,
              {
                backgroundColor: minRatingFilter ? '#F59E0B' : theme.card,
                borderColor: minRatingFilter ? '#F59E0B' : theme.border,
              },
            ]}>
            <Ionicons
              name="star"
              size={16}
              color={minRatingFilter ? '#FFFFFF' : '#F59E0B'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.filterChipText,
                {
                  color: minRatingFilter ? '#FFFFFF' : theme.text,
                  fontWeight: minRatingFilter ? '700' : '600',
                  fontSize: bodySize - 1,
                },
              ]}>
              4.85+ ★
            </Text>
          </Pressable>
        </ScrollView>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsCountText, { color: theme.textSecondary, fontSize: bodySize - 1 }]}>
            {filteredPros.length} técnicos encontrados
          </Text>
        </View>

        {/* Professionals List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.prosList}>
          {filteredPros.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={54} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text, fontSize: cardTitleSize }]}>
                No se encontraron profesionales
              </Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary, fontSize: bodySize }]}>
                Prueba borrando los filtros o buscando con otro término.
              </Text>
              <AppButton
                title="Ver todos los técnicos"
                onPress={() => {
                  setSelectedCategory('todos');
                  setMinRatingFilter(false);
                  setSearch('');
                }}
                variant="outline"
                size="md"
                style={{ marginTop: Spacing.md }}
              />
            </View>
          ) : (
            filteredPros.map((pro) => (
              <AppCard
                key={pro.id}
                onPress={() => router.push(`/pro/${pro.id}`)}
                style={styles.proCard}>
                <View style={styles.proCardTop}>
                  <View style={[styles.avatarBox, { borderColor: theme.primary, backgroundColor: theme.primaryLight }]}>
                    <Text style={[styles.avatarInitial, { color: theme.primary }]}>
                      {pro.name.charAt(0)}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.nameVerifiedRow}>
                      <Text style={[styles.proNameText, { color: theme.text, fontSize: cardTitleSize }]}>
                        {pro.name}
                      </Text>
                      {pro.isVerified && (
                        <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                      )}
                    </View>

                    <Text style={[styles.tradeSub, { color: theme.textSecondary, fontSize: bodySize - 1 }]}>
                      {pro.trade}
                    </Text>

                    <View style={styles.ratingAndStatusRow}>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={16} color="#F59E0B" />
                        <Text style={[styles.ratingText, { fontSize: bodySize - 1 }]}>
                          {pro.rating.toFixed(1)}
                        </Text>
                        <Text style={[styles.reviewsCount, { color: theme.textMuted, fontSize: bodySize - 2 }]}>
                          ({pro.reviewCount})
                        </Text>
                      </View>
                      <OnlineBadge isOnline={pro.isOnline} size="sm" />
                    </View>
                  </View>
                </View>

                {/* Tarifa y experiencia */}
                <View
                  style={[
                    styles.rateBox,
                    {
                      backgroundColor: isDarkMode ? '#242933' : '#F8FAFC',
                      borderColor: theme.border,
                    },
                  ]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rateLabel, { color: theme.textSecondary, fontSize: bodySize - 3 }]}>
                      Tarifa de referencia:
                    </Text>
                    <Text style={[styles.rateVal, { color: theme.text, fontSize: bodySize - 1 }]}>
                      {pro.visitRate}
                    </Text>
                  </View>
                  <View style={styles.expBox}>
                    <Text style={[styles.expText, { color: theme.primary, fontSize: bodySize - 2 }]}>
                      🏅 {pro.experienceYears} años exp.
                    </Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <AppButton
                    title="Ver Perfil Completo"
                    onPress={() => router.push(`/pro/${pro.id}`)}
                    variant="primary"
                    size="md"
                    rightIcon={<Ionicons name="chevron-forward" size={18} color="#FFFFFF" />}
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
    marginBottom: Spacing.sm,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
    marginVertical: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    minHeight: 48,
  },
  chipsContainer: {
    paddingVertical: Spacing.xs,
    gap: Spacing.xs + 2,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 4,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    minHeight: 44,
  },
  filterChipText: {},
  resultsHeader: {
    paddingVertical: Spacing.xs + 2,
  },
  resultsCountText: {
    fontWeight: '600',
  },
  prosList: {
    paddingBottom: Spacing.xxl,
  },
  proCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  proCardTop: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: '800',
  },
  nameVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  proNameText: {
    fontWeight: '700',
  },
  tradeSub: {
    marginTop: 1,
  },
  ratingAndStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontWeight: '700',
    color: '#F59E0B',
  },
  reviewsCount: {},
  rateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  rateLabel: {
    fontWeight: '500',
  },
  rateVal: {
    fontWeight: '700',
  },
  expBox: {},
  expText: {
    fontWeight: '700',
  },
  cardActions: {
    marginTop: Spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontWeight: '800',
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySub: {
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
