import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter } from 'expo-router';
// Hardware camera
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanStatus, setScanStatus] = useState('scanning'); // scanning, success
  const scanAnim = new Animated.Value(0);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }

    // Simulate high-speed scanning pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Auto-complete scan after 3 seconds for mockup purposes
    const timer = setTimeout(() => {
      setScanStatus('success');
    }, 3500);

    return () => clearTimeout(timer);
  }, [permission, scanAnim]);

  const isSuccess = scanStatus === 'success';

  return (
    <View style={styles.container}>
      {/* Real Front Camera Feed */}
      <CameraView 
        facing="front"
        style={styles.cameraBackground}
      >
        {/* Dark immersive Overlay */}
        <View style={styles.darkOverlay}>
          
          {/* Header */}
          <SafeAreaView style={styles.safeHeader}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                <Feather name="chevron-left" size={24} color={Colors.paper} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Face ID Solenium</Text>
              <View style={{ width: 44 }} />
            </View>
          </SafeAreaView>

          {/* Instruction Text (Minimalist/Gestalt) */}
          <Text style={styles.instruction}>
            {isSuccess ? 'Identidad Confirmada' : 'Mira fijamente a la cámara'}
          </Text>

          {/* Central Scanning Ring (The "WOW" Element) */}
          <View style={styles.scannerContainer}>
            {/* The circular progress segments - Mocking the Apple Face ID look */}
            <View style={[styles.scanCircle, isSuccess && styles.scanCircleSuccess]}>
               {/* Pulse Ring */}
               {!isSuccess && (
                 <Animated.View style={[
                   styles.pulseRing, 
                   { opacity: scanAnim, transform: [{ scale: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }] }
                 ]} />
               )}
               
               {isSuccess ? (
                 <View style={styles.successIcon}>
                    <Feather name="check" size={50} color={Colors.paper} />
                 </View>
               ) : (
                 <View style={styles.trackingDotsContainer}>
                    {/* Simulated tracking dots on key facial features */}
                    <View style={[styles.dot, { top: '35%', left: '45%' }]} />
                    <View style={[styles.dot, { top: '35%', right: '45%' }]} />
                    <View style={[styles.dot, { top: '50%', left: '48%' }]} />
                    <View style={[styles.dot, { bottom: '30%', left: '40%' }]} />
                    <View style={[styles.dot, { bottom: '30%', right: '40%' }]} />
                 </View>
               )}
            </View>
          </View>

          {/* Footer - Only confirmation button on success */}
          <SafeAreaView style={styles.safeFooter}>
            {isSuccess ? (
              <View style={styles.dualConfirmContainer}>
                
                {/* Visual Timestamp Registration */}
                <View style={styles.timestampBox}>
                   <Feather name="clock" size={16} color={Colors.textMuted} />
                   <Text style={styles.timestampText}>Hora registrada: 07:15 AM</Text>
                </View>

                <Text style={styles.selectTypeHint}>Selecciona tu tipo de registro:</Text>
                <View style={styles.dualConfirmRow}>
                   <TouchableOpacity style={styles.confirmBtnIngreso} onPress={() => router.replace('/')}>
                     <Feather name="sunrise" size={20} color={Colors.paper} />
                     <Text style={styles.confirmBtnTextSmall}>Ingreso</Text>
                   </TouchableOpacity>
                   
                   <TouchableOpacity style={styles.confirmBtnSalida} onPress={() => router.replace('/')}>
                     <Text style={styles.confirmBtnTextSmall}>Salida</Text>
                     <Feather name="moon" size={20} color={Colors.paper} />
                   </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.scanningStatusBox}>
                 <Animated.View style={[styles.statusDot, { opacity: scanAnim }]} />
                 <Text style={styles.statusText}>Escaneando biometría...</Text>
              </View>
            )}
          </SafeAreaView>

        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraBackground: {
    flex: 1,
    width: width,
    height: height,
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // slightly darker to make white HUD elements pop against bright selfie camera
    justifyContent: 'space-between',
  },
  safeHeader: {
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.paper,
    letterSpacing: 0.5,
  },
  instruction: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.paper,
    textAlign: 'center',
    marginTop: Spacing.xxl,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanCircle: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scanCircleSuccess: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  pulseRing: {
    position: 'absolute',
    width: '110%',
    height: '110%',
    borderRadius: width,
    borderWidth: 2,
    borderColor: Colors.paper,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  trackingDotsContainer: {
    width: '60%',
    height: '60%',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  safeFooter: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  scanningStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: Spacing.sm,
  },
  statusText: {
    color: Colors.paper,
    fontSize: 15,
    fontWeight: '600',
  },
  timestampBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.full,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  timestampText: {
    color: Colors.paper,
    marginLeft: Spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
  dualConfirmContainer: {
    width: '100%',
  },
  selectTypeHint: {
    color: Colors.paper,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  dualConfirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  confirmBtnIngreso: {
    flex: 1,
    backgroundColor: Colors.success,
    height: 60,
    borderRadius: Radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  confirmBtnSalida: {
    flex: 1,
    backgroundColor: Colors.error, 
    height: 60,
    borderRadius: Radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  confirmBtnTextSmall: {
    color: Colors.paper,
    fontSize: 16,
    fontWeight: '800',
    marginHorizontal: Spacing.sm,
  }
});
