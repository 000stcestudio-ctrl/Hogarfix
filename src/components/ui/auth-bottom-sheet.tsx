import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

interface AuthBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedRole: UserRole;
  onSelectAction: (action: 'google' | 'apple' | 'guest') => void;
  isLoading?: boolean;
}

export function AuthBottomSheet({
  visible,
  onClose,
  selectedRole,
  onSelectAction,
  isLoading = false,
}: AuthBottomSheetProps) {
  const { isDarkMode, isLargeText } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const titleSize = 22 * (isLargeText ? 1.15 : 1);
  const subtitleSize = 14 * (isLargeText ? 1.15 : 1);
  const buttonTitleSize = 16 * (isLargeText ? 1.15 : 1);
  const hintSize = 12 * (isLargeText ? 1.15 : 1);

  const isClient = selectedRole === 'client';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}>
          {/* Barra superior de arrastre */}
          <View style={styles.dragHandleContainer}>
            <View
              style={[
                styles.dragHandle,
                { backgroundColor: isDarkMode ? '#475569' : '#CBD5E1' },
              ]}
            />
          </View>

          {/* Header con Rol */}
          <View style={styles.header}>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: isClient ? '#EFF6FF' : '#FFF7ED',
                  borderColor: isClient ? '#BFDBFE' : '#FED7AA',
                },
              ]}>
              <Ionicons
                name={isClient ? 'search' : 'briefcase'}
                size={16}
                color={isClient ? theme.primary : '#EA580C'}
              />
              <Text
                style={[
                  styles.roleBadgeText,
                  { color: isClient ? theme.primary : '#EA580C' },
                ]}>
                {isClient ? 'Modo Cliente / Hogar' : 'Modo Profesional / Técnico'}
              </Text>
            </View>

            <Text
              style={[
                styles.sheetTitle,
                { color: theme.text, fontSize: titleSize },
              ]}>
              {isClient
                ? '¿Cómo deseas continuar?'
                : 'Acceso para Prestadores'}
            </Text>

            <Text
              style={[
                styles.sheetSubtitle,
                { color: theme.textSecondary, fontSize: subtitleSize },
              ]}>
              {isClient
                ? 'Selecciona tu método favorito para consultar técnicos o agendar servicios.'
                : 'Inicia sesión para activar tu membresía de $10 USD/mes y publicar tus servicios.'}
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text
                style={[
                  styles.loadingText,
                  { color: theme.textSecondary, fontSize: subtitleSize },
                ]}>
                Conectando cuenta de forma segura...
              </Text>
            </View>
          ) : (
            <View style={styles.actionsList}>
              {/* Opción 1: Continuar con Google */}
              <Pressable
                onPress={() => onSelectAction('google')}
                accessibilityRole="button"
                accessibilityLabel="Continuar con Google"
                style={({ pressed }) => [
                  styles.authButton,
                  styles.googleButton,
                  {
                    backgroundColor: isDarkMode ? '#242C39' : '#FFFFFF',
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}>
                <View style={styles.iconCircleGoogle}>
                  <Ionicons name="logo-google" size={20} color="#EA4335" />
                </View>
                <View style={styles.btnTextCol}>
                  <Text
                    style={[
                      styles.btnPrimaryText,
                      { color: theme.text, fontSize: buttonTitleSize },
                    ]}>
                    Continuar con Google
                  </Text>
                  <Text
                    style={[
                      styles.btnSecondaryText,
                      { color: theme.textSecondary, fontSize: hintSize },
                    ]}>
                    Ingreso rápido con un toque
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.textMuted}
                />
              </Pressable>

              {/* Opción 2: Continuar con Apple */}
              <Pressable
                onPress={() => onSelectAction('apple')}
                accessibilityRole="button"
                accessibilityLabel="Continuar con Apple"
                style={({ pressed }) => [
                  styles.authButton,
                  {
                    backgroundColor: isDarkMode ? '#0F172A' : '#000000',
                    borderColor: isDarkMode ? '#334155' : '#000000',
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}>
                <View style={styles.iconCircleApple}>
                  <Ionicons name="logo-apple" size={22} color="#FFFFFF" />
                </View>
                <View style={styles.btnTextCol}>
                  <Text
                    style={[
                      styles.btnPrimaryText,
                      { color: '#FFFFFF', fontSize: buttonTitleSize },
                    ]}>
                    Continuar con Apple
                  </Text>
                  <Text
                    style={[
                      styles.btnSecondaryText,
                      { color: '#CBD5E1', fontSize: hintSize },
                    ]}>
                    Máxima privacidad con Apple ID
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>

              {/* Opción 3: Continuar sin cuenta (Invitado Anti-bugs) */}
              <Pressable
                onPress={() => onSelectAction('guest')}
                accessibilityRole="button"
                accessibilityLabel="Continuar sin cuenta"
                style={({ pressed }) => [
                  styles.authButton,
                  styles.guestButton,
                  {
                    backgroundColor: isDarkMode ? '#1E2530' : '#F8FAFC',
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}>
                <View
                  style={[
                    styles.iconCircleGuest,
                    { backgroundColor: isClient ? '#EFF6FF' : '#FEF3C7' },
                  ]}
                >
                  <Ionicons
                    name={isClient ? 'flash' : 'eye-outline'}
                    size={20}
                    color={isClient ? theme.primary : '#D97706'}
                  />
                </View>
                <View style={styles.btnTextCol}>
                  <View style={styles.guestTitleRow}>
                    <Text
                      style={[
                        styles.btnPrimaryText,
                        { color: theme.text, fontSize: buttonTitleSize },
                      ]}>
                      Continuar sin cuenta
                    </Text>
                    <View
                      style={[
                        styles.guestBadgePill,
                        { backgroundColor: isClient ? '#DBEAFE' : '#FEF3C7' },
                      ]}>
                      <Text
                        style={[
                          styles.guestBadgeText,
                          { color: isClient ? theme.primary : '#B45309' },
                        ]}>
                        {isClient ? 'Modo Invitado' : 'Vista Previa'}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.btnSecondaryText,
                      { color: theme.textSecondary, fontSize: hintSize },
                    ]}>
                    {isClient
                      ? 'Explora y busca técnicos al instante'
                      : 'Ver el panel antes de activar la membresía'}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.textMuted}
                />
              </Pressable>
            </View>
          )}

          {/* Nota informativa de seguridad */}
          <View
            style={[
              styles.securityNote,
              {
                backgroundColor: isDarkMode ? '#17202C' : '#F1F5F9',
                borderColor: isDarkMode ? '#2D3748' : '#E2E8F0',
              },
            ]}>
            <Ionicons
              name="shield-checkmark"
              size={18}
              color={theme.primary}
              style={{ marginRight: Spacing.xs + 2 }}
            />
            <Text
              style={[
                styles.securityNoteText,
                { color: theme.textSecondary, fontSize: hintSize },
              ]}>
              {isClient
                ? 'Tus datos de navegación se guardan de forma segura y podrás vincular tu cuenta cuando quieras.'
                : 'Para publicar tus servicios y procesar tu membresía de $10 USD/mes, se requiere una cuenta verificada.'}
            </Text>
          </View>

          {/* Botón cancelar */}
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
            style={styles.cancelBtn}>
            <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>
              Cancelar y volver
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    boxShadow: '0 -10px 25px rgba(0,0,0,0.2)',
    elevation: 24,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: Radius.full,
  },
  header: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginBottom: Spacing.xs + 2,
    gap: 6,
  },
  roleBadgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  sheetTitle: {
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    lineHeight: 20,
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    fontWeight: '600',
  },
  actionsList: {
    gap: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  googleButton: {
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    elevation: 1,
  },
  guestButton: {},
  iconCircleGoogle: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconCircleApple: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconCircleGuest: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  btnTextCol: {
    flex: 1,
  },
  guestTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestBadgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  guestBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  btnPrimaryText: {
    fontWeight: '700',
  },
  btnSecondaryText: {
    marginTop: 2,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginTop: Spacing.md,
  },
  securityNoteText: {
    flex: 1,
    lineHeight: 17,
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.xs,
  },
  cancelBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
