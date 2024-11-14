import { MD3LightTheme } from 'react-native-paper';

// Définition du thème personnalisé de l'application
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#f6f6f6',
    surface: '#ffffff',
    // Couleurs spécifiques à l'application
    calm: '#e3f2fd',
    focus: '#bbdefb',
    energy: '#90caf9',
    error: '#B00020',
  },
  // Personnalisation des dimensions
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};