import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ImageBackground, Animated, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function EvidenceScreen() {
  const router = useRouter();
  const { title } = useLocalSearchParams();
  
  // States
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<number[]>([]); // Array of photo placeholders
  const [isRecording, setIsRecording] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  
  // Animation for recording
  const recordAnim = new Animated.Value(0);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(recordAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      recordAnim.setValue(0);
    }
  }, [isRecording]);

  const addPhoto = () => {
    if (photos.length < 5) {
      setPhotos([...photos, Date.now()]);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasAudio(true);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* BACKGROUND CAMERA SIMULATION */}
      <ImageBackground 
        source={require('../assets/images/solar_site.png')}
        style={styles.cameraBg}
      >
        <View style={styles.overlay}>
          
          {/* TOP BAR - INS STYLE PROGRESS */}
          <SafeAreaView>
            <View style={styles.insContainer}>
                {/* Visual indicator of multiple photos like stories */}
                <View style={styles.storyProgressRow}>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <View key={i} style={[
                            styles.storySegment, 
                            i < photos.length && styles.storySegmentActive,
                            i === photos.length && isRecording && styles.storySegmentRecording
                        ]} />
                    ))}
                </View>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                        <Feather name="x" size={24} color={Colors.paper} />
                    </TouchableOpacity>
                    <View style={styles.taskBadge}>
                         <Text style={styles.taskBadgeText}>{title || 'Montaje Paneles'}</Text>
                    </View>
                    <View style={{ width: 44 }} />
                </View>
            </View>
          </SafeAreaView>

          {/* MIDDLE - Capture & Evidence Area */}
          <View style={styles.centerContent}>
             <TouchableOpacity style={styles.captureCircle} onPress={addPhoto}>
                <View style={styles.captureInner}>
                   <Feather name={photos.length > 0 ? "plus" : "camera"} size={40} color={Colors.textPrimary} />
                </View>
             </TouchableOpacity>
             <Text style={styles.centerHint}>
                {photos.length > 0 ? `${photos.length} fotos capturadas` : 'Toca para capturar evidencia'}
             </Text>
          </View>

          {/* BOTTOM PANEL - ONE HAND OPTIMIZED */}
          <View style={styles.bottomSheet}>
             
             {/* PROGRESS SELECTOR - BIG BUTTONS ONLY */}
             <View style={styles.section}>
                <Text style={styles.sectionLabel}>¿Cuánto avanzamos?</Text>
                <View style={styles.progressRow}>
                   {[25, 50, 75, 100].map((val) => (
                      <TouchableOpacity 
                        key={val} 
                        style={[styles.progressBtn, progress === val && styles.progressBtnActive]}
                        onPress={() => setProgress(val)}
                      >
                         <Text style={[styles.progressBtnText, progress === val && styles.textWhite]}>{val}%</Text>
                      </TouchableOpacity>
                   ))}
                </View>
             </View>

             {/* AUDIO NOTE - TAP TO START/STOP */}
             <View style={styles.audioContainer}>
                <TouchableOpacity 
                    style={[
                        styles.micBtn, 
                        isRecording && styles.micBtnRecording,
                        hasAudio && !isRecording && styles.micBtnDone
                    ]} 
                    onPress={toggleRecording}
                >
                    <Animated.View style={{ transform: [{ scale: isRecording ? recordAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) : 1 }] }}>
                        <Feather 
                            name={isRecording ? "square" : (hasAudio ? "check" : "mic")} 
                            size={28} 
                            color={Colors.paper} 
                        />
                    </Animated.View>
                </TouchableOpacity>
                <View style={styles.audioInfo}>
                    <Text style={styles.audioTitle}>
                        {isRecording ? 'Grabando nota de voz...' : (hasAudio ? 'Nota de voz guardada' : 'Agregar nota de voz')}
                    </Text>
                    <Text style={styles.audioSubtitle}>
                        {isRecording ? 'Toca para detener' : (hasAudio ? 'Toca para grabar de nuevo' : 'Perfecto para manos ocupadas')}
                    </Text>
                </View>
             </View>

             {/* FINAL ACTION */}
             <TouchableOpacity 
                style={[styles.saveBtn, (photos.length === 0 || progress === 0) && styles.saveBtnDisabled]}
                onPress={() => router.back()}
                disabled={photos.length === 0 || progress === 0}
             >
                <Text style={styles.saveBtnText}>Finalizar Registro</Text>
                <Feather name="arrow-right" size={20} color={Colors.paper} />
             </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraBg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // Very discrete overlay
    justifyContent: 'space-between',
  },
  insContainer: {
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  storyProgressRow: {
    flexDirection: 'row',
    height: 3,
    gap: 4,
    marginBottom: Spacing.md,
  },
  storySegment: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  storySegmentActive: {
    backgroundColor: Colors.paper,
  },
  storySegmentRecording: {
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.full,
  },
  taskBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.paper,
    ...Shadows.lg,
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHint: {
    color: Colors.paper,
    marginTop: Spacing.md,
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowRadius: 4,
  },
  bottomSheet: {
    backgroundColor: Colors.paper,
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
    ...Shadows.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBtn: {
    width: (width - Spacing.xl * 2 - 24) / 4,
    height: 50,
    borderRadius: Radii.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  progressBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    marginBottom: Spacing.xl,
  },
  micBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  micBtnRecording: {
    backgroundColor: Colors.error,
  },
  micBtnDone: {
    backgroundColor: Colors.success,
  },
  audioInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  audioSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: Colors.textPrimary,
    height: 64,
    borderRadius: Radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  saveBtnDisabled: {
    opacity: 0.3,
  },
  saveBtnText: {
    color: Colors.paper,
    fontSize: 18,
    fontWeight: '800',
    marginRight: Spacing.sm,
  },
  textWhite: {
    color: Colors.paper,
  }
});
