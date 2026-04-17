import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter } from 'expo-router';

// Utilities to mock a calendar
const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
// A completely mocked month grid (e.g. May 2026 starting on Friday)
const generateMockMonth = () => {
  const days = [];
  // 5 empty spots for May 1st starting on Friday
  for (let i = 0; i < 5; i++) {
     days.push({ id: `e${i}`, empty: true });
  }
  for (let i = 1; i <= 31; i++) {
     const isToday = i === 9; // Let's say today is 9
     // random logic to populate work status
     const status = i < 9 && i > 3 ? 'worked' : (i === 9 ? 'active' : 'upcoming');
     days.push({ id: `d${i}`, number: i, empty: false, status, isToday });
  }
  return days;
};

export default function CalendarScreen() {
  const router = useRouter();
  const monthDays = generateMockMonth();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Registro Mensual</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Month Selector */}
        <View style={styles.monthSelector}>
           <Feather name="chevron-left" size={24} color={Colors.textMuted} />
           <Text style={styles.monthName}>Mayo 2026</Text>
           <Feather name="chevron-right" size={24} color={Colors.textMuted} />
        </View>

        {/* Global Record Stats */}
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

        {/* Calendar Grid */}
        <View style={styles.calendarCard}>
           {/* Days Row */}
           <View style={styles.weekDaysRow}>
              {DAYS_OF_WEEK.map(day => (
                 <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
           </View>
           
           {/* Grid */}
           <View style={styles.daysGrid}>
              {monthDays.map((day) => {
                 if (day.empty) {
                    return <View key={day.id} style={styles.dayCellEmpty} />;
                 }

                 // Styles logic based on status
                 let cellStyle = null;
                 let textStyle = null;

                 if (day.status === 'worked') {
                    cellStyle = { backgroundColor: Colors.successLight };
                    textStyle = { color: Colors.success, fontWeight: '700' };
                 } else if (day.isToday) {
                    cellStyle = { backgroundColor: Colors.primary };
                    textStyle = { color: Colors.paper, fontWeight: '800' };
                 }

                 return (
                    <View key={day.id} style={[styles.dayCell, cellStyle]}>
                       <Text style={[styles.dayText, textStyle]}>{day.number}</Text>
                       {day.status === 'worked' && <View style={styles.workedDot} />}
                    </View>
                 );
              })}
           </View>
        </View>

        <Text style={styles.sectionTitle}>Historial del mes</Text>
        
        {/* List of history logs (reusing style concepts from wireframes) */}
        <View style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <View style={styles.iconCircle}>
                 <Feather name="calendar" size={16} color={Colors.textPrimary} />
              </View>
              <View style={styles.historyTextCol}>
                 <Text style={styles.historyTitle}>Turno Completo</Text>
                 <Text style={styles.historyDate}>Vie 8 Mayo</Text>
                 <View style={styles.historyTimes}>
                    <Text style={styles.timeIn}>In: 07:00 AM</Text>
                    <Text style={styles.timeSep}> • </Text>
                    <Text style={styles.timeOut}>Out: 03:30 PM</Text>
                 </View>
              </View>
           </View>
           <Text style={styles.historyHours}>8.5 Hrs</Text>
        </View>

        <View style={styles.historyCard}>
           <View style={styles.historyLeft}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.warningLight }]}>
                 <Feather name="alert-circle" size={16} color={Colors.warning} />
              </View>
              <View style={styles.historyTextCol}>
                 <Text style={styles.historyTitle}>Salida Anticipada</Text>
                 <Text style={styles.historyDate}>Jue 7 Mayo</Text>
                 <View style={styles.historyTimes}>
                    <Text style={styles.timeIn}>In: 07:15 AM</Text>
                    <Text style={styles.timeSep}> • </Text>
                    <Text style={styles.timeOut}>Out: 01:15 PM</Text>
                 </View>
              </View>
           </View>
           <Text style={styles.historyHours}>6.0 Hrs</Text>
        </View>

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
    marginBottom: 4,
  },
  historyTimes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIn: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  timeOut: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.error,
  },
  timeSep: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  historyHours: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  }
});
