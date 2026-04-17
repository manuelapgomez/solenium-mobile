import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Shadows, Spacing, Radii } from '../constants/theme';
import { useRouter, useLocalSearchParams, Redirect } from 'expo-router';
import { SessionManager } from '../constants/session';

const { width } = Dimensions.get('window');

// Role System Mock Data
const MOCK_USERS: any = {
  admin: { id: 'admin', name: 'Admin Solenium', role: 'admin', assignedArea: 'all', avatar: 'AS' },
  civil: { id: 'civil', name: 'Juan Cimentaciones', role: 'worker', assignedArea: 'Civil', avatar: 'JC' },
  electric: { id: 'electric', name: 'Carlos Voltajes', role: 'worker', assignedArea: 'Eléctrica', avatar: 'CV' },
  logistics: { id: 'logistics', name: 'Ana Entregas', role: 'worker', assignedArea: 'Logística', avatar: 'AE' },
};

const INCIDENT_TYPES = [
    { id: 'lluvia', label: 'Lluvia', icon: 'cloud-rain', color: '#3B82F6' },
    { id: 'clima', label: 'Condiciones Climáticas', icon: 'wind', color: '#6366F1' },
    { id: 'suministros', label: 'Falta de Suministros', icon: 'package', color: '#F59E0B' },
    { id: 'tecnica', label: 'Interferencia Técnica', icon: 'tool', color: '#10B981' },
    { id: 'otros', label: 'Otros', icon: 'more-horizontal', color: '#6B7280' },
];

// Available Projects Set
const MOCK_PROJECTS = [
  { id: 'p1', name: 'Parque Solar Fase 1' },
  { id: 'p2', name: 'Minigranja Norte' },
  { id: 'p3', name: 'Minigranja Sur' },
];

const DAYS = [
  { day: 'Mon', date: '4', status: 'completed' },
  { day: 'Tue', date: '5', status: 'completed' },
  { day: 'Wed', date: '6', status: 'missing' },     // Rojo: Falta registro crítico
  { day: 'Thu', date: '7', status: 'incomplete' },  // Naranja: Faltan horas
  { day: 'Fri', date: '8', status: 'active' },      // Hoy
  { day: 'Sat', date: '9', status: 'upcoming', active: true },
  { day: 'Sun', date: '10', status: 'upcoming' },
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
    subtitle: 'Olvidaste registrar salida ayer.',
    status: 'missing',
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

// Mock evidence data grouped by day, keyed by task id
const MOCK_EVIDENCE_HISTORY: any = {
  2: [
    {
      day: 'Hoy',
      date: 'Abril 17',
      items: [
        { id: 'e1', type: 'photo', time: '2:31 PM', author: 'Juan C.' },
        { id: 'e2', type: 'photo', time: '1:15 PM', author: 'Juan C.' },
        { id: 'e3', type: 'audio', time: '12:03 PM', author: 'Juan C.', duration: '0:48' },
        { id: 'e4', type: 'photo', time: '9:22 AM', author: 'Juan C.' },
      ],
    },
    {
      day: 'Ayer',
      date: 'Abril 16',
      items: [
        { id: 'e5', type: 'photo', time: '5:45 PM', author: 'Admin' },
        { id: 'e6', type: 'photo', time: '3:10 PM', author: 'Juan C.' },
        { id: 'e7', type: 'audio', time: '11:30 AM', author: 'Juan C.', duration: '1:22' },
      ],
    },
    {
      day: 'Abril 15',
      date: 'Abril 15',
      items: [
        { id: 'e8', type: 'photo', time: '4:00 PM', author: 'Juan C.' },
        { id: 'e9', type: 'photo', time: '2:20 PM', author: 'Juan C.' },
        { id: 'e10', type: 'photo', time: '10:00 AM', author: 'Admin' },
      ],
    },
  ],
  3: [
    {
      day: 'Hoy',
      date: 'Abril 17',
      items: [
        { id: 'e11', type: 'photo', time: '3:00 PM', author: 'Carlos V.' },
        { id: 'e12', type: 'audio', time: '1:45 PM', author: 'Carlos V.', duration: '0:33' },
        { id: 'e13', type: 'photo', time: '11:00 AM', author: 'Carlos V.' },
      ],
    },
    {
      day: 'Ayer',
      date: 'Abril 16',
      items: [
        { id: 'e14', type: 'photo', time: '6:00 PM', author: 'Carlos V.' },
        { id: 'e15', type: 'photo', time: '2:30 PM', author: 'Admin' },
      ],
    },
  ],
};

export default function Home() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // 1. Sync Manager if we have params
  if (userId && !SessionManager.getUserId()) {
    SessionManager.setUserId(userId as string);
  }

  // 2. Determine Authentication State
  const authenticatedId = userId || SessionManager.getUserId();
  const isInitialized = SessionManager.isInitialized();

  // 3. ONLY redirect to login if we have NO user and the app is NOT in an active session
  if (!authenticatedId && !isInitialized) {
    return <Redirect href={"/login" as any} />;
  }

  // 4. Default user '1' as fallback for prototype stability if we lost everything but are past the door
  const activeUserId = authenticatedId || '1';

  const [currentUser, setCurrentUser] = useState(MOCK_USERS[activeUserId as string] || MOCK_USERS.admin);
  const [activeProject, setActiveProject] = useState(MOCK_PROJECTS[0]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [pendingRegistry, setPendingRegistry] = useState<any>(null);

  // Mock states for UX alerts
  const [hasSyncPending, setHasSyncPending] = useState(true);

  // States for Modals
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showFilesHistoryModal, setShowFilesHistoryModal] = useState(false);
  const [selectedEventItem, setSelectedEventItem] = useState<any>(null);
  
  // Incident specific state
  const [selectedIncidentType, setSelectedIncidentType] = useState<string | null>(null);
  const [customIncidentName, setCustomIncidentName] = useState('');
  const [tempIncidents, setTempIncidents] = useState<any[]>(INCIDENT_TYPES);

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
      <View style={[styles.detailedCard, isActive && Shadows.md]}>
        {/* TOP: Clickable Header/Progress Area opens Details Modal */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => {
              setSelectedEventItem(event);
              setShowDetailsModal(true);
          }}
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

            {/* MULTI-SEGMENT PROGRESS BAR */}
            <View style={styles.progressSection}>
              <View style={styles.progressInfo}>
                  <Text style={styles.progressLabel}>Progreso</Text>
                  <Text style={styles.progressValueText}>{Math.round(actualPercent)}% de 100%</Text>
              </View>
              <View style={styles.progressBarBg}>
                  <View style={[styles.progressSegmentPast, { width: `${yesterdayPercent}%` }]} />
                  <View style={[styles.progressSegmentToday, { width: `${todayPercent}%`, left: `${yesterdayPercent}%` }]} />
                  <View style={[styles.expectedMarker, { left: `${plannedPercent}%` }]} />
              </View>
              
              {/* LEGENDS */}
              <View style={styles.progressLegend}>
                  <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#FF8A8A' }]} />
                      <Text style={styles.legendText}>Días anteriores</Text>
                  </View>
                  <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#8E9AAF' }]} />
                      <Text style={styles.legendText}>Hoy</Text>
                  </View>
                  <View style={styles.legendItem}>
                      <View style={styles.legendLine} />
                      <Text style={styles.legendText}>Esperado ({Math.round(plannedPercent)}%)</Text>
                  </View>
              </View>
            </View>
        </TouchableOpacity>

        {/* BOTTOM: Instagram-Style Action Row */}
        <View style={styles.actionRow}>
            <View style={styles.actionIconsLeft}>
                <TouchableOpacity 
                    style={styles.actionIconBtn}
                    onPress={() => router.push({ pathname: '/evidence', params: { title: event.title, targetQuantity: event.targetQuantity, unit: event.unit } })}
                >
                    <Feather name="camera" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.actionIconBtn}
                    onPress={() => {
                        setSelectedEventItem(event);
                        setShowCommentsModal(true);
                    }}
                >
                    <Feather name="message-circle" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Incident action — right side, styled as a clear actionable pill */}
            <TouchableOpacity
                style={styles.incidentPill}
                activeOpacity={0.75}
                onPress={() => {
                    setSelectedEventItem(event);
                    setShowIncidentModal(true);
                }}
            >
                <Feather name="alert-triangle" size={14} color={Colors.warning} />
                <Text style={styles.incidentPillText}>Novedad</Text>
            </TouchableOpacity>
        </View>

        {/* Summary row — each part independently tappable */}
        <View style={styles.summaryRow}>
            <TouchableOpacity
              onPress={() => {
                setSelectedEventItem(event);
                setShowFilesHistoryModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.likesText, styles.likesHighlight]}>{event.filesCount} Archivos</Text>
            </TouchableOpacity>
            <Text style={styles.likesSeparator}> • </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedEventItem(event);
                setShowCommentsModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.likesText}>3 Comentarios</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{flex: 1, marginRight: Spacing.md}}>
                <TouchableOpacity onPress={() => setShowProjectModal(true)} style={styles.projectDropdownBtn}>
                    <View style={styles.projectIconBadge}>
                        <Feather name="map" size={16} color={Colors.primary} />
                    </View>
                    <Text style={styles.projectDropdownText} numberOfLines={1}>{activeProject.name}</Text>
                    <Feather name="chevron-down" size={18} color={Colors.textPrimary} style={{marginLeft: 'auto'}} />
                </TouchableOpacity>
            </View>
            <View style={styles.headerActions}>
            </View>
          </View>
          
          <View style={styles.titleRow}>
             <Text style={styles.titleText}>Hola, {currentUser.name.split(' ')[0]}</Text>
             <TouchableOpacity onPress={toggleUser} style={styles.rolePill}>
                 <Text style={styles.rolePillText}>
                     {currentUser.role === 'admin' ? 'ADMIN' : currentUser.assignedArea.toUpperCase()}
                 </Text>
             </TouchableOpacity>
          </View>
          
          <View style={styles.daysRow}>
            {DAYS.map((d, i) => {
              let bgStyle = null;
              let textStyle = null;
              
              if (d.status === 'completed') {
                bgStyle = { backgroundColor: Colors.successLight };
                textStyle = { color: Colors.success };
              } else if (d.status === 'missing') {
                bgStyle = { backgroundColor: Colors.errorLight };
                textStyle = { color: Colors.error };
              } else if (d.status === 'incomplete') {
                bgStyle = { backgroundColor: Colors.warningLight };
                textStyle = { color: Colors.warning };
              }

              return (
              <View key={i} style={styles.dayCol}>
                <Text style={[styles.dayName, d.active && styles.dayNameActive, textStyle]}>{d.day}</Text>
                <View style={[styles.dayCircle, bgStyle, d.active && { backgroundColor: Colors.primary }]}>
                    <Text style={[styles.dayNumber, d.active && styles.dayNumberActive, textStyle, d.active && {color: Colors.paper}]}>{d.date}</Text>
                </View>
                <View style={styles.statusIndicator}>
                  {d.status === 'missing' && <View style={[styles.miniDot, { backgroundColor: Colors.error }]} />}
                  {d.status === 'incomplete' && <View style={[styles.miniDot, { backgroundColor: Colors.warning }]} />}
                  {d.active && <View style={styles.activeDot} />}
                </View>
              </View>
            )})}
          </View>


        </View>

        {/* Action Alerts Section */}
        <View style={styles.alertsContainer}>
            {hasSyncPending ? (
                <View style={[styles.alertCardWarning, { paddingRight: Spacing.sm }]}>
                    <View style={styles.alertIconWarning}>
                        <Feather name="cloud-off" size={20} color={Colors.warning} />
                    </View>
                    <View style={styles.alertTextContent}>
                        <Text style={styles.alertTitleWarning}>Sincronización Pendiente</Text>
                        <Text style={styles.alertDescWarning}>3 registros locales sin subir</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.syncActionButton}
                        onPress={() => setHasSyncPending(false)}
                    >
                        <Feather name="refresh-cw" size={14} color={Colors.paper} style={{ marginRight: 6 }} />
                        <Text style={styles.syncActionText}>Sincronizar</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
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
                    isCompleted && styles.nodeCompleted,
                    event.status === 'missing' && { borderColor: Colors.error }
                  ]}>
                    {isActive && <View style={styles.nodeInnerActive} />}
                    {isCompleted && <Feather name="check" size={10} color={Colors.primary} />}
                    {event.status === 'missing' && <Feather name="alert-triangle" size={10} color={Colors.error} />}
                  </View>
                  {index !== filteredEvents.length - 1 && <View style={styles.lineBottom} />}
                </View>

                {/* Card or Registry Pill */}
                {event.type === 'registry' ? (
                  event.status === 'missing' ? (
                    // ══ COMPACT MISSING PILL ══
                    <TouchableOpacity
                      style={styles.missingRegistryCard}
                      onPress={() => router.push('/camera')}
                      activeOpacity={0.8}
                    >
                      {/* Icon */}
                      <View style={styles.missingIconCircle}>
                        <Feather
                          name={event.title.includes('Out') ? 'moon' : 'sunrise'}
                          size={14}
                          color={Colors.error}
                        />
                      </View>

                      {/* Text */}
                      <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                        <Text style={styles.missingTitle}>
                          {event.title.includes('Out') ? '¡Falta Check-Out!' : '¡Falta Check-In!'}
                        </Text>
                        <Text style={styles.missingSubtitle}>{event.subtitle}</Text>
                      </View>

                      {/* Micro CTA */}
                      <View style={styles.missingCTAChip}>
                        <Text style={styles.missingCTAChipText}>Registrar</Text>
                        <Feather name="chevron-right" size={12} color={Colors.error} />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    // ══ NORMAL REGISTRY PILL ══
                    <TouchableOpacity
                      style={styles.registryCard}
                      onPress={() => router.push({
                        pathname: '/registry_detail',
                        params: { title: event.title, time: event.time, projectName: activeProject.name }
                      })}
                    >
                      <Feather name={event.title.includes('Out') ? 'moon' : 'sunrise'} size={16} color={Colors.textSecondary} />
                      <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
                        <Text style={styles.registryTitle}>{event.title}</Text>
                      </View>
                      <Text style={styles.registryTime}>{event.time}</Text>
                    </TouchableOpacity>
                  )
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
      <View style={[styles.bottomNavContainer, { bottom: Math.max(insets.bottom, 20) }]}>
      <View style={styles.floatingNavBackground} />
      <View style={styles.bottomNavContent}>
        <TouchableOpacity style={styles.navIcon} onPress={() => router.push('/notifications' as any)}>
          <Feather name="bell" size={24} color={Colors.textSecondary} />
          {hasSyncPending && <View style={styles.bellDotNav} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.fabWrapper} onPress={() => router.push('/camera')}>
          <View style={styles.fab}>
            <Feather name="sun" size={32} color={Colors.paper} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navIcon} onPress={() => router.push('/profile')}>
          <Feather name="user" size={24} color={Colors.textSecondary} />
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
                  if (pendingRegistry) {
                    router.push({ 
                      pathname: '/registry_detail', 
                      params: { title: pendingRegistry.title, time: pendingRegistry.time, projectName: proj.name } 
                    });
                    setPendingRegistry(null);
                  }
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

      {/* Slide-Up Modal: Activity Breakdown (The "Redundant" Info) */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <TouchableOpacity style={styles.slideModalOverlay} activeOpacity={1} onPress={() => setShowDetailsModal(false)}>
            <TouchableWithoutFeedback>
                <View style={[styles.slideModalContent, { minHeight: 400 }]}>
                    <View style={styles.dragHandle} />
                    {selectedEventItem && (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
                            <Text style={styles.slideModalTitle}>Desglose Matemático</Text>
                            <Text style={styles.slideModalSubtitle}>{selectedEventItem.title}</Text>

                            <View style={[styles.statsRow, { marginTop: Spacing.xl }]}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Avance programado</Text>
                                    <Text style={styles.statValueBlue}>{selectedEventItem.plannedProgress}</Text>
                                    <Text style={styles.statSublabel}>{selectedEventItem.unit}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Avance real acumulado</Text>
                                    <View style={styles.valueWithVariance}>
                                        <Text style={styles.statValueDark}>{selectedEventItem.actualProgress}</Text>
                                        <Text style={[styles.varianceText, { color: (selectedEventItem.actualProgress - selectedEventItem.plannedProgress) >= 0 ? Colors.success : Colors.error }]}>
                                            {(selectedEventItem.actualProgress - selectedEventItem.plannedProgress) >= 0 ? '+' : ''}{(selectedEventItem.actualProgress - selectedEventItem.plannedProgress)}
                                        </Text>
                                    </View>
                                    <Text style={styles.statSublabel}>{selectedEventItem.unit}</Text>
                                </View>
                            </View>

                            <View style={[styles.breakdownRow, { marginTop: Spacing.xl }]}>
                                <Text style={styles.breakdownTitle}>Desglose del día:</Text>
                                <View style={styles.breakdownNumbers}>
                                    <Text style={styles.breakdownText}>Ayer tenía: <Text style={styles.textBold}>{selectedEventItem.yesterdayProgress} {selectedEventItem.unit}</Text></Text>
                                    <Text style={styles.breakdownText}>Hoy avanzó: <Text style={styles.textBold}>+{selectedEventItem.todayProgress} {selectedEventItem.unit}</Text></Text>
                                </View>
                            </View>

                            {/* ══ HISTORIAL DE EVIDENCIAS ══ */}
                            <View style={styles.evidenceSectionDivider} />
                            <View style={styles.evidenceSectionHeader}>
                                <Feather name="folder" size={16} color={Colors.primary} />
                                <Text style={styles.evidenceSectionTitle}>Historial de Evidencias</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    setShowDetailsModal(false);
                                    setShowFilesHistoryModal(true);
                                  }}
                                  style={styles.seeAllBtn}
                                >
                                  <Text style={styles.seeAllText}>Ver todo</Text>
                                </TouchableOpacity>
                            </View>

                            {(MOCK_EVIDENCE_HISTORY[selectedEventItem.id] || []).map((group: any) => (
                              <View key={group.day} style={styles.evidenceDayGroup}>
                                <View style={styles.evidenceDayHeader}>
                                  <Text style={styles.evidenceDayLabel}>{group.day}</Text>
                                  <Text style={styles.evidenceDayDate}>{group.date}</Text>
                                </View>

                                {/* Photo grid (3 columns) */}
                                <View style={styles.evidencePhotoGrid}>
                                  {group.items.filter((i: any) => i.type === 'photo').map((item: any) => (
                                    <TouchableOpacity key={item.id} style={styles.evidencePhotoCell} activeOpacity={0.8}>
                                      <View style={styles.evidencePhotoPlaceholder}>
                                        <Feather name="image" size={20} color={Colors.textMuted} />
                                      </View>
                                      <Text style={styles.evidencePhotoTime}>{item.time}</Text>
                                    </TouchableOpacity>
                                  ))}
                                </View>

                                {/* Audio rows */}
                                {group.items.filter((i: any) => i.type === 'audio').map((item: any) => (
                                  <TouchableOpacity key={item.id} style={styles.evidenceAudioRow} activeOpacity={0.8}>
                                    <View style={styles.evidenceAudioIcon}>
                                      <Feather name="mic" size={16} color={Colors.primary} />
                                    </View>
                                    <View style={styles.evidenceAudioWave}>
                                      {[4,8,12,6,10,14,5,9,7,11,4,8].map((h, idx) => (
                                        <View key={idx} style={[styles.evidenceAudioBar, { height: h }]} />
                                      ))}
                                    </View>
                                    <Text style={styles.evidenceAudioDuration}>{item.duration}</Text>
                                    <Text style={styles.evidenceAudioAuthor}>{item.author} · {item.time}</Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            ))}

                            {!(MOCK_EVIDENCE_HISTORY[selectedEventItem.id]) && (
                              <View style={styles.evidenceEmptyState}>
                                <Feather name="inbox" size={32} color={Colors.textMuted} />
                                <Text style={styles.evidenceEmptyText}>Aún no hay evidencias subidas.</Text>
                              </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* Slide-Up Modal: Comments (Instagram Style) */}
      <Modal
        visible={showCommentsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCommentsModal(false)}
      >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <TouchableOpacity style={styles.slideModalOverlay} activeOpacity={1} onPress={() => { Keyboard.dismiss(); setShowCommentsModal(false); }}>
                <TouchableWithoutFeedback>
                    <View style={styles.commentsModalContent}>
                        <View style={styles.dragHandle} />
                        <Text style={styles.slideModalTitleCenter}>Comentarios</Text>
                        
                        <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
                            {/* Mock Comments */}
                            <View style={styles.commentRow}>
                                <View style={styles.commentAvatar}><Text style={styles.commentAvatarText}>A</Text></View>
                                <View style={styles.commentBody}>
                                    <Text style={styles.commentAuthor}>admin_solenium</Text>
                                    <Text style={styles.commentText}>¿Cómo va el montaje en el Sector Sur?</Text>
                                    <Text style={styles.commentTime}>2h</Text>
                                </View>
                                <Feather name="heart" size={14} color={Colors.textMuted} style={styles.commentLike} />
                            </View>
                            
                            <View style={styles.commentRow}>
                                <View style={[styles.commentAvatar, {backgroundColor: '#14B8A6'}]}><Text style={styles.commentAvatarText}>C</Text></View>
                                <View style={styles.commentBody}>
                                    <Text style={styles.commentAuthor}>civil_super</Text>
                                    <Text style={styles.commentText}>Hubo un retraso con la lluvia de la mañana, pero ya retomamos con las cuadrillas 1 y 2.</Text>
                                    <Text style={styles.commentTime}>1h</Text>
                                </View>
                                <Feather name="heart" size={14} color={Colors.textMuted} style={styles.commentLike} />
                            </View>
                        </ScrollView>

                        {/* Input Area */}
                        <View style={styles.commentInputContainer}>
                            <View style={[styles.commentAvatar, {width: 32, height: 32, backgroundColor: Colors.primaryLight}]}><Text style={[styles.commentAvatarText, {color: Colors.primary}]}>Y</Text></View>
                            <TextInput 
                                style={styles.commentInput} 
                                placeholder="Agrega un comentario..." 
                                placeholderTextColor={Colors.textMuted}
                                multiline
                             />
                             <TouchableOpacity style={styles.commentSendBtn}>
                                 <Text style={styles.commentSendText}>Publicar</Text>
                             </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* Slide-Up Modal: Incident Report (Social Style) */}
      <Modal
        visible={showIncidentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowIncidentModal(false)}
      >
        <TouchableOpacity style={styles.slideModalOverlay} activeOpacity={1} onPress={() => setShowIncidentModal(false)}>
            <TouchableWithoutFeedback>
                <View style={[styles.slideModalContent, { minHeight: 550 }]}>
                    <View style={styles.dragHandle} />
                    
                    <View style={styles.incidentHeader}>
                        <TouchableOpacity style={styles.modalBackBtn} onPress={() => setShowIncidentModal(false)}>
                            <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.incidentTitle}>Nueva Novedad</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
                        
                        {/* Hierarchy 1: Categories Grid */}
                        <Text style={styles.incidentSectionTitle}>¿Qué sucedió?</Text>
                        <View style={styles.incidentGrid}>
                            {tempIncidents.map((type) => {
                                const isActive = selectedIncidentType === type.id;
                                return (
                                    <TouchableOpacity 
                                        key={type.id} 
                                        activeOpacity={0.7}
                                        style={[
                                            styles.incidentTypeBtn, 
                                            isActive && { 
                                                backgroundColor: type.color + '10', 
                                                borderColor: type.color,
                                                transform: [{ scale: 1.02 }],
                                                ...Shadows.md
                                            }
                                        ]}
                                        onPress={() => setSelectedIncidentType(type.id)}
                                    >
                                        <View style={[styles.incidentIconCircle, { backgroundColor: type.color + '15' }, isActive && { backgroundColor: type.color }]}>
                                            <Feather name={type.icon as any} size={22} color={isActive ? Colors.paper : type.color} />
                                        </View>
                                        <Text style={[styles.incidentTypeLabel, isActive && { color: type.color, fontWeight: '800' }]}>
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Hierarchy 2: Dynamic "Otros" Input */}
                        {selectedIncidentType === 'otros' && (
                            <View style={styles.customIncidentContainer}>
                                <Text style={styles.incidentSectionTitle}>Nombre de la Novedad</Text>
                                <View style={styles.tagSearchContainer}>
                                    <Feather name="edit-3" size={16} color={Colors.textMuted} />
                                    <TextInput 
                                        style={styles.tagSearchInput}
                                        placeholder="Ej: Retraso por tráfico, Falla Eléctrica..."
                                        placeholderTextColor={Colors.textMuted}
                                        value={customIncidentName}
                                        onChangeText={setCustomIncidentName}
                                    />
                                </View>
                                <TouchableOpacity 
                                    style={styles.saveCategoryBtn}
                                    onPress={() => {
                                        if (customIncidentName.trim()) {
                                            const newCat = { 
                                                id: `custom_${Date.now()}`, 
                                                label: customIncidentName, 
                                                icon: 'info', 
                                                color: Colors.primary 
                                            };
                                            setTempIncidents([...tempIncidents, newCat]);
                                            setSelectedIncidentType(newCat.id);
                                            setCustomIncidentName('');
                                        }
                                    }}
                                >
                                    <View style={styles.saveCategoryCircle}>
                                        <Feather name="plus" size={14} color={Colors.paper} />
                                    </View>
                                    <Text style={styles.saveCategoryText}>Guardar como botón rápido</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Hierarchy 3: Detailed Comment */}
                        <Text style={styles.incidentSectionTitle}>Comentario Adicional (Opcional)</Text>
                        <View style={styles.incidentInputBox}>
                            <TextInput 
                                style={styles.incidentTextInput}
                                placeholder="Describe brevemente lo ocurrido..."
                                placeholderTextColor={Colors.textMuted}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity 
                            style={[
                                styles.incidentSubmitBtn, 
                                !selectedIncidentType && { backgroundColor: Colors.divider, opacity: 0.6 }
                            ]}
                            disabled={!selectedIncidentType}
                            onPress={() => {
                                setShowIncidentModal(false);
                                setSelectedIncidentType('');
                            }}
                        >
                            <Text style={styles.incidentSubmitText}>Reportar Novedad</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* ══ FILES HISTORY BOTTOM SHEET ══ */}
      <Modal
        visible={showFilesHistoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilesHistoryModal(false)}
      >
        <TouchableOpacity style={styles.slideModalOverlay} activeOpacity={1} onPress={() => setShowFilesHistoryModal(false)}>
          <TouchableWithoutFeedback>
            <View style={[styles.slideModalContent, { minHeight: '80%' as any }]}>
              <View style={styles.dragHandle} />
              <View style={styles.filesHistoryHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setShowFilesHistoryModal(false);
                    setShowDetailsModal(true);
                  }}
                  style={styles.modalBackBtn}
                >
                  <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                  <Text style={styles.slideModalTitle}>{selectedEventItem?.title}</Text>
                  <Text style={styles.slideModalSubtitle}>Evidencias por Día</Text>
                </View>
                <TouchableOpacity onPress={() => setShowFilesHistoryModal(false)} style={styles.modalCloseBtn}>
                  <Feather name="x" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {(MOCK_EVIDENCE_HISTORY[selectedEventItem?.id] || []).map((group: any) => (
                  <View key={group.day} style={styles.evidenceDayGroup}>
                    <View style={styles.evidenceDayHeader}>
                      <Text style={styles.evidenceDayLabel}>{group.day}</Text>
                      <Text style={styles.evidenceDayDate}>{group.date} · {group.items.length} archivos</Text>
                    </View>

                    {/* Photo grid */}
                    <View style={styles.evidencePhotoGrid}>
                      {group.items.filter((i: any) => i.type === 'photo').map((item: any) => (
                        <TouchableOpacity key={item.id} style={styles.evidencePhotoCell} activeOpacity={0.8}>
                          <View style={styles.evidencePhotoPlaceholder}>
                            <Feather name="image" size={22} color={Colors.textMuted} />
                          </View>
                          <Text style={styles.evidencePhotoTime}>{item.time}</Text>
                          <Text style={styles.evidencePhotoAuthor}>{item.author}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Audio rows */}
                    {group.items.filter((i: any) => i.type === 'audio').map((item: any) => (
                      <TouchableOpacity key={item.id} style={styles.evidenceAudioRow} activeOpacity={0.8}>
                        <View style={styles.evidenceAudioIcon}>
                          <Feather name="mic" size={16} color={Colors.primary} />
                        </View>
                        <View style={styles.evidenceAudioWave}>
                          {[4,8,12,6,10,14,5,9,7,11,4,8,6,10].map((h, idx) => (
                            <View key={idx} style={[styles.evidenceAudioBar, { height: h }]} />
                          ))}
                        </View>
                        <Text style={styles.evidenceAudioDuration}>{item.duration}</Text>
                        <Text style={styles.evidenceAudioAuthor}>{item.author} · {item.time}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}

                {!(MOCK_EVIDENCE_HISTORY[selectedEventItem?.id]) && (
                  <View style={[styles.evidenceEmptyState, { marginTop: 40 }]}>
                    <Feather name="inbox" size={40} color={Colors.textMuted} />
                    <Text style={styles.evidenceEmptyText}>Aún no hay evidencias para esta tarea.</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
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
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 8,
    backgroundColor: Colors.paper,
    padding: Spacing.sm,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  projectIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  projectDropdownText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  rolePill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
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
  statusIndicator: {
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dayCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
  },
  alertsContainer: {
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.sm,
  },
  alertCardCritical: {
      flexDirection: 'row',
      backgroundColor: Colors.errorLight,
      borderRadius: Radii.md,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      marginBottom: Spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  alertIconCritical: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.sm,
  },
  alertTextContent: {
      flex: 1,
  },
  alertTitleCritical: {
      fontSize: 14,
      fontWeight: '800',
      color: Colors.error,
      marginBottom: 2,
  },
  alertDescCritical: {
      fontSize: 12,
      color: Colors.error,
      lineHeight: 16,
      opacity: 0.9,
  },
  alertCardWarning: {
      flexDirection: 'row',
      backgroundColor: Colors.warningLight,
      borderRadius: Radii.md,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      marginBottom: Spacing.md,
      alignItems: 'center',
  },
  alertIconWarning: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.sm,
  },
  alertTitleWarning: {
      fontSize: 14,
      fontWeight: '800',
      color: '#B45309', // Darker warning color for text
      marginBottom: 2,
  },
    alertDescWarning: {
      fontSize: 12,
      color: '#B45309',
      lineHeight: 16,
  },
  syncActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.warning,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: Radii.sm,
      ...Shadows.sm,
  },
  syncActionText: {
      fontSize: 12,
      fontWeight: '800',
      color: Colors.paper,
  },
  sleekProgressContainer: {
      marginTop: Spacing.md,
      paddingHorizontal: Spacing.sm,
  },
  sleekProgressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
  },
  sleekProgressLabel: {
      fontSize: 10,
      textTransform: 'uppercase',
      fontWeight: '800',
      color: Colors.textSecondary,
      letterSpacing: 0.5,
  },
  sleekProgressValue: {
      fontSize: 11,
      fontWeight: '800',
      color: Colors.primary,
  },
  sleekProgressBarBg: {
      height: 4,
      backgroundColor: Colors.divider,
      borderRadius: 2,
  },
  sleekProgressBarFill: {
      height: 4,
      backgroundColor: Colors.primary,
      borderRadius: 2,
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
  registryCardMissing: {
    backgroundColor: Colors.errorLight,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  // ══ COMPACT MISSING PILL ══
  missingRegistryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.paper,
    borderRadius: Radii.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    gap: 0,
  },
  missingIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  missingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.error,
    lineHeight: 17,
  },
  missingSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    lineHeight: 14,
  },
  missingCTAChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    gap: 2,
    flexShrink: 0,
  },
  missingCTAChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.error,
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
    backgroundColor: '#FF8A8A', // Coral/Soft-Red from screenshot
    position: 'absolute',
  },
  progressSegmentToday: {
    height: '100%',
    backgroundColor: '#8E9AAF', // Slate-Blue from screenshot
    position: 'absolute',
  },
  expectedMarker: {
    width: 2.5,
    height: '100%',
    backgroundColor: '#4A5567', // Dark charcoal marker
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
    left: Spacing.xl,
    right: Spacing.xl,
    bottom: Spacing.lg,
    height: 72,
    zIndex: 100,
  },
  floatingNavBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    ...Shadows.lg,
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
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  bellDotNav: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  bellDot: {
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },

  // Project Switcher Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.paper,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    width: '100%',
    ...Shadows.lg,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  projectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.md,
    marginBottom: Spacing.xs,
  },
  projectOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  projectOptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  projectOptionTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  
  // Instagram Style Action Row Styles
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionIconsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBtn: {
    padding: 6,
    marginRight: Spacing.sm,
  },
  likesText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 4,
  },
  likesHighlight: {
    color: Colors.primary,
    fontWeight: '700',
  },
  likesSeparator: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: Spacing.xs,
    marginTop: 2,
  },
  // Incident Pill — clear actionable button in the action row
  incidentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.full,
    gap: 5,
  },
  incidentPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.warning,
  },

  // Slide-Up Modals (Bottom Sheets) Styles
  slideModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  slideModalContent: {
    backgroundColor: Colors.paper,
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  commentsModalContent: {
    backgroundColor: Colors.paper,
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    height: '75%', // Mimic IG comments drawer height
    paddingTop: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  emergencyIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  customIncidentContainer: {
    marginBottom: Spacing.md,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.divider,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
    marginTop: 8,
  },
  slideModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  slideModalTitleCenter: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  slideModalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  
  // Comments Drawer Specific Styles
  commentsList: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  commentAvatarText: {
    color: Colors.paper,
    fontWeight: '800',
  },
  commentBody: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  commentLike: {
    padding: 4,
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.paper,
  },
  commentInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: Spacing.sm,
    fontSize: 13,
  },
  commentSendBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  commentSendText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  
  // Incident Modal Specific Styles
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: 8,
  },
  modalBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incidentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  incidentSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  incidentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  incidentTypeBtn: {
    width: (width - 64) / 2, // 2 columns with spacing
    backgroundColor: Colors.paper,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  incidentIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  incidentTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  tagSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    height: 40,
    marginBottom: Spacing.md,
  },
  tagSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  tagList: {
    paddingVertical: 4,
    marginBottom: Spacing.md,
  },
  tagUserItem: {
    alignItems: 'center',
    marginRight: Spacing.lg,
    width: 60,
  },
  tagAvatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tagAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  tagUserName: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tagCheck: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    backgroundColor: Colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.paper,
  },
  incidentInputBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: Radii.md,
    padding: Spacing.md,
    minHeight: 80,
    marginBottom: Spacing.xl,
  },
  incidentTextInput: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  incidentSubmitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  incidentSubmitText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.paper,
  },
  saveCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  saveCategoryCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
  },
  saveCategoryText: {
      fontSize: 12,
      fontWeight: '700',
      color: Colors.primary,
  },

  // ——— EVIDENCE HISTORY ———
  evidenceSectionDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.xl,
  },
  evidenceSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: 8,
  },
  evidenceSectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginLeft: 4,
  },
  seeAllBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radii.full,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  evidenceDayGroup: {
    marginBottom: Spacing.xl,
  },
  evidenceDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  evidenceDayLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  evidenceDayDate: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  evidencePhotoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  evidencePhotoCell: {
    width: '30%',
    alignItems: 'center',
  },
  evidencePhotoPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.background,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 4,
  },
  evidencePhotoTime: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  evidencePhotoAuthor: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  evidenceAudioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  evidenceAudioIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceAudioWave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  evidenceAudioBar: {
    width: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    opacity: 0.7,
  },
  evidenceAudioDuration: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  evidenceAudioAuthor: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  evidenceEmptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: Spacing.xl,
  },
  evidenceEmptyText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // ——— FILES HISTORY MODAL ———
  filesHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
  },
});
