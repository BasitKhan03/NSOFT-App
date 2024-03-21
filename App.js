import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigation from './app/navigation/RootNavigation';
import { AuthProvider } from './app/context/AuthContext';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#343434',
    accent: '#f1c40f',
  },
};

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <PaperProvider theme={theme}>
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </PaperProvider>
    </>
  );
}