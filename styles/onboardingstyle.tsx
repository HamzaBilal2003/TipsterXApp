import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    ContentContainer: {
        justifyContent: "space-between",
        flex: 1
    },
    upperSlider: {
        gap: 10
    },
    link: {
        color: "yellow",
        alignSelf: "flex-end",
        paddingRight: 10,
        fontSize: 15
    },
    slideBar: {
        width: "95%",
        flexDirection: "row",
        gap: 20,
        alignSelf: "center",
    },
    bar: {
        backgroundColor: "#D8D8D8",
        height: 5,
        flex: 1,
        borderRadius: 10,
    },
    bottomCan: {
        gap: 30,
        padding: 10,
        paddingBlock: 25
    },
    heading: {
        flexDirection: 'column',
    },
    headintext: {
        fontSize: 70,
        fontWeight: '900',
        fontFamily: "impact"
    },
    subHeadingtext: {
        fontWeight: 400,
        fontSize: 70,
    },
    para: {
        fontSize: 20,
        paddingInline: 10
    },
    continuelink: {
        backgroundColor: "black",
        borderRadius: 10,
        padding: 20,
    },
    continuelinkText: {
        color: "white",
        textAlign: 'center',
        fontSize: 16
    }

})