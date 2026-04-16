import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter } from 'expo-router';

// Reusing same mock data structure
const MOCK_USERS = [
  { id: 'admin', name: 'Admin Solenium', role: 'admin', area: 'Todas las Áreas', icon: 'shield' },
  { id: 'civil', name: 'Juan Cimentaciones', role: 'worker', area: 'Ingeniería Civil', icon: 'hard-drive' },
  { id: 'electric', name: 'Carlos Voltajes', role: 'worker', area: 'Instalación Eléctrica', icon: 'zap' },
  { id: 'logistics', name: 'Ana Entregas', role: 'worker', area: 'Logística y Almacén', icon: 'package' },
];

export default function SwitchAccountScreen() {
  const router = useRouter();

  const handleSelectUser = (userId: string) => {
    // Navigate home passing the selected user ID to simulate "login"
    router.replace({ pathname: '/', params: { userId } });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cambiar Usuario</Text>
            <View style={{ width: 44 }} />
        </View>

        <Text style={styles.introText}>
            Selecciona el perfil que usará este dispositivo ahora.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
            {MOCK_USERS.map((user) => (
                <TouchableOpacity 
                    key={user.id} 
                    style={styles.userCard}
                    onPress={() => handleSelectUser(user.id)}
                >
                    <View style={[styles.avatar, user.role === 'admin' && styles.adminAvatar]}>
                        <Feather name={user.icon as any} size={24} color={user.role === 'admin' ? Colors.primary : Colors.textSecondary} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userArea}>{user.area}</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={Colors.divider} />
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.newUserBtn}>
                <Feather name="plus-circle" size={20} color={Colors.primary} />
                <Text style={styles.newUserText}>Registrar nuevo usuario</Text>
            </TouchableOpacity>
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
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.paper,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  adminAvatar: {
    backgroundColor: Colors.primaryLight,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  userArea: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  newUserBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.divider,
    borderRadius: Radii.lg,
  },
  newUserText: {
    marginLeft: Spacing.sm,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  }
});
