/**
 * Solenium Mobile - Minimalist Digital Theme
 * Referencia: Moodboard Minimalista, Leyes de Gestalt (Contraste, Cierre, Proximidad).
 */

export const Colors = {
  // Fondos y Superficies
  background: '#F9FAFB', // Un off-white muy limpio y moderno
  paper: '#FFFFFF', // Blanco puro para las tarjetas (Cards, Modales)
  
  // Marca y Acción Principal
  primary: '#4285F4', // Azul brillante y energético (basado en el referente del timeline)
  primaryLight: '#E8F0FE', // Fondo suave para estados primarios inactivos
  
  // Textos y Grises para Jerarquía Tipográfica
  textPrimary: '#111827', // Casi negro, excelente contraste para títulos
  textSecondary: '#6B7280', // Gris neutro para descripciones (Gestalt: Figura-fondo secundario)
  textMuted: '#9CA3AF',
  
  // Estados Operativos (Alto contraste exigido por el Skill de Solar Ops)
  success: '#10B981', // Verde OK: check-in, tareas completadas
  successLight: '#D1FAE5',
  warning: '#F59E0B', // Naranja Warning: Novedades parciales
  warningLight: '#FEF3C7',
  error: '#EF4444', // Rojo Error: Entregas tardías o rechazos
  errorLight: '#FEE2E2',
  
  // Elementos UI
  border: '#E5E7EB',
  divider: '#F3F4F6',
};

// Sombras sutiles basadas en referentes para darle el efecto de capa/cierre (Gestalt)sin abrumar
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: { // Usado típicamente para el FAB (Floating Action Button)
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radii = {
  sm: 8,
  md: 16, // Para tarjetas secundarias
  lg: 24, // Para tarjetas principales (Check-in, Timeline active card)
  full: 9999, // Para avatares, status dots, FAB
};
