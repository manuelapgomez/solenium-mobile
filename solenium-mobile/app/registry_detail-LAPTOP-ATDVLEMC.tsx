import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function RegistryDetailScreen() {
  const router = useRouter();
  const { title, time } = useLocalSearchParams();
  
  // Simulated project and photo data
  const projectName = "Parque Solar Solenium - Fase 1";
  const isExit = title?.toString().toLowerCase().includes('out') || title?.toString().toLowerCase().includes('salida');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de Registro</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* PHOTO SECTION */}
        <View style={styles.photoContainer}>
           <ImageBackground 
             source={require('../assets/images/worker_face.png')} 
             style={styles.photo}
             imageStyle={{ borderRadius: Radii.lg }}
           >
              <View style={styles.photoOverlay}>
                 <View style={styles.validBadge}>
                    <Feather name="shield" size={12} color={Colors.paper} />
                    <Text style={styles.validText}>BIOMETRÍA VALIDADA</Text>
                 </View>
              </View>
           </ImageBackground>
        </View>

        {/* INFO CARD */}
        <View style={styles.infoCard}>
           <View style={styles.projectSection}>
              <Text style={styles.label}>PROYECTO</Text>
              <Text style={styles.projectValue}>{projectName}</Text>
           </View>
           
           <View style={styles.divider} />

           <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                 <Text style={styles.label}>TIPO</Text>
                 <View style={[styles.typeBadge, { backgroundColor: isExit ? Colors.errorLight : Colors.successLight }]}>
                    <Feather name={isExit ? "moon" : "sunrise"} size={14} color={isExit ? Colors.error : Colors.success} />
                    <Text style={[styles.typeText, { color: isExit ? Colors.error : Colors.success }]}>
                       {isExit ? 'SALIDA' : 'INGRESO'}
                    </Text>
                 </View>
              </View>
              
              <View style={styles.detailItem}>
                 <Text style={styles.label}>HORA</Text>
                 <Text style={styles.timeValue}>{time || '07:00 AM'}</Text>
              </View>
           </View>

           <View style={styles.locationSection}>
              <Feather name="map-pin" size={14} color={Colors.textMuted} />
              <Text style={styles.locationText}>Antioquia, Colombia (GPS Validado)</Text>
           </View>
        </View>

        {/* FOOTER ACTION */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
           <Text style={styles.closeBtnText}>Cerrar Detalle</Text>
        </TouchableOpacity>
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
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
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
  photoContainer: {
    width: '100%',
    aspectRatio: 4/5,
    marginBottom: Spacing.xl,
    ...Shadows.lg,
  },
  photo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  photoOverlay: {
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  validBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  validText: {
    color: Colors.paper,
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: Colors.paper,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  projectValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  detailItem: {
    flex: 1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.sm,
    marginTop: 2,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 4,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.md,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 6,
    fontWeight: '500',
  },
  closeBtn: {
    marginTop: 'auto',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.textPrimary,
    height: 60,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  closeBtnText: {
    color: Colors.paper,
    fontSize: 16,
    fontWeight: '800',
  }
});
