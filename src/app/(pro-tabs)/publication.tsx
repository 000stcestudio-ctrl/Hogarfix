import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Pressable,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { AppCard } from '@/components/ui/card';
import { AppButton } from '@/components/ui/button';

export default function ProPublicationScreen() {
  const router = useRouter();
  const {
    isDarkMode,
    isLargeText,
    providerPublication,
    updateProviderPublication,
    addPortfolioPhoto,
    removePortfolioPhoto,
    addAdditionalMedia,
    removeAdditionalMedia,
  } = useApp();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  // Estados locales editables
  const [name, setName] = useState(providerPublication.name);
  const [trade, setTrade] = useState(providerPublication.trade);
  const [bio, setBio] = useState(providerPublication.bio);
  const [phone, setPhone] = useState(providerPublication.phone);
  const [visitRate, setVisitRate] = useState(providerPublication.visitRate);
  const [avatarUrl, setAvatarUrl] = useState(providerPublication.avatarUrl);

  // Modales para agregar fotos/videos
  const [addPhotoModalVisible, setAddPhotoModalVisible] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const [addMediaModalVisible, setAddMediaModalVisible] = useState(false);
  const [newMediaType, setNewMediaType] = useState<'photo' | 'video'>('video');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');

  const titleSize = 24 * (isLargeText ? 1.15 : 1);
  const cardTitleSize = 18 * (isLargeText ? 1.15 : 1);
  const bodySize = 14 * (isLargeText ? 1.15 : 1);

  // Opciones predefinidas de fotos de avatar
  const avatarPresets = [
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  ];

  const handleSaveAll = () => {
    updateProviderPublication({
      name,
      trade,
      bio,
      phone,
      visitRate,
      avatarUrl,
    });

    Alert.alert(
      '¡Publicación Actualizada!',
      'Los cambios en tu perfil, fotos y videos ya son visibles para todos los clientes en el directorio.',
      [{ text: 'Entendido' }]
    );
  };

  const handleConfirmAddPhoto = () => {
    if (!newPhotoUrl.trim()) {
      Alert.alert('URL requerida', 'Por favor ingresa una URL de imagen o usa una sugerida.');
      return;
    }
    addPortfolioPhoto(newPhotoUrl.trim());
    setNewPhotoUrl('');
    setAddPhotoModalVisible(false);
  };

  const handleConfirmAddMedia = () => {
    if (!newMediaUrl.trim()) {
      Alert.alert('URL requerida', 'Por favor ingresa la URL del video o foto promocional.');
      return;
    }
    addAdditionalMedia({
      type: newMediaType,
      url: newMediaUrl.trim(),
      title: newMediaTitle.trim() || (newMediaType === 'video' ? 'Video demostrativo de trabajo' : 'Foto adicional de equipos'),
    });
    setNewMediaUrl('');
    setNewMediaTitle('');
    setAddMediaModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>
            Mi Publicación
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: bodySize }]}>
            Personaliza tu vitrina para llamar la atención de clientes potenciales
          </Text>
        </View>

        {/* 1. SECCIÓN: FOTO DE PERFIL */}
        <AppCard style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: cardTitleSize }]}>
            1. Foto de Perfil
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary, fontSize: bodySize - 1 }]}>
            Una foto profesional y amigable genera un 80% más de confianza.
          </Text>

          <View style={styles.avatarRow}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: avatarUrl }} style={styles.avatarBig} />
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.presetLabel, { color: theme.text, fontSize: bodySize - 1 }]}>
                Selecciona una foto o avatar:
              </Text>
              <View style={styles.presetsList}>
                {avatarPresets.map((uri, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => setAvatarUrl(uri)}
                    style={[
                      styles.presetItem,
                      { borderColor: avatarUrl === uri ? '#FF7A00' : 'transparent' },
                    ]}>
                    <Image source={{ uri }} style={styles.presetThumb} />
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </AppCard>

        {/* 2. SECCIÓN: INFORMACIÓN Y DESCRIPCIÓN */}
        <AppCard style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: cardTitleSize }]}>
            2. Descripción y Especialidad
          </Text>

          {/* Nombre */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize }]}>
              Nombre profesional
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: isDarkMode ? '#1E2530' : '#F8FAFC' }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre o empresa"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>

          {/* Oficio */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize }]}>
              Título del servicio / Oficio
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: isDarkMode ? '#1E2530' : '#F8FAFC' }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={trade}
                onChangeText={setTrade}
                placeholder="Ej. Plomero y Fontanero Hidráulico"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>

          {/* Tarifa de visita */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize }]}>
              Tarifa base de visita o revisión
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: isDarkMode ? '#1E2530' : '#F8FAFC' }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={visitRate}
                onChangeText={setVisitRate}
                placeholder="Ej. $40.000 COP / $10 USD"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>

          {/* Teléfono */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize }]}>
              Teléfono de contacto para clientes
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: isDarkMode ? '#1E2530' : '#F8FAFC' }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="+57 300 000 0000"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Descripción / Bio */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize }]}>
              Descripción detallada de tus servicios
            </Text>
            <View
              style={[
                styles.textAreaWrapper,
                { borderColor: theme.border, backgroundColor: isDarkMode ? '#1E2530' : '#F8FAFC' },
              ]}>
              <TextInput
                style={[styles.textArea, { color: theme.text }]}
                value={bio}
                onChangeText={setBio}
                placeholder="Explica qué problemas solucionas, tu experiencia, las herramientas con las que cuentas y las garantías que ofreces..."
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </AppCard>

        {/* 3. SECCIÓN: FOTOS PUBLICADAS (PORTAFOLIO) */}
        <AppCard style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontSize: cardTitleSize }]}>
                3. Fotos de Trabajos Publicados
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary, fontSize: bodySize - 1 }]}>
                Muestra antes y después o reparaciones terminadas.
              </Text>
            </View>

            <Pressable
              onPress={() => setAddPhotoModalVisible(true)}
              style={styles.addSmallBtn}>
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.addSmallBtnText}>Añadir</Text>
            </Pressable>
          </View>

          <View style={styles.portfolioGrid}>
            {providerPublication.portfolioPhotos.map((photoUri, index) => (
              <View key={index} style={styles.portfolioItemWrapper}>
                <Image source={{ uri: photoUri }} style={styles.portfolioThumb} />
                <Pressable
                  onPress={() => removePortfolioPhoto(index)}
                  style={styles.deletePhotoBtn}
                  accessibilityLabel="Eliminar foto">
                  <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}
          </View>
        </AppCard>

        {/* 4. SECCIÓN: FOTOS O VIDEOS ADICIONADOS PARA LLAMAR LA ATENCIÓN */}
        <AppCard style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontSize: cardTitleSize }]}>
                4. Fotos y Videos Promocionales
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary, fontSize: bodySize - 1 }]}>
                Contenido multimedia destacado para captar el interés inmediato del cliente.
              </Text>
            </View>

            <Pressable
              onPress={() => setAddMediaModalVisible(true)}
              style={[styles.addSmallBtn, { backgroundColor: '#EA580C' }]}>
              <Ionicons name="videocam" size={16} color="#FFFFFF" />
              <Text style={styles.addSmallBtnText}>Añadir Media</Text>
            </Pressable>
          </View>

          {/* Callout de beneficio */}
          <View style={[styles.attentionCallout, { backgroundColor: isDarkMode ? '#2D2012' : '#FFF7ED' }]}>
            <Ionicons name="sparkles" size={20} color="#FF7A00" />
            <Text style={[styles.attentionCalloutText, { color: isDarkMode ? '#FED7AA' : '#9A3412', fontSize: bodySize - 1 }]}>
              <Text style={{ fontWeight: '800' }}>Consejo Pro:</Text> Los técnicos que suben videos de demostración o fotos de su vehículo/taller reciben hasta un 65% más de contrataciones.
            </Text>
          </View>

          {/* Lista de medios */}
          <View style={styles.mediaList}>
            {providerPublication.additionalMedia.map((media) => (
              <View
                key={media.id}
                style={[
                  styles.mediaCardItem,
                  { backgroundColor: isDarkMode ? '#1E2530' : '#F8FAFC', borderColor: theme.border },
                ]}>
                <View style={styles.mediaThumbContainer}>
                  <Image source={{ uri: media.url }} style={styles.mediaThumb} />
                  <View
                    style={[
                      styles.mediaTypeBadge,
                      { backgroundColor: media.type === 'video' ? '#EA580C' : '#0D5BFF' },
                    ]}>
                    <Ionicons
                      name={media.type === 'video' ? 'play-circle' : 'image'}
                      size={14}
                      color="#FFFFFF"
                    />
                    <Text style={styles.mediaTypeBadgeText}>
                      {media.type === 'video' ? 'Video' : 'Foto'}
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.mediaItemTitle, { color: theme.text, fontSize: bodySize }]}>
                    {media.title || 'Contenido promocional'}
                  </Text>
                  <Text style={[styles.mediaItemUrl, { color: theme.textSecondary, fontSize: bodySize - 3 }]} numberOfLines={1}>
                    {media.url}
                  </Text>
                </View>

                <Pressable
                  onPress={() => removeAdditionalMedia(media.id)}
                  style={styles.deleteMediaBtn}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </Pressable>
              </View>
            ))}
          </View>
        </AppCard>

        {/* Botones de acción principales */}
        <View style={styles.bottomActions}>
          <AppButton
            title="Guardar Cambios de mi Publicación"
            onPress={handleSaveAll}
            variant="primary"
            size="lg"
            style={{ backgroundColor: '#FF7A00' }}
            leftIcon={<Ionicons name="save-outline" size={22} color="#FFFFFF" />}
          />

          <AppButton
            title="Previsualizar cómo me ven los clientes"
            onPress={() => router.push('/pro/pro-1')}
            variant="outline"
            size="md"
            leftIcon={<Ionicons name="eye-outline" size={20} color={theme.text} />}
          />
        </View>
      </ScrollView>

      {/* Modal 1: Agregar Foto de Portafolio */}
      <Modal
        visible={addPhotoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddPhotoModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text, fontSize: cardTitleSize }]}>
              Agregar Foto al Portafolio
            </Text>
            <Text style={[styles.modalDesc, { color: theme.textSecondary, fontSize: bodySize }]}>
              Ingresa el enlace de la imagen o selecciona un ejemplo de trabajo:
            </Text>

            <View style={[styles.inputWrapper, { borderColor: theme.border, marginVertical: Spacing.md }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="https://images.unsplash.com/..."
                placeholderTextColor={theme.textMuted}
                value={newPhotoUrl}
                onChangeText={setNewPhotoUrl}
              />
            </View>

            {/* Sugerencias de ejemplo */}
            <View style={styles.suggestRow}>
              <Pressable
                onPress={() => setNewPhotoUrl('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80')}
                style={[styles.suggestPill, { backgroundColor: isDarkMode ? '#242C39' : '#EFF6FF' }]}>
                <Text style={{ fontSize: 12, color: theme.primary, fontWeight: '700' }}>Ejemplo: Instalación</Text>
              </Pressable>
              <Pressable
                onPress={() => setNewPhotoUrl('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80')}
                style={[styles.suggestPill, { backgroundColor: isDarkMode ? '#242C39' : '#FFF7ED' }]}>
                <Text style={{ fontSize: 12, color: '#EA580C', fontWeight: '700' }}>Ejemplo: Obra</Text>
              </Pressable>
            </View>

            <View style={styles.modalBtnRow}>
              <AppButton
                title="Cancelar"
                onPress={() => setAddPhotoModalVisible(false)}
                variant="outline"
                size="md"
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <AppButton
                title="Añadir Foto"
                onPress={handleConfirmAddPhoto}
                variant="primary"
                size="md"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Agregar Media Promocional (Video o Foto) */}
      <Modal
        visible={addMediaModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddMediaModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text, fontSize: cardTitleSize }]}>
              Añadir Video o Foto Promocional
            </Text>

            <View style={styles.typeSelectorRow}>
              <Pressable
                onPress={() => setNewMediaType('video')}
                style={[
                  styles.typeTab,
                  {
                    backgroundColor: newMediaType === 'video' ? '#EA580C' : (isDarkMode ? '#242C39' : '#F1F5F9'),
                  },
                ]}>
                <Ionicons name="videocam" size={18} color={newMediaType === 'video' ? '#FFFFFF' : theme.text} />
                <Text style={[styles.typeTabText, { color: newMediaType === 'video' ? '#FFFFFF' : theme.text }]}>
                  Video Promocional
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setNewMediaType('photo')}
                style={[
                  styles.typeTab,
                  {
                    backgroundColor: newMediaType === 'photo' ? theme.primary : (isDarkMode ? '#242C39' : '#F1F5F9'),
                  },
                ]}>
                <Ionicons name="image" size={18} color={newMediaType === 'photo' ? '#FFFFFF' : theme.text} />
                <Text style={[styles.typeTabText, { color: newMediaType === 'photo' ? '#FFFFFF' : theme.text }]}>
                  Foto Destacada
                </Text>
              </Pressable>
            </View>

            <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize - 1, marginTop: Spacing.sm }]}>
              Título o descripción del contenido
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.border, marginBottom: Spacing.sm }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ej. Demostración de apertura de cerradura digital"
                placeholderTextColor={theme.textMuted}
                value={newMediaTitle}
                onChangeText={setNewMediaTitle}
              />
            </View>

            <Text style={[styles.inputLabel, { color: theme.text, fontSize: bodySize - 1 }]}>
              Enlace URL del video o foto
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.border, marginBottom: Spacing.md }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="https://..."
                placeholderTextColor={theme.textMuted}
                value={newMediaUrl}
                onChangeText={setNewMediaUrl}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <AppButton
                title="Cancelar"
                onPress={() => setAddMediaModalVisible(false)}
                variant="outline"
                size="md"
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <AppButton
                title="Añadir a mi perfil"
                onPress={handleConfirmAddMedia}
                variant="primary"
                size="md"
                style={{ flex: 1, backgroundColor: '#EA580C' }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: Spacing.lg,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
    lineHeight: 20,
  },
  sectionCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSubtitle: {
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.xs,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBig: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#FF7A00',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF7A00',
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  presetLabel: {
    fontWeight: '600',
    marginBottom: 6,
  },
  presetsList: {
    flexDirection: 'row',
    gap: 8,
  },
  presetItem: {
    borderRadius: Radius.full,
    borderWidth: 2,
    padding: 2,
  },
  presetThumb: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontWeight: '700',
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 50,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    minHeight: 46,
  },
  textAreaWrapper: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 110,
  },
  textArea: {
    fontSize: 14,
    lineHeight: 20,
    minHeight: 100,
  },
  addSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7A00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    gap: 4,
  },
  addSmallBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  portfolioItemWrapper: {
    width: '31%',
    aspectRatio: 1,
    position: 'relative',
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  portfolioThumb: {
    width: '100%',
    height: '100%',
  },
  deletePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attentionCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  attentionCalloutText: {
    flex: 1,
    lineHeight: 18,
  },
  mediaList: {
    gap: Spacing.sm,
  },
  mediaCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  mediaThumbContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  mediaThumb: {
    width: '100%',
    height: '100%',
  },
  mediaTypeBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    gap: 2,
  },
  mediaTypeBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  mediaItemTitle: {
    fontWeight: '700',
  },
  mediaItemUrl: {
    marginTop: 2,
  },
  deleteMediaBtn: {
    padding: Spacing.xs,
  },
  bottomActions: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  modalTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  modalDesc: {
    lineHeight: 18,
  },
  suggestRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  suggestPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  modalBtnRow: {
    flexDirection: 'row',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: Spacing.sm,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Radius.md,
    gap: 6,
  },
  typeTabText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
