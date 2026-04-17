import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter } from 'expo-router';

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
     if (isToday) status = 'active';
     else if (i === 6) status = 'missing';
     else if (i === 7) status = 'incomplete';
     else if (i < 9) status = 'completed';
     days.push({ id: `d${i}`, number: i, empty: false, status, isToday });
  }
  return days;
};

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = React.useState(9);
  const monthDays = generateMockMonth();

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
    7: [
       { id: 301, title: 'Check-In Facial', time: '07:10 AM', type: 'registry', status: 'In' },
       { id: 302, title: 'Cableado DC', time: '08:00 AM', type: 'activity', detail: 'Zanjas Sector Sur' },
    ],
    6: [
       { id: 401, title: 'Check-In Facial', time: '06:50 AM', type: 'registry', status: 'In' },
       { id: 402, title: 'Instalación Inversores', time: '09:00 AM', type: 'activity', detail: 'Plataforma B' },
    ]
  };

  const selectedDayData = monthDays.find(d => d.number === selectedDay);
  const currentAgenda = MOCK_DAILY_AGENDA[selectedDay] || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Registro Mensual</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.monthSelector}>
           <Feather name="chevron-left" size={24} color={Colors.textMuted} />
           <Text style={styles.monthName}>Mayo 2026</Text>
           <Feather name="chevron-right" size={24} color={Colors.textMuted} />
        </View>

        <View style={styles.statsCard}>
           <View style={styles.statCol}>
              <Text style={styles.statNum}>8</Text>
              <Text style={styles.statLabel}>Días Trabajados</Text>
           </View>
           <View style={styles.statDivider} />
           <View style={styles.statCol}>
              <Text style={styles.statNum}>62</Text>
              <Text style={styles.statLabel}>Horas Registradas</Text>
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
                 let textStyle: any = null;

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
                       {day.status === 'worked' && <View style={styles.workedDot} />}
                    </TouchableOpacity>
                 );
              })}
           </View>
        </View>

        <Text style={styles.sectionTitle}>Agenda Ejecutada - {selectedDay} Mayo</Text>
        
        {selectedDayData?.status === 'missing' && (
            <View style={styles.missingAlertCard}>
                <Feather name="alert-triangle" size={24} color={Colors.error} style={{marginRight: Spacing.md}} />
                <View style={{flex: 1}}>
                    <Text style={styles.missingAlertTitle}>DÍA INCOMPLETO</Text>
                    <Text style={styles.missingAlertDesc}>Falta el registro de SALIDA en este día. Contacta con RRHH.</Text>
                </View>
            </View>
        )}
        {selectedDayData?.status === 'incomplete' && (
            <View style={[styles.missingAlertCard, { backgroundColor: Colors.warningLight, borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                <Feather name="clock" size={24} color={'#B45309'} style={{marginRight: Spacing.md}} />
                <View style={{flex: 1}}>
                    <Text style={[styles.missingAlertTitle, {color: '#B45309'}]}>HORAS INCOMPLETAS</Text>
                    <Text style={[styles.missingAlertDesc, {color: '#B45309'}]}>Registraste 6.5 Hrs de las 8 Hrs esperadas para este turno.</Text>
                </View>
            </View>
        )}

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
            <View style={styles.emptyState}>
                <Feather name="info" size={24} color={Colors.textMuted} />
                <Text style={styles.emptyStateText}>No hay datos registrados para este día.</Text>
            </View>
        )}

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
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 110,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.paper,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  monthName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.paper,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.divider,
  },
  calendarCard: {
    backgroundColor: Colors.paper,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
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
    fontWeight: '500',
  },
  workedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.success,
    position: 'absolute',
    bottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
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
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.paper,
    borderRadius: Radii.md,
    marginTop: Spacing.md,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  missingAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  missingAlertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.error,
    marginBottom: 2,
  },
  missingAlertDesc: {
    fontSize: 12,
    color: Colors.error,
  }
});
