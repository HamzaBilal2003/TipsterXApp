import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

interface SpinnerLoaderProps {
  size?: number;
  color?: string;
}

const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({ size = 40, color = "#007AFF" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SpinnerLoader;
