"use client";
import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    mode: 'light', // Switch to 'dark' if you prefer a dark mode
    primary: {
      main: '#d4a017', // Mustard yellow
    },
    secondary: {
      main: '#e4c58a', // Orchid yellow
    },
    background: {
      default: '#faf3e0', // Light beige background
      paper: '#ffffff', // White background for paper components
    },
    text: {
      primary: '#4b4b4b', // Dark grey for primary text
      secondary: '#6e6e6e', // Lighter grey for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#4b4b4b',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#4b4b4b',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#6e6e6e',
    },
    body1: {
      fontSize: '1rem',
      color: '#6e6e6e',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
        containedPrimary: {
          backgroundColor: '#d4a017',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#b38914',
          },
        },
        containedSecondary: {
          backgroundColor: '#e4c58a',
          color: '#4b4b4b',
          '&:hover': {
            backgroundColor: '#cda674',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#d4a017', // Mustard yellow for the AppBar
          color: '#ffffff',
        },
      },
    },
  },
});

export default Theme;