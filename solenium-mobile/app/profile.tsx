import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Feather name="x" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Feather name="user" size={32} color={Colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Manuela Patiño Gómez</Text>
            <Text style={styles.userRole}>Diseñadora UX/UI - Proyecto Norte</Text>
          </View>
        </View>

        {/* Sync Status - Previously "Eventos Pendientes" */}
        <View style={styles.syncCard}>
          <View style={styles.syncLeft}>
            <Feather name="cloud-off" size={20} color={Colors.warning} />
            <Text style={styles.syncText}>2 Registros sin sincronizar</Text>
          </View>
          <TouchableOpacity style={styles.syncBtn}>
            <Text style={styles.syncBtnText}>Sincronizar</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Records */}
        <Text style={styles.sectionTitle}>Registros Recientes</Text>
        
        <View style={styles.recordItem}>
           <View style={styles.recordIcon}>
              <Feather name="arrow-up-right" size={16} color={Colors.success} />
           </View>
           <View style={styles.recordDetails}>
              <Text style={styles.recordTitle}>Entrada - Check In Facial</Text>
              <Text style={styles.recordDate}>Hoy, 7:00 AM</Text>
           </View>
           <Text style={styles.recordStatus}>Publicado</Text>
        </View>

        <View style={styles.recordItem}>
           <View style={styles.recordIcon}>
              <Feather name="arrow-down-left" size={16} color={Colors.error} />
           </View>
           <View style={styles.recordDetails}>
              <Text style={styles.recordTitle}>Salida - Check Out</Text>
              <Text style={styles.recordDate}>Ayer, 6:05 PM</Text>
           </View>
           <Text style={styles.recordStatus}>Publicado</Text>
        </View>

      </ScrollView>

      {/* Switch Account Button */}
      <TouchableOpacity 
        style={styles.adminLogoutBtn} 
        onPress={() => router.push('/switch_account')}
      >
        <Feather name="users" size={20} color={Colors.primary} />
        <Text style={[styles.adminLogoutText, { color: Colors.primary }]}>Cambiar de Usuario</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.paper,
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  userRole: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.warningLight,
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginBottom: Spacing.xl,
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncText: {
    marginLeft: Spacing.sm,
    color: Colors.warning,
    fontWeight: '600',
  },
  syncBtn: {
    backgroundColor: Colors.paper,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.sm,
  },
  syncBtnText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.paper,
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginBottom: Spacing.sm,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  recordDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  recordStatus: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.success,
  },
  adminLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  adminLogoutText: {
    marginLeft: Spacing.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  }
});
