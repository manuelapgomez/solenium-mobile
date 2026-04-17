import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <View style={styles.heroSection}>
            <View style={styles.logoBadge}>
                <Feather name="shield" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.welcomeTitle}>Solenium</Text>
            <Text style={styles.welcomeSubtitle}>Seguridad y Transparencia en Campo</Text>
        </View>

        <View style={styles.infoSection}>
            <View style={styles.infoCard}>
                <View style={styles.infoIconBg}>
                    <Feather name="cpu" size={20} color={Colors.primary} />
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoCardTitle}>Identidad Biométrica</Text>
                    <Text style={styles.infoCardDesc}>
                        Usamos tecnología de reconocimiento facial para asegurar que cada reporte sea auténtico y proteja tu responsabilidad.
                    </Text>
                </View>
            </View>

            <View style={styles.infoCard}>
                <View style={styles.infoIconBg}>
                    <Feather name="wifi-off" size={20} color={Colors.success} />
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoCardTitle}>Funciona Sin Internet</Text>
                    <Text style={styles.infoCardDesc}>
                        Tu biometría se procesa localmente en el dispositivo. Puedes iniciar sesión y registrar avances en cualquier lugar.
                    </Text>
                </View>
            </View>

            <View style={styles.infoCard}>
                <View style={styles.infoIconBg}>
                    <Feather name="lock" size={20} color={Colors.warning} />
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoCardTitle}>Datos Protegidos</Text>
                    <Text style={styles.infoCardDesc}>
                        Tus fotos solo se usan para validar tu jornada laboral y nunca se comparten con terceros.
                    </Text>
                </View>
            </View>
        </View>

        <View style={styles.footer}>
            <TouchableOpacity 
                style={styles.primaryBtn}
                onPress={() => router.push('/onboarding')}
            >
                <Text style={styles.primaryBtnText}>Comenzar Registro</Text>
                <Feather name="arrow-right" size={20} color={Colors.paper} />
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.secondaryBtn}
                onPress={() => router.push('/switch_account')}
            >
                <Text style={styles.secondaryBtnText}>Ya tengo una cuenta en este equipo</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  infoSection: {
    marginVertical: Spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    alignItems: 'flex-start',
  },
  infoIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoCardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    gap: Spacing.md,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  primaryBtnText: {
    color: Colors.paper,
    fontSize: 17,
    fontWeight: '800',
    marginRight: Spacing.sm,
  },
  secondaryBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
