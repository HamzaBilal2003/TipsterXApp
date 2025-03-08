import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface WinRateChartProps {
  winRates: { month: string; win_rate: number }[];
  overallWinRate: string;
}

const WinRateChart: React.FC<WinRateChartProps> = ({ winRates, overallWinRate }) => {
  const chartWidth = Dimensions.get("window").width - 50;

  // Ensure all winRates are valid numbers
  const validWinRates = winRates.map(item => ({
    ...item,
    win_rate: isNaN(item.win_rate) ? 0 : item.win_rate
  }));

  return (
    <View style={styles.card}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Win Rate</Text>
        <Text style={styles.percentage}>{overallWinRate}</Text>
      </View>

      {/* Line Chart */}
      <LineChart
        data={{
          labels: validWinRates.map((item) => item.month),
          datasets: [{ data: validWinRates.map((item) => item.win_rate) }],
        }}
        width={chartWidth}
        height={200}
        chartConfig={{
          backgroundGradientFrom: "#222",
          backgroundGradientTo: "#222",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          fillShadowGradient: "rgba(255, 255, 0, 0.5)",
          fillShadowGradientOpacity: 0.5,
          strokeWidth: 2,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "yellow",
          },
        }}
        withDots={true}
        style={{ marginVertical: 10, borderRadius: 12, transform: [{ translateX: -15 }] }}
      />
    </View>
  );
};

export default WinRateChart;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  percentage: {
    color: "yellow",
    fontSize: 16,
    fontWeight: "bold",
  },
});
