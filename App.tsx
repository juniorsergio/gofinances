import React, { useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import { View } from 'react-native';

import * as SplashScreen from 'expo-splash-screen';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import theme from './src/global/styles/theme'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import { AuthProvider } from './src/hooks/auth';
import { Routes } from './src/routes';

import { LogBox } from "react-native";
LogBox.ignoreLogs([/deprecated/i]);

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View onLayout={onLayoutRootView} />
  }
  
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}