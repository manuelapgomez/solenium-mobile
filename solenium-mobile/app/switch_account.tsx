import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter } from 'expo-router';

// Reusing same mock data structure
const INITIAL_USERS = [
  { id: 'admin', name: 'Admin Solenium', role: 'admin', area: 'Todas las Áreas', icon: 'shield' },
  { id: 'civil', name: 'Juan Cimentaciones', role: 'worker', area: 'Ingeniería Civil', icon: 'hard-drive' },
  { id: 'electric', name: 'Carlos Voltajes', role: 'worker', area: 'Instalación Eléctrica', icon: 'zap' },
  { id: 'logistics', name: 'Ana Entregas', role: 'worker', area: 'Logística y Almacén', icon: 'package' },
];

export default function SwitchAccountScreen() {
  const router = useRouter();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectUser = (userId: string) => {
    if (isEditing) return;
    // For existing users on the device, we only need 1 verification photo
    router.replace({ pathname: '/onboarding' as any, params: { userId, mode: 'verify' } });
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === 'admin') {
      Alert.alert('Error', 'No se puede eliminar el perfil de administrador.');
      return;
    }
    setUsers(users.filter(u => u.id !== userId));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cambiar Usuario</Text>
            <TouchableOpacity 
                style={styles.backBtn} 
                onPress={() => setIsEditing(!isEditing)}
            >
                <Feather name={isEditing ? "check" : "edit-2"} size={20} color={isEditing ? Colors.success : Colors.primary} />
            </TouchableOpacity>
        </View>

        <Text style={styles.introText}>
            {isEditing ? 'Toca el icono rojo para eliminar un perfil.' : 'Selecciona el perfil que usará este dispositivo ahora.'}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
            {users.map((user) => (
                <View key={user.id} style={styles.cardWrapper}>
                    <TouchableOpacity 
                        style={[styles.userCard, isEditing && user.id !== 'admin' && { marginRight: 42 }]}
                        onPress={() => handleSelectUser(user.id)}
                        disabled={isEditing}
                    >
                        <View style={[styles.avatar, user.role === 'admin' && styles.adminAvatar]}>
                            <Feather name={user.icon as any} size={24} color={user.role === 'admin' ? Colors.primary : Colors.textSecondary} />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userArea}>{user.area}</Text>
                        </View>
                        {!isEditing && <Feather name="chevron-right" size={20} color={Colors.divider} />}
                    </TouchableOpacity>

                    {isEditing && user.id !== 'admin' && (
                        <TouchableOpacity 
                            style={styles.deleteBtn}
                            onPress={() => handleDeleteUser(user.id)}
                        >
                            <Feather name="trash-2" size={20} color={Colors.error} />
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            <TouchableOpacity 
                style={styles.newUserBtn}
                onPress={() => router.push({ pathname: '/onboarding' as any, params: { mode: 'register' } })}
            >
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
  },
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    marginBottom: Spacing.md,
  }
});
