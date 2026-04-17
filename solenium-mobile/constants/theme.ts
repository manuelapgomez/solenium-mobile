/**
 * Solenium Mobile - Minimalist Digital Theme
 * Referencia: Moodboard Minimalista, Leyes de Gestalt (Contraste, Cierre, Proximidad).
 */

const SoleniumColors = {
  // Fondos y Superficies
  background: '#F9FAFB',
  paper: '#FFFFFF',
  
  // Marca y Acción Principal
  primary: '#0E85BD',
  primaryLight: '#E7F2F7',
  
  // Textos y Grises para Jerarquía Tipográfica
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  text: '#111827',
  
  // Estados Operativos
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  
  // Elementos UI
  border: '#E5E7EB',
  divider: '#F3F4F6',
  tint: '#4285F4',
  icon: '#6B7280',
  tabIconDefault: '#9CA3AF',
  tabIconSelected: '#4285F4',
};

export const Colors = {
  light: SoleniumColors,
  dark: SoleniumColors, // For proto we keep it consistent
  ...SoleniumColors, // Export flat for direct access
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
    shadowColor: '#0E85BD',
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
  xl: 32, // Para ID Cards y modales inmersivos
  full: 9999, // Para avatares, status dots, FAB
};
