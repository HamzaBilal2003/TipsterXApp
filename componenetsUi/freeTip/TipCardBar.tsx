import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Entypo, EvilIcons } from '@expo/vector-icons'

type StatusType = 'won' | 'lost' | 'running';

type props = {
    status: StatusType,
    date: string,
    time?: string
}

const TipCardBar = ({ status, time, date }: props) => {

    const BgcolorPattern = {
        won: '#008000',
        lost: '#FF0000',
        running: 'yellow',
    }
    const ColorPattern = {
        won: 'white',
        lost: 'white',
        running: 'black',
    }

    return (
        <View style={styles.midBarCan}>
            <View style={styles.tipStatusCan}>
                <Text style={styles.tipStatusHeading}>Tip Status : </Text>
                <View style={[styles.statusCan, { backgroundColor: BgcolorPattern[status] }]}>
                    <Text style={[styles.statusText, { color: ColorPattern[status] }]}>{status}</Text>
                </View>
            </View>
            <View style={styles.DateContainer}>
                <View style={styles.DateCan}>
                    <Entypo name='calendar' size={12} color='black' />
                    <Text style={styles.dateHeading}>{date}</Text>
                </View>
                {/* <View style={styles.DateCan}>
                    <EvilIcons name='clock' size={14} color='black' />
                    <Text style={styles.dateHeading}>{time}</Text>
                </View> */}
            </View>
        </View>
    )
}

export default TipCardBar

const styles = StyleSheet.create({
    midBarCan: {
        borderLeftWidth: 5,
        borderLeftColor: "yellow",
        padding: 10,
        borderRadius: 10,
        marginBlock: 20,
        backgroundColor: "#262626",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20
    },
    tipStatusCan: {
        flexDirection: "row",
        borderRadius: 10,
        alignItems: "center",
    },
    tipStatusHeading: {
        fontSize: 12,
        fontWeight: 600,
        color: "#fff",
        opacity: 0.50
    },
    statusCan: {
        backgroundColor: "yellow",
        width: 70,
        padding: 5,
        borderRadius: 100,
        color: "#000",
        alignItems: 'center',
        justifyContent: 'center'
    },
    statusText: {
        fontSize: 12,
        fontWeight: 600,
        color: "#000",
        textTransform: "capitalize"
    },
    DateCan: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        gap: 5
    },
    dateHeading: {
        color: "black",
        fontSize: 10,
    },
    DateContainer: {
        flexDirection: "row",
        gap: 5,
    }
})