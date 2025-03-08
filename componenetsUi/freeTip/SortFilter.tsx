import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type props ={
    title: string
    subTitle: string
    icon: string
    onPress: () => void,
    bgColor: string
}

const SortFilter = ({title , subTitle,icon,onPress,bgColor} : props) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={[styles.IconCan,{backgroundColor:bgColor}]}>
                <MaterialCommunityIcons name={icon} size={24} color={"black"} />
            </View>
            <View style={styles.HeadingCan}>
                <Text style={styles.Heading}>{title} : </Text>
                <Text style={styles.subHeading}>{subTitle}</Text>
            </View>
        </Pressable>
    )
}

export default SortFilter

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B2B2B',
        padding: 10,
        borderRadius: 100,
        flexDirection: "row"
    },
    IconCan: {
        backgroundColor: "white",
        width: 36,
        height: 36,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    HeadingCan:{
        flexDirection:"row",
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        opacity:0.50
    },
    Heading: {
        fontSize: 16,
        color:"white",
        textTransform:"capitalize"
    },
    subHeading:{
        color:"white",
        fontSize:16,
        textTransform:"capitalize"
    }
})