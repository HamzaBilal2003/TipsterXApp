import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    backBtn: {
        backgroundColor: "black",
        width: 40,
        height: 40,
        margin: 10,
        marginTop: 20,
        marginLeft: "5%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        paddingHorizontal: "5%",
        marginBottom: 80
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 80
    },
    h1: {
        fontSize: 22,
        fontWeight: 900
    },
    badge: {
        flexDirection: 'row',
        alignItems:"center",
        gap: 5,
    },
    badgeImage: {
        width: 18,
        height: 18,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: 600
    },
    subcription: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: "white",
        padding: 5,
        borderRadius: 100
    },
    menuItem: {
        marginHorizontal: 20,
        backgroundColor: '#2B2B2B',
        padding: 10,
        paddingVertical:15,
        minHeight: 200,
        transform: [{ translateY: -50 }],
        borderRadius:10,
        gap:10
    },
    item:{
        alignItems:"center",
        backgroundColor:"#3f3f3f",
        flexDirection:"row",
        borderRadius:60,
        gap:10
    },
    ItemIcon:{
        width: 50,
        height: 50,
        borderRadius:50,
        backgroundColor:"yellow",
        alignItems:'center',
        justifyContent:'center',
    },
    itemText:{
        fontSize: 14,
        color:'white'
    },
    footer:{
        marginHorizontal:20,
        gap:20,
    },
    footerbtn:{
        backgroundColor: "#2B2B2B",
        borderRadius: 10,
        padding: 10,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderColor:'#FFFFFF',
        borderWidth:2
    },
    footerbtnText:{
        color: "white",
        fontWeight:900,
        fontSize:14,
    },

})