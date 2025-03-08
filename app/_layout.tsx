import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '@/contexts/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import AuthRedirect from '@/contexts/AuthRedirect';
import { StyleSheet } from 'react-native';
import Loader from '@/componenetsUi/Loader';
import { View } from 'react-native';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [Loading, setLoading] = useState(false)
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <AuthProvider>
          <QueryClientProvider client={new QueryClient()}>
            <BottomSheetModalProvider>
              <AuthRedirect>
                    <Stack
                      screenOptions={{
                        animation: 'none',
                        headerShown: false,
                        headerStyle: { backgroundColor: 'black' }
                      }}
                    >
                      {/* Onboarding Screens */}
                      <Stack.Screen name="index" />
                      <Stack.Screen name="onboarding_first" options={{ animation: "none" }} />
                      <Stack.Screen name="onboarding_second" options={{ animation: "slide_from_right" }} />
                      <Stack.Screen name="onboarding_third" options={{ animation: "slide_from_right" }} />

                      {/* Authentication */}
                      <Stack.Screen name="login" options={{ animation: "fade_from_bottom" }} />
                      <Stack.Screen name="forgetPassword" options={{ animation: "fade_from_bottom" }} />
                      <Stack.Screen name="forgetPasswordCode" />
                      <Stack.Screen name="resetPassword" />
                      <Stack.Screen name="signup" options={{ animation: "fade_from_bottom" }} />
                      <Stack.Screen name="verifyEmail" options={{ animation: "fade_from_bottom" }} />

                      {/* App Features */}
                      <Stack.Screen name="createPost" options={{ headerShown: true, title: "Create Post", headerTitleAlign: "center" }} />
                      <Stack.Screen name="transitionHistory" options={{ headerShown: true, title: "Transaction History", headerTitleAlign: "center" }} />
                      <Stack.Screen name="notification" options={{ headerShown: true, title: "Notification", headerTitleAlign: "center" }} />
                      <Stack.Screen name="help" options={{ headerShown: true, title: "Help", headerTitleAlign: "center" }} />
                      <Stack.Screen name="subscription" options={{ headerShown: true, title: "Subscription", headerTitleAlign: "center" }} />
                      <Stack.Screen name="edit" options={{ headerShown: true, title: "Edit", headerTitleAlign: "center" }} />
                      <Stack.Screen name="createTipForm" />
                      <Stack.Screen name="createtip" options={{ headerShown: true, title: "Create Tip", headerTitleAlign: "center" }} />
                      <Stack.Screen name="profile" />

                      {/* Tabs & Not Found */}
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                  < StatusBar style="auto" />
              </AuthRedirect>
            </BottomSheetModalProvider>
            <Toast />
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  loader :{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
})