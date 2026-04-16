import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Image, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');
const IMG_SIZE = (width - 3) / 4; // 4 items per row with 1px border

// Mock data
const MOCK_PREVIOUS_EVIDENCE = {
  photos: [
    'https://images.unsplash.com/photo-1541888081688-ea1aff1bbd06?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508514177221-188b1c77eca2?q=80&w=200&auto=format&fit=crop',
  ],
  progress: 45,
  hasAudio: true
};

const MOCK_GALLERY = [
  'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
];

export default function EvidenceScreen() {
    const router = useRouter();
    const { title } = useLocalSearchParams();
    
    // Simulate fetching previous history
    const previousData = title === 'Montaje Estructura Metálica' ? MOCK_PREVIOUS_EVIDENCE : MOCK_PREVIOUS_EVIDENCE;
    
    // States
    const [progress, setProgress] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>(MOCK_GALLERY[0]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <Feather name="x" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nueva publicación</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerActionBtn}>
                    <Text style={styles.headerActionText}>Siguiente</Text>
                </TouchableOpacity>
            </View>

            {/* Top Preview Section */}
            <View style={styles.previewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
                
                {/* Visual Camera Hint (Optional overly for the first image assuming it's the live camera placeholder) */}
                {selectedImage === MOCK_GALLERY[0] && (
                    <View style={styles.previewOverlay}>
                        <View style={styles.cameraIconBg}>
                            <Feather name="camera" size={28} color={Colors.textPrimary} />
                        </View>
                        <Text style={styles.previewHintText}>Toca para capturar evidencia</Text>
                    </View>
                )}
            </View>

            {/* Bottom Section (Overlaid progress & gallery) */}
            <View style={styles.bottomSection}>
                
                {/* Overlaid Progress Card */}
                <View style={styles.progressCardWrapper}>
                    <View style={styles.progressCard}>
                        <Text style={styles.progressCardTitle}>¿CUÁNTO AVANZAMOS?</Text>
                        <View style={styles.progressButtonsRow}>
                            {[25, 50, 75, 100].map(val => (
                                <TouchableOpacity 
                                    key={val}
                                    style={[styles.progressPill, progress === val && styles.progressPillActive]}
                                    onPress={() => setProgress(val)}
                                >
                                    <Text style={[styles.progressPillText, progress === val && styles.textWhite]}>{val}%</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Layout Container for below the overlapped card */}
                <View style={styles.lowerContent}>
                    
                    {/* History Pre-Viewer (if exists) */}
                    {previousData && (
                        <View style={styles.historySection}>
                            <View style={styles.historyHeader}>
                                <Text style={styles.historyTitle}>Subido anteriormente</Text>
                                <View style={styles.historyBadge}>
                                    <Feather name="trending-up" size={12} color={Colors.primary} />
                                    <Text style={styles.historyBadgeText}>{previousData.progress}%</Text>
                                </View>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
                                {previousData.photos.map((img, idx) => (
                                    <Image key={idx} source={{ uri: img }} style={styles.historyThumb} />
                                ))}
                                {previousData.hasAudio && (
                                    <View style={styles.historyAudioPill}>
                                        <Feather name="mic" size={16} color={Colors.textSecondary} />
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    )}

                    {/* Gallery Tools Header */}
                    <View style={styles.galleryHeaderRow}>
                        <TouchableOpacity style={styles.recentDropdown}>
                            <Text style={styles.recentText}>Recientes</Text>
                            <Feather name="chevron-down" size={20} color={Colors.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.selectBtn}>
                            <Feather name="copy" size={14} color={Colors.textSecondary} />
                            <Text style={styles.selectBtnText}>Seleccionar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Gallery Grid */}
                    <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
                        {/* Live Camera Grid Item First */}
                        <TouchableOpacity style={styles.gridCameraCell}>
                            <Feather name="camera" size={24} color={Colors.paper} />
                        </TouchableOpacity>
                        
                        {/* Standard Gallery Images */}
                        {MOCK_GALLERY.map((img, idx) => (
                            <TouchableOpacity key={idx} style={styles.gridImageCell} onPress={() => setSelectedImage(img)}>
                                <Image source={{ uri: img }} style={styles.gridImage} />
                                {selectedImage === img && <View style={styles.gridImageSelectedOverlay} />}
                            </TouchableOpacity>
                        ))}
                        <View style={{ width: '100%', height: 40 }} />
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Keeps standard phone dark edge wrapping native status bars
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    height: 50,
    backgroundColor: Colors.paper,
  },
  iconBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerActionBtn: {
    paddingVertical: 8,
  },
  headerActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0033FF', // Primary blue link color often used for Actions
  },
  previewContainer: {
    height: width * 0.9, // Almost square but leaves room, typical of insta aspect ratios
    width: '100%',
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  previewHintText: {
    color: Colors.paper,
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: Colors.paper,
    position: 'relative',
  },
  progressCardWrapper: {
    position: 'absolute',
    top: -35, // Overlap the preview
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  progressCard: {
    width: '90%',
    backgroundColor: Colors.paper,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    ...Shadows.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  progressButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  progressPill: {
    flex: 1,
    height: 44,
    marginHorizontal: 4,
    borderRadius: Radii.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  progressPillText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  textWhite: {
    color: Colors.paper,
  },
  lowerContent: {
    flex: 1,
    paddingTop: 70, // Space for the overlapping card
  },
  historySection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  historyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  historyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    marginLeft: 4,
  },
  historyScroll: {
    flexDirection: 'row',
  },
  historyThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: Spacing.sm,
    backgroundColor: Colors.border,
  },
  historyAudioPill: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  galleryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  recentDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginRight: 4,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCameraCell: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    marginRight: 1,
    marginBottom: 1,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridImageCell: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    marginRight: 1,
    marginBottom: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridImageSelectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  }
});
