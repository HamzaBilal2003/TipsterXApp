import { View, Text, Alert, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PortionSelector from '@/componenetsUi/Home/portionSelector'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { fetchNotifications } from '@/utils/queries/Notification'
import { useAuth } from '@/contexts/authContext'
import { FlatList } from 'react-native'

const Notification = () => {
    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
    
        // Extract date components
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
    
        // Extract time components
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const amPm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert 24-hour format to 12-hour format
        hours = hours % 12 || 12; // Convert 0 to 12 for AM/PM format
    
        return `${month}/${day}/${year} - ${hours}:${minutes} ${amPm}`;
    };
    const [selectedPortion, setSelectedPortion] = useState("all");
    const { token, userData } = useAuth()
    const handleSelection = (value: string) => {
        setSelectedPortion(value);
    };
    // // console.log(userData)
    const { data: notifications, isLoading, error } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => fetchNotifications(token)
    })
    if (error) {
        Alert.alert('Error', error.message);
        return null;
    }
    // // console.log(notifications?.data);
    const notificationData = notifications?.data;
    return (
        <SafeAreaView>
            <View style={styles.container}>
                {/* <PortionSelector
                    options={[
                        { name: "All", value: "all" },
                        { name: "Social", value: "social" },
                        { name: "Others", value: "others" },
                    ]}
                    onSelect={handleSelection}
                    defaultValue={selectedPortion}
                /> */}
                <FlatList
                    data={notificationData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.notificationCard}>
                            {/* Icon */}
                            <View style={styles.iconContainer}>
                                <Ionicons name="notifications-sharp" size={20} color={"yellow"} />
                            </View>

                            {/* Notification Details */}
                            <View style={styles.detailsContainer}>
                                {/* Title & Date */}
                                <View style={styles.row}>
                                    <Text style={styles.title}>{item.triggered_by_username}</Text>
                                    <Text style={styles.date}>{formatDate(item.created_at)}</Text>
                                </View>

                                {/* Likes Info
                                <Text style={styles.likes}>
                                    <Text style={styles.highlight}>Adam + 5 others</Text> liked your post
                                </Text> */}

                                {/* Post Excerpt */}
                                <Text style={styles.postExcerpt}>
                                   {item.message}
                                </Text>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={{ gap: 30 }}
                />

            </View>
        </SafeAreaView>
    )
}

export default Notification


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
    notificationCard: {
        backgroundColor: "#2B2B2B",
        padding: 15,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 15,
        width: "100%",
        // marginBlock: 20
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: "#494916",
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
        alignItems: "center",
    },
    title: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    date: {
        color: "yellow",
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "right",
    },
    likes: {
        color: "white",
        fontSize: 14,
    },
    highlight: {
        color: "yellow",
        fontWeight: "bold",
    },
    postExcerpt: {
        color: "white",
        fontSize: 14,
        marginTop: 5,
    },
})