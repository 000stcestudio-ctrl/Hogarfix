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
import { AppButton } from '@/components/ui/button';

export default function OnboardingScreen() {
  const router = useRouter();
  const { isDarkMode, isLargeText, updateUser } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  // Pregunta 1
  const freqOptions = ['Semanal', 'Mensual', 'Solo emergencias'];
  const [frequency, setFrequency] = useState('Mensual');

  // Pregunta 2 (multiselección)
  const serviceOptions = ['Fontanería', 'Electricidad', 'Aseo', 'Cerrajería', 'Obra'];
  const [selectedServices, setSelectedServices] = useState<string[]>(['Fontanería', 'Cerrajería']);

  // Pregunta 3
  const timeOptions = ['Con anticipación', 'Atención el mismo día', 'Ambos según el caso'];
  const [sameDay, setSameDay] = useState('Con anticipación');

  const titleSize = 24 * (isLargeText ? 1.15 : 1);
  const qTitleSize = 17 * (isLargeText ? 1.15 : 1);
  const optionSize = 15 * (isLargeText ? 1.15 : 1);

  const toggleService = (s: string) => {
    if (selectedServices.includes(s)) {
      setSelectedServices(selectedServices.filter((item) => item !== s));
    } else {
      setSelectedServices([...selectedServices, s]);
    }
  };

  const handleFinish = () => {
    updateUser({
      frequency,
      urgentServices: selectedServices,
      sameDayPreference: sameDay,
    });

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.badgeStep, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.badgeStepText, { color: theme.primary }]}>Paso 2 de 2 • Personalización</Text>
          </View>
          <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>
            Queremos conocer tus necesidades
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: optionSize }]}>
            Solo 3 preguntas rápidas para mostrarte los mejores técnicos en tu zona.
          </Text>
        </View>

        {/* Card contenedor flotante */}
        <View
          style={[
            styles.floatingCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}>
          {/* Pregunta 1 */}
          <View style={styles.questionBlock}>
            <Text style={[styles.questionTitle, { color: theme.text, fontSize: qTitleSize }]}>
              1. ¿Con qué frecuencia requieres servicios en casa?
            </Text>
            <View style={styles.optionsCol}>
              {freqOptions.map((opt) => {
                const isSelected = frequency === opt;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => setFrequency(opt)}
                    accessible={true}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.selectableRow,
                      {
                        backgroundColor: isSelected
                          ? isDarkMode
                            ? 'rgba(13, 91, 255, 0.2)'
                            : '#EFF4FF'
                          : isDarkMode
                            ? '#262B34'
                            : '#F8FAFC',
                        borderColor: isSelected ? theme.primary : isDarkMode ? '#3A4250' : '#E2E8F0',
                      },
                    ]}>
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={22}
                      color={isSelected ? theme.primary : '#9CA3AF'}
                      style={{ marginRight: Spacing.sm }}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: isSelected ? theme.primary : theme.text,
                          fontSize: optionSize,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Pregunta 2 */}
          <View style={styles.questionBlock}>
            <Text style={[styles.questionTitle, { color: theme.text, fontSize: qTitleSize }]}>
              2. ¿Qué servicios son más urgentes o comunes para ti?
            </Text>
            <Text style={[styles.hintText, { color: theme.textMuted, fontSize: optionSize - 2 }]}>
              Puedes seleccionar varios:
            </Text>
            <View style={styles.chipsWrap}>
              {serviceOptions.map((s) => {
                const isSelected = selectedServices.includes(s);
                return (
                  <Pressable
                    key={s}
                    onPress={() => toggleService(s)}
                    accessible={true}
                    accessibilityRole="checkbox"
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? theme.primary
                          : isDarkMode
                            ? '#262B34'
                            : '#F1F4F9',
                        borderColor: isSelected ? theme.primary : isDarkMode ? '#3A4250' : '#E2E8F0',
                      },
                    ]}>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color="#FFFFFF"
                        style={{ marginRight: Spacing.xs }}
                      />
                    )}
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? '#FFFFFF' : theme.text,
                          fontSize: optionSize,
                          fontWeight: isSelected ? '700' : '600',
                        },
                      ]}>
                      {s}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Pregunta 3 */}
          <View style={[styles.questionBlock, { marginBottom: Spacing.sm }]}>
            <Text style={[styles.questionTitle, { color: theme.text, fontSize: qTitleSize }]}>
              3. ¿Prefieres agendar con anticipación o el mismo día?
            </Text>
            <View style={styles.optionsCol}>
              {timeOptions.map((opt) => {
                const isSelected = sameDay === opt;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => setSameDay(opt)}
                    accessible={true}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.selectableRow,
                      {
                        backgroundColor: isSelected
                          ? isDarkMode
                            ? 'rgba(13, 91, 255, 0.2)'
                            : '#EFF4FF'
                          : isDarkMode
                            ? '#262B34'
                            : '#F8FAFC',
                        borderColor: isSelected ? theme.primary : isDarkMode ? '#3A4250' : '#E2E8F0',
                      },
                    ]}>
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={22}
                      color={isSelected ? theme.primary : '#9CA3AF'}
                      style={{ marginRight: Spacing.sm }}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: isSelected ? theme.primary : theme.text,
                          fontSize: optionSize,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Botón Finalizar */}
        <AppButton
          title="Finalizar y Entrar a Hogarfix"
          onPress={handleFinish}
          variant="primary"
          size="lg"
          style={{ marginTop: Spacing.md, marginBottom: Spacing.xl }}
          rightIcon={<Ionicons name="sparkles" size={20} color="#FFFFFF" />}
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
  header: {
    marginBottom: Spacing.lg,
  },
  badgeStep: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  badgeStepText: {
    fontWeight: '700',
    fontSize: 13,
  },
  title: {
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    lineHeight: 22,
  },
  floatingCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  questionBlock: {
    marginBottom: Spacing.xl,
  },
  questionTitle: {
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  hintText: {
    marginBottom: Spacing.sm,
  },
  optionsCol: {
    gap: Spacing.xs + 2,
  },
  selectableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    minHeight: 52,
  },
  optionLabel: {
    flex: 1,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    minHeight: 46,
  },
  chipText: {},
});
