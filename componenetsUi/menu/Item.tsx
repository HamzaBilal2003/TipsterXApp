import { View, Text,Image } from 'react-native'
import React from 'react'
import { styles } from '@/styles/menustyle'
import { AntDesign, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { Link } from 'expo-router'


type Props = {
    title: string
    icon: string
    iconBg: string
    navigatingLink: string
    iconType?: string,
    type?: string
}

const iconComponents = {
    AntDesign,
    FontAwesome,
    FontAwesome5,
    MaterialIcons
};

const Item = ({ title, icon, iconBg, navigatingLink, iconType }: Props) => {

    return (
        <Link href={navigatingLink as any} style={styles.item}>
            <View style={styles.item}>
                <View style={[styles.ItemIcon, { backgroundColor: iconBg }]}>
                    <Image  source={icon}  style={{width:20,height:20,objectFit:'contain'}}/>
                </View>
                <Text style={styles.itemText}>{title}</Text>
            </View>
        </Link>
    )
}

export default Item