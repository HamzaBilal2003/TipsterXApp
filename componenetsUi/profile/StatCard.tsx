import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatCardProps {
  title: string;
  subtitle: string;
  value: number | string;
  icons?: string[]; // Optional for W/L icons
}

const StatCard: React.FC<StatCardProps> = ({ title, subtitle, value, icons }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* If icons exist, render them instead of numeric value */}
      {icons ? (
        <View style={styles.iconsContainer}>
          {icons.map((icon, index) => (
            <View
              key={index}
              style={[
                styles.iconBox,
                { borderColor: icon.toLowerCase() === "l" ? "red" : icon.toLowerCase() == "r" ? "yellow" : "green" },
              ]}
            >
              <Text style={[styles.iconText, { color: icon.toLowerCase() === "l" ? "red" : icon.toLowerCase() == "r" ? "yellow" : "green" }]}>{icon}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
};

export default StatCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    margin: 10,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#A9A9A9",
    fontSize: 14,
    marginTop: 4,
  },
  value: {
    color: "yellow",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
  },
  iconsContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  iconBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    borderWidth: 2
  },
  iconText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
    textTransform:"uppercase"
  },
});
