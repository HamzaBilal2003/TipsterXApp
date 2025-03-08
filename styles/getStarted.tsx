import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    logo: {
        width: "50%",
        objectFit: "contain"
    },
    buttoncan: {
        position: "absolute",
        bottom: 20,
        backgroundColor: "black",
        width: "90%",
        marginInline: "auto",
        alignSelf: "center",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: 'center',
        overflow: "hidden"
    },
    buttonCan: {
        width: "100%",
        paddingBlock:10,
        height:60,
        justifyContent: "center",
        alignItems: 'center',
    },
    button: {
        color: "white",
        fontSize: 16,
        textAlign: "center"
    }

})