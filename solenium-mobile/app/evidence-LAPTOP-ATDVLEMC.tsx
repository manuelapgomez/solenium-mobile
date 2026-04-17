import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
// Hardware APIs
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const IMG_SIZE = width / 4; // 4 items exact per row

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
    const { title, targetQuantity, unit } = useLocalSearchParams();
    
    const previousData = title === 'Montaje Estructura Metálica' ? MOCK_PREVIOUS_EVIDENCE : MOCK_PREVIOUS_EVIDENCE;
    
    // Hardware States
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const insets = useSafeAreaInsets();

    // App States
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isMultiSelect, setIsMultiSelect] = useState<boolean>(false);

    // Ask for permissions automatically
    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    // Handle actual Native Camera capture
    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo) {
                if (isMultiSelect) {
                    setSelectedImages(prev => [...prev, photo.uri]);
                } else {
                    setSelectedImages([photo.uri]);
                }
            }
        }
    };

    // Handle Native Device Gallery
    const pickImageFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: !isMultiSelect, // Cannot edit if multiple selection is enabled
            allowsMultipleSelection: isMultiSelect,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uris = result.assets.map(a => a.uri);
            if (isMultiSelect) {
                setSelectedImages(prev => [...prev, ...uris]);
            } else {
                setSelectedImages([uris[0]]);
            }
        }
    };

    // Handle Mock Gallery Grid Selection
    const handleSelectImageGrid = (img: string) => {
        if (img === 'camera') {
            if (!isMultiSelect) {
                setSelectedImages([]);
            }
            return;
        }

        if (isMultiSelect) {
            if (selectedImages.includes(img)) {
                setSelectedImages(prev => prev.filter(i => i !== img));
            } else {
                setSelectedImages(prev => [...prev, img]);
            }
        } else {
            setSelectedImages([img]);
        }
    };

    const toggleMultiSelect = () => {
        const nextState = !isMultiSelect;
        setIsMultiSelect(nextState);
        // Si se apaga y hay varias, solo se queda con la primera a menos que este empty
        if (!nextState && selectedImages.length > 1) {
            setSelectedImages([selectedImages[0]]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <Feather name="x" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nueva publicación</Text>
                <TouchableOpacity onPress={() => router.push({ pathname: '/audio_evidence', params: { title, targetQuantity, unit } })} style={styles.headerActionBtn}>
                    <Text style={styles.headerActionText}>Siguiente</Text>
                </TouchableOpacity>
            </View>

            {/* Top Preview Section */}
            <View style={styles.previewContainer}>
                {selectedImages.length === 0 ? (
                    <CameraView style={styles.previewImage} facing="back" ref={cameraRef}>
                        <View style={styles.previewOverlay}>
                            {/* Live Camera Interface inside the box */}
                            <TouchableOpacity style={styles.cameraTriggerBtn} onPress={takePicture}>
                                <View style={styles.cameraTriggerInner} />
                            </TouchableOpacity>
                            <Text style={styles.previewHintText}>Toma la foto</Text>
                        </View>
                    </CameraView>
                ) : (
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.previewImage}>
                        {selectedImages.map((uri, idx) => (
                            <View key={idx} style={{width: width, height: '100%', position: 'relative'}}>
                                <Image source={{ uri }} style={styles.previewImage} resizeMode="cover" />
                                {selectedImages.length > 1 && (
                                    <View style={styles.multiPageIndicator}>
                                        <Text style={styles.multiPageText}>{idx + 1} / {selectedImages.length}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* Bottom Section (Overlaid progress & gallery) */}
            <View style={styles.bottomSection}>
                
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
                        {/* Native App Image Picker Trigger */}
                        <TouchableOpacity style={styles.recentDropdown} onPress={pickImageFromGallery}>
                            <Text style={styles.recentText}>Recientes</Text>
                            <Feather name="chevron-down" size={20} color={Colors.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectBtn, isMultiSelect && styles.selectBtnActive]} onPress={toggleMultiSelect}>
                            <Feather name="copy" size={14} color={isMultiSelect ? Colors.paper : Colors.textSecondary} />
                            <Text style={[styles.selectBtnText, isMultiSelect && styles.selectBtnTextActive]}>Selección múltiple</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Gallery Grid */}
                    <ScrollView contentContainerStyle={[styles.gridContainer, { paddingBottom: insets.bottom + 130 }]} showsVerticalScrollIndicator={false}>
                        {/* Live Camera Grid Item First */}
                        <TouchableOpacity style={styles.gridCameraCell} onPress={() => handleSelectImageGrid('camera')}>
                            <Feather name="camera" size={24} color={Colors.paper} />
                        </TouchableOpacity>
                        
                        {/* Standard Gallery Images */}
                        {MOCK_GALLERY.map((img, idx) => {
                            const isSelected = selectedImages.includes(img);
                            const selectionIndex = selectedImages.indexOf(img) + 1;
                            
                            return (
                                <TouchableOpacity key={idx} style={styles.gridImageCell} onPress={() => handleSelectImageGrid(img)} activeOpacity={0.8}>
                                    <Image source={{ uri: img }} style={styles.gridImage} />
                                    {isSelected && (
                                        <View style={styles.gridImageSelectedOverlay}>
                                            {isMultiSelect && (
                                                <View style={styles.selectionBadge}>
                                                    <Text style={styles.selectionBadgeText}>{selectionIndex}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
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
    justifyContent: 'flex-end',
    paddingBottom: Spacing.md, 
  },
  cameraTriggerBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  cameraTriggerInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.paper,
  },
  previewHintText: {
    color: Colors.paper,
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: Colors.paper,
    position: 'relative',
  },
  textWhite: {
    color: Colors.paper,
  },
  lowerContent: {
    flex: 1,
    paddingTop: Spacing.md, 
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
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.background,
  },
  gridImageCell: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderWidth: 0.5,
    borderColor: Colors.background,
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
  },
  selectBtnActive: {
    backgroundColor: Colors.primary,
  },
  selectBtnTextActive: {
    color: Colors.paper,
  },
  multiPageIndicator: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  multiPageText: {
    color: Colors.paper,
    fontSize: 12,
    fontWeight: '700',
  },
  selectionBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.paper,
  },
  selectionBadgeText: {
    color: Colors.paper,
    fontSize: 10,
    fontWeight: '800',
  }
});
