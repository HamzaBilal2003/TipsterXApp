import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform, Text } from 'react-native';
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import Svg, { Polygon } from 'react-native-svg';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { tabsIcon } from '@/assets/icons/icon';

// 🏠 Floating Hexagon Home Button
const FloatingHomeButton = ({ onPress, focused }: { onPress: () => void, focused: boolean }) => (
  <TouchableOpacity style={styles.hexagonContainer} onPress={onPress} activeOpacity={0.7}>
    <Image source={tabsIcon.tabHome} style={[styles.homeIcon, { width: 25, height: 25}]} />
  </TouchableOpacity>
);

const VipTipButton = ({ focused }: { focused: boolean }) => {
  const navigation = useRouter();

  const handlePress = () => {
    navigation.push('/subscription');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.vipTipButton}>
      <Image source={tabsIcon.viptip} style={{ width: 28, height: 25, tintColor: focused ? 'yellow' : 'gray' }} />
      <Text style={[styles.vipTipText, { color: focused ? "yellow" : 'gray' }]}>Vip Tip</Text>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "yellow",
          headerShown: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarIconStyle: {
            marginBottom: 10,
            marginTop: 10
          },
          tabBarLabelStyle: styles.tabBarLabelStyle // Add this line
        }}>
        {/* VIP Tips */}
        <Tabs.Screen
          name="vipTip"
          options={{
            tabBarButton: ({ accessibilityState }) => <VipTipButton focused={accessibilityState?.selected ?? false} />,
            tabBarIcon: () => null,
          }}
        />
        {/* Free Tips */}
        <Tabs.Screen
          name="freeTip"
          options={{
            tabBarIcon: ({ color }) => (
              <Image source={tabsIcon.freeTip} style={{ width: 28, height: 28, tintColor: color }} />
            ),
          }}
        />

        {/* Home (Floating Hexagon) */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarButton: ({ onPress, accessibilityState }) => (
              <FloatingHomeButton onPress={onPress} focused={accessibilityState?.selected ?? false} />
            ),
            tabBarIcon: () => null,
          }}
        />

        {/* Rankings */}
        <Tabs.Screen
          name="rankings"
          options={{
            tabBarIcon: ({ color }) => (
              <Image source={tabsIcon.tabRank} style={{ width: 28, height: 28, tintColor: color }} />
            ),
          }}
        />

        {/* Menu */}
        <Tabs.Screen
          name="menu"
          options={{
            tabBarIcon: ({ color }) => (
              <AntDesign name="setting" size={28} color={color} />
            ),
            title:"Setting"
          }}
        />

      </Tabs>
      {/* </BottomSheetModalProvider> */}
    </GestureHandlerRootView>
  );
}

// 🔹 **Styles**
const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    height: 80,
    backgroundColor: "#1F1F1F",
    borderTopLeftRadius: 20,
    justifyContent: "center",
    borderTopRightRadius: 20,
  },
  hexagonContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    backgroundColor: "yellow",
    margin: "auto",
    borderRadius: 30,
  },
  homeIcon: {
    tintColor:"black",
    margin:0,
    padding:0
  },
  vipTipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 10
  },
  vipTipText: {
    color: 'white',
    marginTop: 5, // Add margin to position the text below the icon
  },
  tabBarLabelStyle: {
    fontSize: 12,
    marginBottom: 5,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1F1F',
    padding: 10,
  },
  titleText: {
    color: 'yellow',
    fontSize: 16,
  },
});