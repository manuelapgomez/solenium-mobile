import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';

const MOCK_PROJECTS = [
  { id: 'p1', name: 'Parque Solar Fase 1' },
  { id: 'p2', name: 'Minigranja Norte' },
  { id: 'p3', name: 'Minigranja Sur' },
];

export default function RegistryDetailScreen() {
  const router = useRouter();
  const { title, time, projectName } = useLocalSearchParams();
  const [activeProjectName, setActiveProjectName] = React.useState(projectName?.toString() || 'Parque Solar Fase 1');
  const [showProjectModal, setShowProjectModal] = React.useState(false);
  
  const isExit = title?.toString().toLowerCase().includes('out') || title?.toString().toLowerCase().includes('salida');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* MODER HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="chevron-left" size={26} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Certificado de Registro</Text>
          <TouchableOpacity style={styles.shareBtn}>
            <Feather name="share-2" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
            {/* PHOTO HERO SECTION - "IDENTITY CARD" FEEL */}
            <View style={styles.idCardContainer}>
                <ImageBackground 
                    source={require('../assets/images/worker_face.png')} 
                    style={styles.photoHero}
                    imageStyle={{ borderRadius: Radii.xl }}
                >
                    <View style={styles.hologramOverlay}>
                        <View style={styles.biometricBadge}>
                            <View style={styles.pulseDot} />
                            <Feather name="shield" size={14} color={Colors.paper} />
                            <Text style={styles.biometricText}>BIOMETRÍA VALIDADA</Text>
                        </View>
                    </View>
                </ImageBackground>
                
                {/* FLOATING HUD INDICATORS */}
                <View style={styles.hudContainer}>
                    <View style={styles.hudItem}>
                        <Feather name="cpu" size={12} color={Colors.success} />
                        <Text style={styles.hudText}>MATCH: 99.8%</Text>
                    </View>
                    <View style={styles.hudDivider} />
                    <View style={styles.hudItem}>
                        <Feather name="map-pin" size={12} color={Colors.primary} />
                        <Text style={styles.hudText}>GPS: ALTA PRECISIÓN</Text>
                    </View>
                </View>
            </View>

            {/*主 INFO CARD - SLEEK & SPACED */}
            <View style={styles.mainInfoCard}>
                <View style={styles.dataPoint}>
                    <Text style={styles.dataLabel}>PROYECTO ACTIVO</Text>
                    <TouchableOpacity 
                        style={styles.projectSelector}
                        onPress={() => setShowProjectModal(true)}
                    >
                        <Text style={styles.projectTitle}>{activeProjectName}</Text>
                        <Feather name="edit-3" size={14} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.dataGrid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.dataLabel}>MOVIMIENTO</Text>
                        <View style={[styles.typeStatusPill, { backgroundColor: isExit ? '#FFF1F2' : '#F0FDF4' }]}>
                            <Feather name={isExit ? "log-out" : "log-in"} size={16} color={isExit ? Colors.error : Colors.success} />
                            <Text style={[styles.typeStatusText, { color: isExit ? Colors.error : Colors.success }]}>
                                {isExit ? 'SALIDA' : 'INGRESO'}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.gridItem}>
                        <Text style={styles.dataLabel}>HORA LOCAL</Text>
                        <Text style={styles.timeDisplay}>{time || '18:00 PM'}</Text>
                    </View>
                </View>

                <View style={styles.locationFooter}>
                    <View style={styles.locationIconBg}>
                        <Feather name="navigation" size={16} color={Colors.textSecondary} />
                    </View>
                    <View>
                        <Text style={styles.locationMain}>Antioquia, Colombia</Text>
                        <Text style={styles.locationSub}>7.1234° N, 75.5678° W • Validado por GPS</Text>
                    </View>
                </View>
            </View>

            {/* SECURITY LOG SECTION */}
            <View style={styles.securityLog}>
                <Feather name="lock" size={14} color={Colors.textMuted} />
                <Text style={styles.securityLogText}>
                    Este registro es único, inmutable y está vinculado a la identidad biométrica del trabajador. ID: SOL-{Math.floor(Math.random() * 900000) + 100000}
                </Text>
            </View>

            <TouchableOpacity 
                style={styles.primaryActionBtn}
                onPress={() => router.back()}
            >
                <Text style={styles.primaryActionText}>Finalizar Consulta</Text>
            </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* Project Switcher Modal */}
      <Modal
        visible={showProjectModal}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowProjectModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Proyecto</Text>
            {MOCK_PROJECTS.map((proj) => (
              <TouchableOpacity 
                key={proj.id} 
                style={[styles.projectOption, activeProjectName === proj.name && styles.projectOptionActive]}
                onPress={() => {
                  setActiveProjectName(proj.name);
                  setShowProjectModal(false);
                }}
              >
                <Feather name="map-pin" size={16} color={activeProjectName === proj.name ? Colors.primary : Colors.textSecondary} />
                <Text style={[styles.projectOptionText, activeProjectName === proj.name && styles.projectOptionTextActive]}>
                  {proj.name}
                </Text>
                {activeProjectName === proj.name && <Feather name="check-circle" size={16} color={Colors.primary} style={{marginLeft: 'auto'}} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.paper,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  idCardContainer: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
  },
  photoHero: {
    width: '100%',
    aspectRatio: 3/4,
    justifyContent: 'flex-end',
    ...Shadows.lg,
  },
  hologramOverlay: {
    padding: Spacing.md,
  },
  biometricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 8,
  },
  biometricText: {
    color: Colors.paper,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 4,
  },
  hudContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.paper,
    marginTop: -20,
    marginHorizontal: Spacing.lg,
    padding: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    ...Shadows.md,
  },
  hudItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  hudDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.divider,
  },
  mainInfoCard: {
    backgroundColor: Colors.paper,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    ...Shadows.sm,
  },
  dataPoint: {
    marginBottom: Spacing.lg,
  },
  dataLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  projectSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  gridItem: {
    flex: 1,
  },
  typeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  typeStatusText: {
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 4,
  },
  timeDisplay: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  locationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationMain: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  locationSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  securityLog: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    opacity: 0.7,
  },
  securityLogText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 8,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  primaryActionBtn: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xxl,
    height: 56,
    backgroundColor: Colors.textPrimary,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  primaryActionText: {
    color: Colors.paper,
    fontSize: 16,
    fontWeight: '800',
  },
  // Modal Styles (Kept for Project Switcher)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.paper,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    padding: Spacing.xl,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  projectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  projectOptionActive: {
    backgroundColor: 'rgba(14, 133, 189, 0.05)',
  },
  projectOptionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: Spacing.md,
  },
  projectOptionTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
