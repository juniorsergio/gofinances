import React, { useCallback } from 'react';
import { ThemeProvider } from 'styled-components';

import * as SplashScreen from 'expo-splash-screen';
import { Register } from './src/screens/Register/Register';

import theme from './src/global/styles/theme'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/routes/app.routes';


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
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </ThemeProvider>
  );
}