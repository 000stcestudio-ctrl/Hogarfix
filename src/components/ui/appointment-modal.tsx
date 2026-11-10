import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Palette } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Professional, PaymentMethod } from '@/types';
import { AppButton } from './button';

interface AppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  professional: Professional;
  onSuccessScheduled?: () => void;
}

export function AppointmentModal({
  visible,
  onClose,
  professional,
  onSuccessScheduled,
}: AppointmentModalProps) {
  const { isDarkMode, isLargeText, addAppointment } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const dateOptions = ['Hoy mismo', 'Mañana', 'En 2 días'];
  const [selectedDate, setSelectedDate] = useState('Mañana');

  const timeOptions = [
    'Mañana (8:00 AM - 12:00 PM)',
    'Tarde (1:00 PM - 5:00 PM)',
    'Noche / Urgencia (6:00 PM - 9:00 PM)',
  ];
  const [selectedTime, setSelectedTime] = useState(timeOptions[0]);

  const paymentOptions: PaymentMethod[] = [
    'Efectivo al finalizar',
    'Transferencia Nequi / Daviplata',
    'A convenir en visita',
  ];
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(paymentOptions[0]);

  const handleConfirm = () => {
    addAppointment({
      professionalId: professional.id,
      professionalName: professional.name,
      professionalAvatar: professional.avatarUrl,
      trade: professional.trade,
      date: selectedDate,
      timeSlot: selectedTime,
      paymentMethod: selectedPayment,
      notes: 'Visita técnica formal acordada en chat',
    });

    onClose();
    if (onSuccessScheduled) {
      onSuccessScheduled();
    }
  };

  const titleSize = 22 * (isLargeText ? 1.15 : 1);
  const sectionTitleSize = 17 * (isLargeText ? 1.15 : 1);
  const bodySize = 15 * (isLargeText ? 1.15 : 1);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>
                📅 Agendar Visita
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: bodySize }]}>
                Con {professional.name}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cerrar ventana de agendamiento"
              style={[
                styles.closeButton,
                { backgroundColor: isDarkMode ? '#2D333F' : '#F3F4F6' },
              ]}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* 1. Selector de Fecha */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontSize: sectionTitleSize }]}>
                1. ¿Para cuándo necesitas el servicio?
              </Text>
              <View style={styles.optionsRow}>
                {dateOptions.map((date) => {
                  const isSelected = selectedDate === date;
                  return (
                    <Pressable
                      key={date}
                      onPress={() => setSelectedDate(date)}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      style={[
                        styles.optionPill,
                        {
                          backgroundColor: isSelected
                            ? theme.primary
                            : isDarkMode
                              ? '#262B34'
                              : '#F8FAFC',
                          borderColor: isSelected
                            ? theme.primary
                            : isDarkMode
                              ? '#3A4250'
                              : '#E2E8F0',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: isSelected ? '#FFFFFF' : theme.text,
                            fontSize: bodySize,
                            fontWeight: isSelected ? '700' : '600',
                          },
                        ]}>
                        {date}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 2. Selector de Horario */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontSize: sectionTitleSize }]}>
                2. Franja horaria preferida
              </Text>
              {timeOptions.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <Pressable
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.timeRow,
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
                        styles.timeText,
                        {
                          color: isSelected ? theme.primary : theme.text,
                          fontSize: bodySize,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* 3. Selector de Medio de Pago */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontSize: sectionTitleSize }]}>
                3. Medio de pago acordado
              </Text>
              {paymentOptions.map((method) => {
                const isSelected = selectedPayment === method;
                return (
                  <Pressable
                    key={method}
                    onPress={() => setSelectedPayment(method)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.paymentRow,
                      {
                        backgroundColor: isSelected
                          ? isDarkMode
                            ? 'rgba(16, 185, 129, 0.15)'
                            : '#ECFDF5'
                          : isDarkMode
                            ? '#262B34'
                            : '#F8FAFC',
                        borderColor: isSelected ? Palette.online : isDarkMode ? '#3A4250' : '#E2E8F0',
                      },
                    ]}>
                    <Ionicons
                      name={
                        method.includes('Efectivo')
                          ? 'cash-outline'
                          : method.includes('Nequi')
                            ? 'phone-portrait-outline'
                            : 'hand-right-outline'
                      }
                      size={24}
                      color={isSelected ? Palette.online : theme.textSecondary}
                      style={{ marginRight: Spacing.sm }}
                    />
                    <Text
                      style={[
                        styles.paymentText,
                        {
                          color: isSelected ? (isDarkMode ? '#34D399' : '#065F46') : theme.text,
                          fontSize: bodySize,
                          fontWeight: isSelected ? '700' : '500',
                          flex: 1,
                        },
                      ]}>
                      {method}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color={Palette.online} />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Nota informativa de confianza */}
            <View
              style={[
                styles.noticeBox,
                {
                  backgroundColor: isDarkMode ? '#232936' : '#EFF6FF',
                  borderColor: isDarkMode ? '#3A4458' : '#BFDBFE',
                },
              ]}>
              <Ionicons
                name="shield-checkmark"
                size={22}
                color={theme.primary}
                style={{ marginRight: Spacing.sm }}
              />
              <Text style={[styles.noticeText, { color: theme.text, fontSize: bodySize - 2 }]}>
                <Text style={{ fontWeight: '700' }}>Apretón de manos digital:</Text> El pago se
                acuerda y se entrega directamente al profesional. Hogarfix no retiene tu dinero ni
                cobra comisiones al cliente.
              </Text>
            </View>
          </ScrollView>

          {/* Botón de Confirmación */}
          <View style={styles.footer}>
            <AppButton
              title="Confirmar y Agendar Visita"
              onPress={handleConfirm}
              variant="primary"
              size="lg"
              leftIcon={<Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '88%',
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    minHeight: 46,
    justifyContent: 'center',
  },
  optionText: {},
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    marginBottom: Spacing.xs + 2,
    minHeight: 52,
  },
  timeText: {},
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    marginBottom: Spacing.xs + 2,
    minHeight: 52,
  },
  paymentText: {},
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  noticeText: {
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
  },
});
