import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
      paddingHorizontal: 20,
      alignItems: "center",
      marginTop:50
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#fff",
      alignSelf: "flex-start",
    },
    subtitle: {
      fontSize: 16,
      color: "#888",
      marginBottom: 30,
      alignSelf: "flex-start",
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 20,
    },
    otpInput: {
      backgroundColor: "#222",
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      flex:1,
      borderRadius: 8,
      marginHorizontal: 5,
    },
    timerText: {
      color: "#fff",
      fontSize: 14,
    },
    timerNumber: {
      color: "#FFD700",
      fontWeight: "bold",
    },
    proceedButton: {
      backgroundColor: "#FFD700",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      width: "100%",
      marginTop: 40,
    },
    proceedButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#000",
    },
  });