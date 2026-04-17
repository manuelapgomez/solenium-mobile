import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Shadows, Spacing, Radii } from '../constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

// Role System Mock Data
const MOCK_USERS: any = {
  admin: { name: 'Admin Solenium', role: 'admin', assignedArea: 'all' },
  civil: { name: 'Juan Cimentaciones', role: 'worker', assignedArea: 'Civil' },
  electric: { name: 'Carlos Voltajes', role: 'worker', assignedArea: 'Eléctrica' },
  logistics: { name: 'Ana Entregas', role: 'worker', assignedArea: 'Logística' },
};

// Available Projects Set
const MOCK_PROJECTS = [
  { id: 'p1', name: 'Parque Solar Fase 1' },
  { id: 'p2', name: 'Minigranja Norte' },
  { id: 'p3', name: 'Minigranja Sur' },
];

const DAYS = [
  { day: 'Mon', date: '4' },
  { day: 'Tue', date: '5' },
  { day: 'Wed', date: '6' },
  { day: 'Thu', date: '7' },
  { day: 'Fri', date: '8' },
  { day: 'Sat', date: '9', active: true },
  { day: 'Sun', date: '10' },
];

const TIMELINE_EVENTS = [
  {
    id: 1,
    type: 'registry',
    title: 'Check-In Facial',
    time: '7:00 AM',
    subtitle: 'Registro validado en portería Principal',
    status: 'completed',
    area: 'all',
    projectId: 'p1'
  },
  {
    id: 2,
    type: 'activity',
    title: 'Montaje Estructura Metálica',
    area: 'Civil',
    time: '8:00 AM',
    subtitle: 'Nivelación y fijación de soportes base.',
    status: 'completed',
    dayInfo: 'Día 2/5',
    targetQuantity: 400,
    unit: 'Paneles',
    plannedProgress: 160,
    actualProgress: 155,
    yesterdayProgress: 55,
    todayProgress: 100,
    filesCount: 10,
    projectId: 'p1'
  },
  {
    id: 3,
    type: 'activity',
    title: 'Instalación Eléctrica AC',
    area: 'Eléctrica',
    time: '11:00 AM',
    subtitle: 'Cableado de inversores centrales.',
    status: 'active',
    dayInfo: 'Día 1/3',
    targetQuantity: 60,
    unit: 'Inversores',
    plannedProgress: 20,
    actualProgress: 27,
    yesterdayProgress: 0,
    todayProgress: 27,
    filesCount: 5,
    projectId: 'p1'
  },
  {
    id: 4,
    type: 'registry',
    title: 'Check-Out Salida',
    time: '6:00 PM',
    subtitle: 'Pendiente de registrar salida.',
    status: 'pending',
    area: 'all',
    projectId: 'p1'
  },
  {
    id: 5,
    type: 'registry',
    title: 'Check-In Facial',
    time: '7:30 AM',
    subtitle: 'Registro validado en acceso Norte',
    status: 'completed',
    area: 'all',
    projectId: 'p2'
  },
  {
    id: 6,
    type: 'activity',
    title: 'Cerramiento Perimetral',
    area: 'Civil',
    time: '9:00 AM',
    subtitle: 'Instalación de malla en costado Este.',
    status: 'active',
    dayInfo: 'Día 3/7',
    targetQuantity: 1000,
    unit: 'Metros',
    plannedProgress: 500,
    actualProgress: 600,
    yesterdayProgress: 400,
    todayProgress: 200,
    filesCount: 2,
    projectId: 'p2'
  },
  {
    id: 7,
    type: 'registry',
    title: 'Check-Out Salida',
    time: '6:00 PM',
    subtitle: 'Pendiente de registrar salida.',
    status: 'pending',
    area: 'all',
    projectId: 'p2'
  },
];

export default function Home() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [currentUser, setCurrentUser] = useState(MOCK_USERS.admin);
  const [activeProject, setActiveProject] = useState(MOCK_PROJECTS[0]);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    if (userId && MOCK_USERS[userId as string]) {
      setCurrentUser(MOCK_USERS[userId as string]);
    }
  }, [userId]);

  const filteredEvents = TIMELINE_EVENTS.filter(event => {
    // Aislar por proyecto actual
    if (event.projectId !== activeProject.id) return false;
    // Permisos por Area/Rol
    if (event.type === 'registry' || currentUser.assignedArea === 'all') return true;
    return event.area === currentUser.assignedArea;
  });

  const toggleUser = () => {
    router.push('/switch_account');
  };

  // Renders the high-density card for Admin
  const renderDetailedCard = (event: any, isActive: boolean) => {
    const variance = event.actualProgress - event.plannedProgress;
    const isAhead = variance >= 0;
    
    // Dynamic quantitative metrics
    const plannedPercent = (event.plannedProgress / event.targetQuantity) * 100;
    const actualPercent = (event.actualProgress / event.targetQuantity) * 100;
    const yesterdayPercent = (event.yesterdayProgress / event.targetQuantity) * 100;
    const todayPercent = (event.todayProgress / event.targetQuantity) * 100;

    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: '/evidence', params: { title: event.title, targetQuantity: event.targetQuantity, unit: event.unit } })}
        style={[styles.detailedCard, isActive && Shadows.md]}
      >
        <View style={styles.detailedHeader}>
          <View style={styles.detailedHeaderLeft}>
            <View style={styles.areaBadge}>
               <Text style={styles.areaBadgeText}>{event.area.toUpperCase()}</Text>
            </View>
            <Text style={styles.detailedTitle}>{event.title}</Text>
          </View>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>{event.dayInfo}</Text>
          </View>
        </View>

        {/* COMPARISON STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avance programado</Text>
            <Text style={styles.statValueBlue}>{event.plannedProgress}</Text>
            <Text style={styles.statSublabel}>{event.unit}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avance real acumulado</Text>
            <View style={styles.valueWithVariance}>
              <Text style={styles.statValueDark}>{event.actualProgress}</Text>
              <Text style={[styles.varianceText, { color: isAhead ? Colors.success : Colors.error }]}>
                {isAhead ? `+${variance}` : `${variance}`}
              </Text>
            </View>
            <Text style={styles.statSublabel}>{event.unit}</Text>
          </View>
        </View>

        {/* DAY BREAKDOWN */}
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownTitle}>Desglose del día:</Text>
          <View style={styles.breakdownNumbers}>
            <Text style={styles.breakdownText}>Ayer tenía: <Text style={styles.textBold}>{event.yesterdayProgress} {event.unit}</Text></Text>
            <Text style={styles.breakdownText}>Hoy avanzó: <Text style={styles.textBold}>+{event.todayProgress} {event.unit}</Text></Text>
          </View>
        </View>

        {/* MULTI-SEGMENT PROGRESS BAR */}
        <View style={styles.progressSection}>
           <View style={styles.progressInfo}>
             <Text style={styles.progressLabel}>Progreso Total</Text>
             <Text style={styles.progressValueText}>{event.actualProgress} de {event.targetQuantity} {event.unit}</Text>
           </View>
           <View style={styles.progressBarBg}>
             {/* Segment 1: Yesterday */}
             <View style={[styles.progressSegmentPast, { width: `${yesterdayPercent}%` }]} />
             {/* Segment 2: Today */}
             <View style={[styles.progressSegmentToday, { width: `${todayPercent}%`, left: `${yesterdayPercent}%` }]} />
             {/* Marker: Expected */}
             <View style={[styles.expectedMarker, { left: `${plannedPercent}%` }]} />
           </View>
           <View style={styles.progressLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F87171' }]} />
                <Text style={styles.legendText}>Días anteriores</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4B5563' }]} />
                <Text style={styles.legendText}>Hoy</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendLine} />
                <Text style={styles.legendText}>Esperado ({Math.round(plannedPercent)}%)</Text>
              </View>
           </View>
        </View>

        {/* METRICS & SINGLE CTA ACTION */}
        <View style={styles.metricsMiniRow}>
           <View style={styles.metricItem}>
              <Feather name="check-circle" size={12} color={Colors.success} />
              <Text style={styles.metricText}>{event.filesCount} Archivos</Text>
           </View>
           <View style={styles.metricItem}>
              <Feather name="message-square" size={12} color={Colors.textSecondary} />
              <Text style={styles.metricText}>3 Comentarios</Text>
           </View>
           <TouchableOpacity style={styles.metricItemWarning}>
              <Feather name="alert-triangle" size={12} color={Colors.warning || '#F59E0B'} />
              <Text style={styles.metricTextWarning}>Novedad Activa</Text>
           </TouchableOpacity>
        </View>

        <TouchableOpacity 
           style={styles.cardActionBtnPrimary}
           onPress={() => router.push({ pathname: '/evidence', params: { title: event.title, targetQuantity: event.targetQuantity, unit: event.unit } })}
        >
           <Feather name="camera" size={16} color={Colors.paper} style={{ marginRight: 6 }} />
           <Text style={styles.cardActionTextLight}>Registrar Avance / Evidencia</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
                <TouchableOpacity onPress={() => setShowProjectModal(true)} style={styles.projectDropdownBtn}>
                    <Feather name="map-pin" size={12} color={Colors.textSecondary} style={{marginRight: 6}} />
                    <Text style={styles.projectDropdownText}>{activeProject.name}</Text>
                    <Feather name="chevron-down" size={14} color={Colors.textPrimary} style={{marginLeft: 4}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleUser} style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>
                        {currentUser.role === 'admin' ? 'Vista: ADMINISTRADOR' : `Área: ${currentUser.assignedArea}`}
                    </Text>
                    <Feather name="refresh-cw" size={10} color={Colors.primary} style={{marginLeft: 4}} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <View style={styles.avatar}>
                 <Feather name="user" size={20} color={currentUser.role === 'admin' ? Colors.primary : Colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.titleText}>Hola, {currentUser.name.split(' ')[0]}</Text>
          
          <View style={styles.daysRow}>
            {DAYS.map((d, i) => (
              <View key={i} style={styles.dayCol}>
                <Text style={[styles.dayName, d.active && styles.dayNameActive]}>{d.day}</Text>
                <Text style={[styles.dayNumber, d.active && styles.dayNumberActive]}>{d.date}</Text>
                {d.active && <View style={styles.activeDot} />}
              </View>
            ))}
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {filteredEvents.map((event, index) => {
            const isActive = event.status === 'active';
            const isCompleted = event.status === 'completed';
            
            return (
              <View key={event.id} style={styles.timelineRow}>
                <View style={styles.lineColumn}>
                  {index !== 0 && <View style={[styles.lineTop, isActive && styles.lineTopActive]} />}
                  <View style={[
                    styles.node, 
                    isActive && styles.nodeActive,
                    isCompleted && styles.nodeCompleted
                  ]}>
                    {isActive && <View style={styles.nodeInnerActive} />}
                    {isCompleted && <Feather name="check" size={10} color={Colors.primary} />}
                  </View>
                  {index !== filteredEvents.length - 1 && <View style={styles.lineBottom} />}
                </View>

                {/* Card or Registry Pill */}
                {event.type === 'registry' ? (
                  <TouchableOpacity 
                    style={styles.registryCard} 
                    onPress={() => router.push({ pathname: '/registry_detail', params: { title: event.title, time: event.time } })}
                  >
                     <Feather name={event.title.includes('Out') ? 'moon' : 'sunrise'} size={16} color={Colors.textSecondary} />
                     <Text style={styles.registryTitle}>{event.title}</Text>
                     <Text style={styles.registryTime}>{event.time}</Text>
                  </TouchableOpacity>
                ) : (
                  renderDetailedCard(event, isActive)
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: Spacing.xxl * 2 }} />
      </ScrollView>

      {/* Floating Action Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNavBackground} />
        <View style={styles.bottomNavContent}>
          <TouchableOpacity style={styles.navIcon} onPress={() => {}}>
             <Feather name="grid" size={24} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fabWrapper} onPress={() => router.push('/camera')}>
            <View style={styles.fab}>
              <Feather name="sun" size={32} color={Colors.paper} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIcon} onPress={() => router.push('/calendar')}>
             <Feather name="calendar" size={24} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Project Switcher Modal */}
      <Modal
        visible={showProjectModal}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowProjectModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar Proyecto Actual</Text>
            {MOCK_PROJECTS.map((proj) => (
              <TouchableOpacity 
                key={proj.id} 
                style={[styles.projectOption, activeProject.id === proj.id && styles.projectOptionActive]}
                onPress={() => {
                  setActiveProject(proj);
                  setShowProjectModal(false);
                }}
              >
                <Feather name="map-pin" size={16} color={activeProject.id === proj.id ? Colors.primary : Colors.textSecondary} />
                <Text style={[styles.projectOptionText, activeProject.id === proj.id && styles.projectOptionTextActive]}>
                  {proj.name}
                </Text>
                {activeProject.id === proj.id && <Feather name="check-circle" size={16} color={Colors.primary} style={{marginLeft: 'auto'}} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingTop: Spacing.md,
    paddingBottom: 110, // Avoid overlap with bottom nav
  },
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  projectDropdownText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    width: 40,
  },
  dayName: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dayNameActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  dayNumberActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  timelineContainer: {
    paddingHorizontal: Spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  lineColumn: {
    width: 40,
    alignItems: 'center',
  },
  lineTop: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.primaryLight,
  },
  lineTopActive: {
    backgroundColor: Colors.primary,
  },
  lineBottom: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.primaryLight,
  },
  node: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.background,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCompleted: {
    borderColor: Colors.primaryLight,
  },
  nodeActive: {
    borderColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  nodeInnerActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  registryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  registryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  registryTime: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 'auto',
    fontWeight: '600',
  },
  card: {
    flex: 1,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardPending: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardActive: {
    backgroundColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardTime: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  textWhite: {
    color: Colors.paper,
  },
  textWhiteAlpha: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  avatarsRow: {
    flexDirection: 'row',
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* DETAILED ADMIN CARD STYLES */
  detailedCard: {
    flex: 1,
    backgroundColor: Colors.paper,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  detailedHeaderLeft: {
    flex: 1,
  },
  areaBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  areaBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
  },
  detailedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dayBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  statValueBlue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  statValueDark: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statSublabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  valueWithVariance: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  varianceText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  breakdownRow: {
    marginBottom: Spacing.md,
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  breakdownNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  textBold: {
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: Spacing.md,
  },
  metricsMiniRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  progressValueText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  progressSegmentPast: {
    height: '100%',
    backgroundColor: '#F87171', // Red for past
    position: 'absolute',
  },
  progressSegmentToday: {
    height: '100%',
    backgroundColor: '#4B5563', // Grey/Blue for today
    position: 'absolute',
  },
  expectedMarker: {
    width: 2,
    height: '100%',
    backgroundColor: Colors.textPrimary,
    position: 'absolute',
    zIndex: 10,
  },
  progressLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  legendLine: {
    width: 10,
    height: 2,
    backgroundColor: Colors.textPrimary,
    marginRight: 4,
  },
  legendText: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  metricText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  metricItemWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metricTextWarning: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.warning || '#F59E0B',
    marginLeft: 4,
  },
  cardActionBtnPrimary: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  cardActionTextLight: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.paper,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
  },
  bottomNavBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: Colors.paper,
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    ...Shadows.md,
  },
  bottomNavContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 70,
    paddingHorizontal: Spacing.xl,
  },
  navIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabWrapper: {
    transform: [{ translateY: -25 }],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  }
});
