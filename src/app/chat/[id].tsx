import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { QUICK_CHIPS } from '@/data/mockData';
import { AppointmentModal } from '@/components/ui/appointment-modal';
import { OnlineBadge } from '@/components/ui/online-badge';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const proId = typeof id === 'string' ? id : 'pro-1';

  const { professionals, chats, sendMessage, isDarkMode, isLargeText } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const pro = professionals.find((p) => p.id === proId) || professionals[0];
  const messages = chats[proId] || [];

  const [inputText, setInputText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages.length]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    sendMessage(proId, text, 'user');
    setInputText('');

    // Simulate smart friendly reply from technician after 1.5 seconds if sent by user
    setTimeout(() => {
      const autoReplies: Record<string, string> = {
        'Hola, necesito una cotización urgente':
          '¡Con mucho gusto! Descríbame el daño o si puede indicarme la dirección exacta para calcular el tiempo de llegada.',
        '¿Tiene disponibilidad para venir hoy?':
          'Sí, tengo espacio en la tarde después de las 2:00 PM. Si gusta podemos agendar la visita con el botón superior.',
        'Tengo una emergencia en mi domicilio':
          'Entendido. Para emergencias puedo desplazarme de inmediato. Por favor presiona "Agendar Visita" arriba para fijar el horario y medio de pago.',
      };

      const reply =
        autoReplies[text] ||
        `Entendido, cuente con mi apoyo profesional para su trabajo. Quedo atento si desea formalizar la visita aquí mismo.`;

      sendMessage(proId, reply, 'pro');
    }, 1200);
  };

  const titleSize = 18 * (isLargeText ? 1.15 : 1);
  const bodySize = 15 * (isLargeText ? 1.15 : 1);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Chat Header */}
        <View
          style={[
            styles.chatHeader,
            {
              backgroundColor: theme.card,
              borderBottomColor: theme.border,
            },
          ]}>
          <Pressable
            onPress={() => router.back()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={[
              styles.backButton,
              { backgroundColor: isDarkMode ? '#252B35' : '#F1F4F9' },
            ]}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>

          <Pressable
            onPress={() => router.push(`/pro/${pro.id}`)}
            style={styles.proHeaderInfo}>
            <View style={[styles.avatarBox, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.avatarInitial, { color: theme.primary }]}>
                {pro.name.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={[styles.proName, { color: theme.text, fontSize: titleSize }]}>
                  {pro.name}
                </Text>
                {pro.isVerified && (
                  <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                )}
              </View>
              <OnlineBadge isOnline={pro.isOnline} size="sm" />
            </View>
          </Pressable>

          {/* Botón Destacado: Agendar Visita */}
          <Pressable
            onPress={() => setModalVisible(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Agendar visita formal con este técnico"
            style={[styles.scheduleBtn, { backgroundColor: theme.primary }]}>
            <Ionicons name="calendar" size={18} color="#FFFFFF" />
            <Text style={styles.scheduleBtnText}>Agendar</Text>
          </Pressable>
        </View>

        {/* Mensajes */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}>
          {/* Banner de Trato Directo */}
          <View
            style={[
              styles.directDealBanner,
              {
                backgroundColor: isDarkMode ? '#222834' : '#EFF6FF',
                borderColor: isDarkMode ? '#343E50' : '#BFDBFE',
              },
            ]}>
            <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
            <Text style={[styles.bannerText, { color: theme.text, fontSize: bodySize - 2 }]}>
              <Text style={{ fontWeight: '800' }}>Chat directo y seguro:</Text> Negocia el valor y
              agenda con tranquilidad. El pago se efectúa directamente en la visita.
            </Text>
          </View>

          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.systemMessageCard,
                    {
                      backgroundColor: isDarkMode ? '#1B2E24' : '#ECFDF5',
                      borderColor: '#10B981',
                    },
                  ]}>
                  <Ionicons name="checkmark-done-circle" size={26} color="#10B981" />
                  <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                    <Text style={[styles.systemTitle, { color: '#065F46', fontSize: bodySize }]}>
                      ¡Visita Formal Confirmada!
                    </Text>
                    <Text style={[styles.systemBody, { color: theme.text, fontSize: bodySize - 1 }]}>
                      {msg.text}
                    </Text>
                    <Pressable
                      onPress={() => router.push('/(tabs)/my-services')}
                      style={styles.viewServiceLink}>
                      <Text style={[styles.viewServiceLinkText, { color: theme.primary, fontSize: bodySize - 2 }]}>
                        Ver en "Mis Servicios" →
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            }

            const isUser = msg.sender === 'user';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubbleWrapper,
                  isUser ? styles.userBubbleWrapper : styles.proBubbleWrapper,
                ]}>
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: isUser
                        ? theme.primary
                        : isDarkMode
                          ? '#262C37'
                          : '#FFFFFF',
                      borderColor: isUser ? theme.primary : theme.border,
                      borderWidth: isUser ? 0 : 1,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.bubbleText,
                      {
                        color: isUser ? '#FFFFFF' : theme.text,
                        fontSize: bodySize,
                      },
                    ]}>
                    {msg.text}
                  </Text>
                  <Text
                    style={[
                      styles.timestamp,
                      {
                        color: isUser ? 'rgba(255, 255, 255, 0.75)' : theme.textMuted,
                        fontSize: bodySize - 3,
                      },
                    ]}>
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Fila de Sugerencias Rápidas (Chips encima del input) */}
        <View
          style={[
            styles.quickChipsSection,
            {
              backgroundColor: theme.card,
              borderTopColor: theme.border,
            },
          ]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}>
            {QUICK_CHIPS.map((chip, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleSend(chip)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Enviar mensaje rápido: ${chip}`}
                style={[
                  styles.quickChipPill,
                  {
                    backgroundColor: isDarkMode ? '#242934' : '#F1F4F9',
                    borderColor: isDarkMode ? '#384152' : '#E2E8F0',
                  },
                ]}>
                <Text style={[styles.quickChipText, { color: theme.text, fontSize: bodySize - 2 }]}>
                  💬 {chip}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: theme.card,
              borderTopColor: theme.border,
            },
          ]}>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: isDarkMode ? '#171B22' : '#F8FAFC',
                borderColor: theme.border,
                color: theme.text,
                fontSize: bodySize,
              },
            ]}
            placeholder="Escribe tu mensaje aquí..."
            placeholderTextColor={theme.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline={true}
          />
          <Pressable
            onPress={() => handleSend()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensaje"
            disabled={!inputText.trim()}
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? theme.primary : isDarkMode ? '#2E3542' : '#E5E7EB',
              },
            ]}>
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? '#FFFFFF' : '#9CA3AF'}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Modal de Agendamiento */}
      <AppointmentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        professional={pro}
        onSuccessScheduled={() => {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 200);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    minHeight: 64,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs + 2,
  },
  proHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.xs,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs + 4,
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '800',
  },
  proName: {
    fontWeight: '700',
  },
  scheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    gap: 4,
    minHeight: 44,
  },
  scheduleBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  messagesContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  directDealBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.xs + 4,
  },
  bannerText: {
    flex: 1,
    lineHeight: 18,
  },
  systemMessageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginVertical: Spacing.sm,
  },
  systemTitle: {
    fontWeight: '800',
    marginBottom: 2,
  },
  systemBody: {
    lineHeight: 20,
  },
  viewServiceLink: {
    marginTop: Spacing.xs + 2,
  },
  viewServiceLinkText: {
    fontWeight: '700',
  },
  messageBubbleWrapper: {
    marginVertical: 4,
    maxWidth: '82%',
  },
  userBubbleWrapper: {
    alignSelf: 'flex-end',
  },
  proBubbleWrapper: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.lg,
  },
  bubbleText: {
    lineHeight: 21,
  },
  timestamp: {
    textAlign: 'right',
    marginTop: 4,
  },
  quickChipsSection: {
    borderTopWidth: 1,
    paddingVertical: Spacing.xs + 2,
  },
  chipsScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs + 2,
  },
  quickChipPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: 'center',
  },
  quickChipText: {
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 4,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
