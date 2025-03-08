import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "@/styles/onboardingstyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import Sliderbar from "@/componenetsUi/onboard/Sliderbar";

type OnboardingProps = {
  backgroundImage: any; // ✅ Accepts require() images
  children: React.ReactNode;
};

const Onboarding = ({ backgroundImage, children }: OnboardingProps) => {
  const routeName = useRoute().name;

  return (
    <ImageBackground
      source={backgroundImage} // ✅ No { uri: ... }
      resizeMode="cover"
      style={styles.container}
    >
      <LinearGradient
        colors={["#0003", "yellow"]}
        locations={[0, 0.99]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientOverlay}
      />
      <SafeAreaView style={styles.ContentContainer}>
        <Sliderbar activebar={routeName} />
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Onboarding;
