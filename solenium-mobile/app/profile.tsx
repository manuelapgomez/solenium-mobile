import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, TextStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter } from 'expo-router';
import { SessionManager } from '../constants/session';

const { width } = Dimensions.get('window');

// Utilities to mock a calendar
const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const generateMockMonth = () => {
  const days = [];
  for (let i = 0; i < 5; i++) {
     days.push({ id: `e${i}`, empty: true });
  }
  for (let i = 1; i <= 31; i++) {
     const isToday = i === 9;
     let status = 'upcoming';
     const hasOvertime = i === 5 || i === 8; // Mock overtime for demo
     
     if (isToday) status = 'active';
     else if (i === 6) status = 'missing';
     else if (i === 7) status = 'incomplete';
     else if (i < 9) status = 'completed';
     days.push({ id: `d${i}`, number: i, empty: false, status, isToday, hasOvertime });
  }
  return days;
};

const MOCK_DAILY_AGENDA: any = {
    9: [
      { id: 101, title: 'Check-In Facial', time: '07:05 AM', type: 'registry', status: 'In' },
      { id: 102, title: 'Montaje Estructuras', time: '08:00 AM', type: 'activity', detail: '40 Paneles' },
    ],
    8: [
       { id: 201, title: 'Check-In Facial', time: '06:55 AM', type: 'registry', status: 'In' },
       { id: 202, title: 'Cimentación Postes', time: '07:30 AM', type: 'activity', detail: '12 Postes' },
       { id: 203, title: 'Check-Out Salida', time: '04:00 PM', type: 'registry', status: 'Out' },
    ],
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(9);
  const monthDays = generateMockMonth();
  const selectedDayData = monthDays.find(d => d.number === selectedDay);
  const currentAgenda = MOCK_DAILY_AGENDA[selectedDay] || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Dynamic Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil y Registro</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 40, Spacing.xxl) }]}
      >
        
        {/* HIGH HIERARCHY USER CARD */}
        <View style={styles.profileMasterCard}>
            <View style={styles.userCoreInfo}>
                <View style={styles.avatarLarge}>
                    <Text style={styles.avatarTextLarge}>AS</Text>
                    <View style={styles.activeStatusDot} />
                </View>
                <View style={styles.userTextInfo}>
                    <Text style={styles.userNameLarge}>Admin Solenium</Text>
                    <Text style={styles.userRoleTag}>SUPERVISOR DE CAMPO</Text>
                    <View style={styles.userProjectBadge}>
                        <Feather name="map-pin" size={10} color={Colors.primary} />
                        <Text style={styles.userProjectText}>Parque Solar Fase 1</Text>
                    </View>
                </View>
            </View>

            <View style={styles.adminActionsDivider} />

            <TouchableOpacity style={styles.switchAccountRow} onPress={() => router.push('/switch_account' as any)}>
                <View style={styles.switchAccountLeft}>
                    <View style={styles.switchAccountIconBg}>
                        <Feather name="users" size={18} color={Colors.primary} />
                    </View>
                    <View>
                        <Text style={styles.switchAccountTitle}>Gestionar Cuentas</Text>
                        <Text style={styles.switchAccountSub}>Cambiar a otro perfil de operario</Text>
                    </View>
                </View>
                <Feather name="chevron-right" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
        </View>



        {/* MONTHLY REGISTRY SECTION - OPTIMIZED BASICS */}
        <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Registro Mensual</Text>
            <View style={styles.monthPill}>
                <Text style={styles.monthPillText}>Mayo 2026</Text>
            </View>
        </View>

        <View style={styles.calendarCard}>
           <View style={styles.weekDaysRow}>
              {DAYS_OF_WEEK.map(day => (
                 <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
           </View>
           
           <View style={styles.daysGrid}>
              {monthDays.map((day) => {
                 if (day.empty) return <View key={day.id} style={styles.dayCellEmpty} />;

                 let cellStyle: any = null;
                 let textStyle: any = { color: Colors.textPrimary };

                 if (day.status === 'completed') {
                    cellStyle = { backgroundColor: Colors.successLight };
                    textStyle = { color: Colors.success, fontWeight: '800' };
                 } else if (day.status === 'missing') {
                    cellStyle = { backgroundColor: Colors.errorLight };
                    textStyle = { color: Colors.error, fontWeight: '800' };
                 } else if (day.status === 'incomplete') {
                    cellStyle = { backgroundColor: Colors.warningLight };
                    textStyle = { color: '#B45309', fontWeight: '800' };
                 } else if (day.isToday) {
                    cellStyle = { backgroundColor: Colors.primary };
                    textStyle = { color: Colors.paper, fontWeight: '800' };
                 } 

                 return (
                    <TouchableOpacity 
                        key={day.id} 
                        style={[
                            styles.dayCell, 
                            cellStyle,
                            day.number === selectedDay && !day.isToday && { borderWidth: 2, borderColor: Colors.primary }
                        ]}
                        onPress={() => setSelectedDay(day.number!)}
                    >
                       <Text style={[styles.dayText, textStyle]}>{day.number}</Text>
                    </TouchableOpacity>
                 );
              })}
           </View>
        </View>

        {/* DAILY AGENDA DETAIL */}
        <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Actividad día {selectedDay}</Text>

        </View>
        
        {currentAgenda.length > 0 ? (
            currentAgenda.map((item: any) => (
                <View key={item.id} style={styles.historyCard}>
                    <View style={styles.historyLeft}>
                        <View style={[styles.iconCircle, item.type === 'registry' && { backgroundColor: Colors.primaryLight }]}>
                            <Feather 
                                name={item.type === 'registry' ? 'shield' : (item.type === 'activity' ? 'tool' : 'coffee')} 
                                size={16} 
                                color={item.type === 'registry' ? Colors.primary : Colors.textPrimary} 
                            />
                        </View>
                        <View style={styles.historyTextCol}>
                            <Text style={styles.historyTitle}>{item.title}</Text>
                            <Text style={styles.historyDate}>{item.time} {item.detail ? `• ${item.detail}` : ''}</Text>
                        </View>
                    </View>
                    {item.status && (
                        <View style={[styles.statusBadgeSmall, { backgroundColor: item.status === 'In' ? Colors.successLight : Colors.errorLight }]}>
                            <Text style={[styles.statusBadgeTextSmall, { color: item.status === 'In' ? Colors.success : Colors.error }]}>
                                {item.status}
                            </Text>
                        </View>
                    )}
                </View>
            ))
        ) : (
            <View style={styles.emptyActivityCard}>
                <Feather name="calendar" size={18} color={Colors.textMuted} />
                <Text style={styles.emptyActivityText}>Sin registros detallados para esta fecha.</Text>
            </View>
        )}

        <TouchableOpacity 
            style={styles.fullLogoutBtn}
            onPress={() => {
                SessionManager.setUserId(null);
                router.replace('/login' as any);
            }}
        >
            <Text style={styles.fullLogoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>
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
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  profileMasterCard: {
    backgroundColor: Colors.paper,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  userCoreInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTextLarge: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
  },
  activeStatusDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.paper,
  },
  userTextInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  userNameLarge: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userRoleTag: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.textMuted,
    marginTop: 2,
    letterSpacing: 1,
  },
  userProjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
  },
  userProjectText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.paper,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.divider,
  },
  overtimeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminActionsDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.lg,
    opacity: 0.5,
  },
  switchAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radii.md,
  },
  switchAccountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchAccountIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    ...Shadows.sm,
  },
  switchAccountTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  switchAccountSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  monthPill: {
    backgroundColor: Colors.paper,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  monthPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  calendarCard: {
    backgroundColor: Colors.paper,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  weekDayText: {
    width: '14.2%',
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCellEmpty: {
    width: '14.2%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.2%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.full,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.paper,
    borderRadius: Radii.md,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  historyTextCol: {
    flexShrink: 1,
  },
  historyDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeTextSmall: {
    fontSize: 10,
    fontWeight: '800',
  },
  emptyActivityCard: {
    backgroundColor: Colors.paper,
    padding: Spacing.xl,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: 0.6,
  },
  emptyActivityText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginLeft: 8,
    fontWeight: '600',
  },
  fullLogoutBtn: {
      marginTop: Spacing.xxl,
      padding: Spacing.md,
      alignItems: 'center',
  },
  fullLogoutText: {
      color: Colors.error,
      fontWeight: '700',
      fontSize: 14,
      textDecorationLine: 'underline',
  }
});
