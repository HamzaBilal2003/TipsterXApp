import { StyleSheet } from "react-native";

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
    inputContainer: {
        position: "relative",
        marginBottom: 15,
    },
    label: {
        color: "white",
        position: "absolute",
        left: 15,
        top: 15,
        zIndex: 2,
        fontSize: 16,
        // transition: "top 0.3s ease, font-size 0.3s ease",
    },
    hoverLabel: {
        top: -8, // Move label up when focused
        fontSize: 12,
        color: "#FFD700", // Yellow label on hover
        backgroundColor:"black",
        paddingInline:5
    },
    input: {
        backgroundColor: "#222",
        color: "#fff",
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
    },
    hoverInput: {
        borderColor: "#FFD700", // Yellow border when focused
        borderWidth: 1,
        backgroundColor: "black",
    },
    error: {
        color: "#FF4444",
        fontSize: 12,
        marginTop: 5,
    },
    forgotPassword: {
        alignSelf: "flex-end",
        color: "#FFD700",
        fontSize: 14,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: "#FFD700",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    loginButtonText: {
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