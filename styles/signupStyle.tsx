import { StyleSheet } from "react-native";

// 🔹 Styles
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
      paddingHorizontal: 20,
      marginTop:50
    },
    title: {
      fontSize: 36,
      fontWeight: "bold",
      color: "#fff",
    },
    subtitle: {
      fontSize: 14,
      color: "#888",
      marginBottom: 20,
    },
    dobContainer: {
      flexDirection: "row",
    },
    dobInput: {
      flex: 1,
      marginHorizontal: 5,
    },
    passwordContainer: {
      position: "relative",
    },
    passwordInput: {
      paddingRight: 40, // Leave space for eye icon
    },
    eyeIcon: {
      position: "absolute",
      right: 15,
      top: 20,
    },
    registerButton: {
      backgroundColor: "#FFD700",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    registerButtonText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#000",
    },
    registerText: {
      marginTop: 20,
      color: "#fff",
      textAlign: "center",
      fontSize: 14,
    },
    registerLink: {
      color: "#FFD700",
      fontWeight: "bold",
    },
  });