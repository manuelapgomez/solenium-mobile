import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SessionManager } from '../constants/session';

const { width } = Dimensions.get('window');

const STEPS = [
  { id: 1, label: 'Frente', description: 'Mira directamente a la cámara' },
  { id: 2, label: 'Perfil Derecho', description: 'Gira levemente a la derecha' },
  { id: 3, label: 'Perfil Izquierdo', description: 'Gira levemente a la izquierda' },
  { id: 4, label: 'Arriba', description: 'Levanta un poco el mentón' },
  { id: 5, label: 'Abajo', description: 'Baja un poco el mentón' },
  { id: 6, label: 'Sonrisa', description: 'Una sonrisa natural para validar' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { userId, mode } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const isVerifyMode = mode === 'verify';
  
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  const activeSteps = isVerifyMode ? [STEPS[0]] : STEPS;

  const handleCapture = () => {
    setIsCapturing(true);
    // Simulate capture delay
    setTimeout(() => {
      setPhotos([...photos, 'captured']);
      setIsCapturing(false);
      if (currentStep < activeSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Finished!
        if (isVerifyMode) {
            // If it was a quick verification, go to dashboard with the same user
            const finalId = userId as string || '1';
            SessionManager.setUserId(finalId);
            router.replace({ pathname: '/', params: { userId: finalId } });
        } else {
            // If it was a full 6-photo registration (at the start or new user)
            SessionManager.setUserId('1');
            SessionManager.setRegistered();
            router.replace({ pathname: '/', params: { userId: '1' } }); 
        }
      }
    }, 800);
  };

  if (showInstructions) {
      return (
          <View style={styles.container}>
            <SafeAreaView style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitleTiny}>{isVerifyMode ? 'Validación' : 'Registro'}</Text>
                    <View style={{width: 24}} />
                </View>

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Spacing.xl }}
                >
                    <View style={styles.instructionContainer}>
                        <View style={styles.introIconCircle}>
                            <Feather name={isVerifyMode ? "shield" : "user-check"} size={40} color={Colors.primary} />
                        </View>
                        <Text style={styles.introTitle}>
                            {isVerifyMode ? 'Validación de Identidad' : 'Primer Registro Biométrico'}
                        </Text>
                        <Text style={styles.introDesc}>
                            {isVerifyMode 
                              ? 'Para asegurar que eres tú quien está operando, necesitamos una foto rápida de frente.' 
                              : 'Para tu seguridad, crearemos un mapa digital de tu rostro. Necesitaremos 6 fotos en diferentes ángulos.'}
                        </Text>

                        <View style={styles.stepsPreview}>
                            {activeSteps.map((step, index) => (
                                <View key={step.id} style={styles.stepPreviewItem}>
                                    <View style={styles.stepMiniCircle}>
                                        <Text style={styles.stepMiniNum}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.stepPreviewLabel}>{step.label}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.whyBox}>
                            <Feather name="info" size={16} color={Colors.textSecondary} />
                            <Text style={styles.whyText}>
                                Esto previene suplantaciones y asegura que tus reportes de obra tengan validez legal y técnica.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity 
                    style={[styles.startBtn, { marginBottom: Math.max(insets.bottom, Spacing.lg) }]}
                    onPress={() => setShowInstructions(false)}
                >
                    <Text style={styles.startBtnText}>Entendido, continuar</Text>
                    <Feather name="camera" size={20} color={Colors.paper} />
                </TouchableOpacity>
            </SafeAreaView>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Feather name="x" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
             <View style={styles.stepIndicator}>
                 {activeSteps.map((_, i) => (
                     <View 
                         key={i} 
                         style={[
                             styles.dot, 
                             i === currentStep && styles.dotActive,
                             i < photos.length && styles.dotCompleted
                         ]} 
                     />
                 ))}
             </View>
             <View style={{ width: 24 }} />
         </View>

         <View style={styles.main}>
             <Text style={styles.title}>{isVerifyMode ? 'Validación Facial' : 'Registro Biométrico'}</Text>
             <Text style={styles.description}>{activeSteps[currentStep].description}</Text>

             <View style={styles.cameraContainer}>
                 <View style={styles.cameraFrame}>
                     <View style={styles.faceGuide} />
                     {isCapturing && <View style={styles.flashOverlay} />}
                 </View>
                 
                 <View style={styles.stepBadge}>
                     <Text style={styles.stepLabel}>{activeSteps[currentStep].label}</Text>
                 </View>
             </View>
         </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 40, Spacing.xxl) }]}>
            <TouchableOpacity 
                style={[styles.captureBtn, isCapturing && styles.captureBtnDisabled]} 
                onPress={handleCapture}
                disabled={isCapturing}
            >
                 <View style={styles.captureBtnInner} />
             </TouchableOpacity>
             <Text style={styles.footerHint}>Paso {currentStep + 1} de {activeSteps.length}</Text>
         </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.divider,
  },
  dotActive: {
    width: 12,
    backgroundColor: Colors.primary,
  },
  dotCompleted: {
    backgroundColor: Colors.success,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  cameraContainer: {
    width: width * 0.8,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraFrame: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
    backgroundColor: '#000',
    borderWidth: 4,
    borderColor: Colors.primary,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceGuide: {
    width: '70%',
    height: '80%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 100,
    borderStyle: 'dashed',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF',
    opacity: 0.8,
  },
  stepBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Radii.full,
    ...Shadows.md,
  },
  stepLabel: {
    color: Colors.paper,
    fontWeight: '800',
    fontSize: 12,
  },
  footer: {
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  captureBtnDisabled: {
    borderColor: Colors.divider,
  },
  captureBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
  },
  footerHint: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  headerTitleTiny: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  instructionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  introIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  introDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  stepsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: Spacing.xxl,
  },
  stepPreviewItem: {
    alignItems: 'center',
    width: 80,
  },
  stepMiniCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  stepMiniNum: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  stepPreviewLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  whyBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: Spacing.md,
    borderRadius: Radii.md,
    alignItems: 'center',
  },
  whyText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 10,
    lineHeight: 16,
  },
  startBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: Radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
    marginBottom: Spacing.xl,
  },
  startBtnText: {
    color: Colors.paper,
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  }
});
