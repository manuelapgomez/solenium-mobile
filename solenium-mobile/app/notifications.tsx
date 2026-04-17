import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          
          <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Requieren Acción</Text>
          </View>

          {/* Critical Alert */}
          <View style={styles.alertCardCritical}>
              <View style={styles.alertIconCritical}>
                  <Feather name="alert-triangle" size={20} color={Colors.error} />
              </View>
              <View style={styles.alertTextContent}>
                  <Text style={styles.alertTitleCritical}>¡Falta registro de salida!</Text>
                  <Text style={styles.alertDescCritical}>Olvidaste el check-out el Miércoles 6. Toca para reportar la hora.</Text>
                  <Text style={styles.timeText}>Hace 2 días</Text>
              </View>
          </View>

          {/* Warning Alert */}
          <View style={styles.alertCardWarning}>
              <View style={styles.alertIconWarning}>
                  <Feather name="cloud-off" size={20} color={Colors.warning} />
              </View>
              <View style={styles.alertTextContent}>
                  <Text style={styles.alertTitleWarning}>Sincronización Pendiente</Text>
                  <Text style={styles.alertDescWarning}>Tienes 3 registros locales guardados sin internet. Sube la información antes de cerrar sesión.</Text>
                  <Text style={styles.timeText}>Ayer</Text>
              </View>
          </View>

          <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Informativas</Text>
          </View>
          <View style={styles.infoCard}>
              <View style={styles.iconContainer}>
                 <Feather name="check-circle" size={20} color={Colors.primary} />
              </View>
              <View style={styles.alertTextContent}>
                  <Text style={styles.infoTitle}>Nómina Cerrada</Text>
                  <Text style={styles.infoDesc}>Tus horas de la semana pasada han sido aprobadas exitosamente.</Text>
                  <Text style={styles.timeText}>Lunes, 10:00 AM</Text>
              </View>
          </View>
        </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  sectionHeader: {
      marginBottom: Spacing.md,
      marginTop: Spacing.sm,
  },
  sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: Colors.textSecondary,
      textTransform: 'uppercase',
  },
  
  // Alert Cards
  alertCardCritical: {
      flexDirection: 'row',
      backgroundColor: Colors.errorLight,
      borderRadius: Radii.md,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  alertIconCritical: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
  },
  alertTextContent: {
      flex: 1,
  },
  alertTitleCritical: {
      fontSize: 15,
      fontWeight: '800',
      color: Colors.error,
      marginBottom: 4,
  },
  alertDescCritical: {
      fontSize: 13,
      color: Colors.error,
      lineHeight: 18,
      marginBottom: 8,
  },
  
  alertCardWarning: {
      flexDirection: 'row',
      backgroundColor: Colors.warningLight,
      borderRadius: Radii.md,
      padding: Spacing.md,
      marginBottom: Spacing.xl,
  },
  alertIconWarning: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
  },
  alertTitleWarning: {
      fontSize: 15,
      fontWeight: '800',
      color: '#B45309',
      marginBottom: 4,
  },
  alertDescWarning: {
      fontSize: 13,
      color: '#B45309',
      lineHeight: 18,
      marginBottom: 8,
  },

  timeText: {
      fontSize: 11,
      fontWeight: '600',
      color: Colors.textMuted,
  },

  infoCard: {
      flexDirection: 'row',
      backgroundColor: Colors.paper,
      borderRadius: Radii.md,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: Colors.border,
      ...Shadows.sm,
  },
  iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
  },
  infoTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: Colors.textPrimary,
      marginBottom: 4,
  },
  infoDesc: {
      fontSize: 13,
      color: Colors.textSecondary,
      lineHeight: 18,
      marginBottom: 8,
  }
});
