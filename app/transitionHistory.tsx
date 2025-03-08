import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";

const TransactionHistory = () => {
  const history = [
    {
      title: "Subscription Payment",
      amount: 2000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 5000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 3000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 2000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 5000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 3000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 2000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 5000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 3000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 2000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 5000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
    {
      title: "Subscription Payment",
      amount: 3000,
      ref: "ajshdh8hd218h99d2ja",
      date: "01/01/2025 - 11:22 AM"
    },
  ]
  return (
    <FlatList
      data={history}
      renderItem={({ item }) => (
        <View style={styles.historyCard}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <FontAwesome6 name="arrow-trend-up" size={20} color={"yellow"} />
          </View>

          {/* Transaction Details */}
          <View style={styles.detailsContainer}>
            {/* Title & Amount */}
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>

            {/* Ref & Date */}
            <View style={styles.row}>
              <View style={styles.refContainer}>
                <Text style={styles.refLabel}>Ref:</Text>
                <Text
                  style={styles.refValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.ref}
                </Text>
              </View>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        </View>
      )}
      keyExtractor={(item,index)=> item.id ? item.id.toString() : index.toString()}
      style={styles.container}
      contentContainerStyle={{gap:20}}
    />

  );
};

export default TransactionHistory;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  historyCard: {
    backgroundColor: "#1C1C1C", // Darker background like the image
    padding: 15,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    width: "100%",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#494916", // Dark yellowish tint
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    gap: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  amount: {
    color: "yellow",
    fontWeight: "bold",
    textAlign: "right",
  },
  refContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "60%", // Prevents overlap with the date
  },
  refLabel: {
    color: "white",
    fontSize: 12,
  },
  refValue: {
    color: "white",
    fontSize: 12,
    width: 150, // Adjust to avoid long text overflow
  },
  date: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
  },
});
