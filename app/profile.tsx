import { Image, Pressable, ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PortionSelector from '@/componenetsUi/Home/portionSelector';
import DropdownSelect from '@/componenetsUi/profile/DropdownSelect';
import StatCard from '@/componenetsUi/profile/StatCard';
import WinRateChart from '@/componenetsUi/profile/WinRateChart';
import TipCard from '@/componenetsUi/freeTip/TipCard';
import { useRoute } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile } from '@/utils/queries/Profile';
import { useAuth } from '@/contexts/authContext';
import { API_Images_Domain } from '@/utils/apiConfig';
import EditBioModal from '@/componenetsUi/edit/EditBioModal';
import Loader from '@/componenetsUi/Loader';

const Profile = () => {

    const router = useRouter();
    const [selectedPortion, setSelectedPortion] = useState("running");
    const [selectedRange, setSelectedRange] = useState<any>("30");
    const route = useRoute();
    const { token, userData } = useAuth();
    const { context, userId } = route.params as { context: string; userId: number; };
    const queryClient = useQueryClient();
    const [isBioModalVisible, setBioModalVisible] = useState(false);

    // Toggle modal
    const openBioModal = () => setBioModalVisible(true);
    const closeBioModal = () => setBioModalVisible(false);



    // State to manage follow/unfollow UI
    // // console.log("user profile id", userId);
    const { data: profileData, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile(userId, token),
    });
    // console.log("profile data : ", profileData?.data)

    const UserProfile = profileData?.data;
    const [isFollowing, setIsFollowing] = useState(UserProfile?.isFollowing);
    useEffect(() => {
        setIsFollowing(profileData?.data?.isFollowing);
    }, [profileData])
    const { mutate: handleFollow, isPending: following } = useMutation({
        mutationKey: ["follow", UserProfile?.user.id],
        mutationFn: async () => {
            const response = await fetch(`https://tipster.hmstech.org/api/follow/${UserProfile?.user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // If token is required
                },
            });

            if (!response.ok) {
                throw new Error("Failed to follow user");
            }

            const data = await response.json();
            return data;
        },
        onSuccess: (data) => {
            // console.log("Follow API Response:", data);
            if (data.data.is_following === true) {
                setIsFollowing(true);
                Alert.alert("Success", "User followed successfully");

            } else {
                setIsFollowing(false);
                Alert.alert("Success", "User unfollowed successfully");
            }
            // setIsFollowing((prev) => !prev); // Toggle follow state
        },
        onError: (error) => {
            console.error("Error following user:", error);
        },
    });
    const portion = [
        { name: "Pending", value: "running" },
        { name: "Won", value: "won" },
        { name: "Lost", value: "lost" },
    ];

    const statsData = [
        { title: "Total Wins", subtitle: "Last 30 days", value: UserProfile?.total_wins },
        { title: "Last 5 Wins", subtitle: "Last 30 days", value: "", icons: UserProfile?.last_five },
        { title: "Average Odds", subtitle: "Last 30 days", value: UserProfile?.average_odds },
        { title: "Total Predictions", subtitle: "Last 30 days", value: UserProfile?.total_predictions },
    ];
    const [filteredTips, setFilteredTips] = useState(UserProfile?.tips);

    const filterTips = (tips: any[], status: string, range: string) => {
        if (!Array.isArray(tips)) {
            console.warn("Invalid tips data, expected an array");
        }

        const now = new Date(); // Current date

        const filteredTips = tips.filter((tip) => {
            const createdAtStr = tip.created_at; // Get created_at
            const createdAt = createdAtStr ? new Date(createdAtStr) : null; // Convert string to Date

            // Check if the tip is within the selected range
            const withinRange = createdAt
                ? (Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24)) <= parseInt(range))
                : true; // If no created_at, include the tip

            return tip.result === status && withinRange;
        });

        // console.log("Filtered Tips:", filteredTips);
        setFilteredTips(filteredTips);
    };

    // ✅ Handle Portion Selection (Won, Running, Lost)
    const handleSelection = (value: string) => {
        setSelectedPortion(value);
        // console.log("Selected value:", value);
        if (value === "running" || value === "won" || value === "lost") {
            filterTips(UserProfile?.tips, value, selectedRange);
        } else {
            setFilteredTips(UserProfile?.tips);
        }
    };

    // ✅ Handle Day Selection (Dropdown)
    const handleDaySelection = (value: string) => {
        setSelectedRange(value);
        // console.log("Selected range:", value);
        if (selectedPortion === "running" || selectedPortion === "won" || selectedPortion === "lost") {
            filterTips(UserProfile?.tips, selectedPortion, value);
        }
    };



    // const filteredTips = filterTips(UserProfile?.tips || [], selectedPortion, selectedRange);
    console.log("profile images ",API_Images_Domain + UserProfile?.user.profile_picture.replace('https://tipster.hmstech.org/storage/', ''))
    if (isLoading) return <Loader color='yellow' />
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <LinearGradient
                    colors={['#CFFF0B', '#1CE5C3']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ height: 120, position: "sticky", top: 0 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: "center", position: 'relative' }}>
                        <Pressable style={styles.backBtn} onPress={() => router.back()}>
                            <AntDesign name='left' size={30} color={"white"} />
                        </Pressable>
                        <Text style={styles.headerHead}>Profile</Text>
                    </View>
                    <Image source={{ uri: API_Images_Domain + UserProfile?.user.profile_picture.replace('https://tipster.hmstech.org/storage/', '') }} style={styles.profileImage} />
                </LinearGradient>
                <View style={{ paddingHorizontal: 20, gap: 20 }}>
                    <View style={styles.profileInfo}>
                        <View style={styles.usernameCan}>
                            <Text style={styles.username}>{UserProfile?.user.username}</Text>
                            <Image source={require("@/assets/images/diamond.png")} style={styles.perimumBadge} />
                        </View>
                        <View style={styles.statsCan}>
                            <View style={styles.stat}>
                                <Text style={styles.statText}>{UserProfile?.subscriber || 0}</Text>
                                <Text style={styles.statText}>Subscribers</Text>
                            </View>
                            <View style={{ width: 5, height: 5, backgroundColor: "white", borderRadius: 5 }} />
                            <View style={styles.stat}>
                                <Text style={styles.statText}>{UserProfile?.follower_count || 0}</Text>
                                <Text style={styles.statText}>Followers</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.bioCan}>
                        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between" }}>
                            <Text style={styles.headingBio}>Bio</Text>
                            <Pressable onPress={openBioModal}>
                                <Text style={[styles.headingBio, { fontSize: 15, color: "yellow" }]}>Edit</Text>
                            </Pressable>
                        </View>
                        {!isLoading && profileData?.data.user.bio && profileData?.data.user.bio != '' && <Text style={[styles.headingBio, styles.bio]}>
                            {userData?.bio}
                        </Text>}
                    </View>

                    {!isLoading && userData?.id != UserProfile?.user.id &&
                        <>
                            <Pressable
                                style={[styles.FollowBtn]}
                                onPress={() => handleFollow()}
                                disabled={following}
                            >
                                {following ? (
                                    <ActivityIndicator size="small" color="black" />
                                ) : (
                                    <>
                                        <Feather name={isFollowing ? "user-x" : "user-check"} size={28} color={"black"} />
                                        <Text style={styles.followBtnText}>
                                            {isFollowing ? "Unfollow" : `Follow ${UserProfile?.user.username}`}
                                        </Text>
                                    </>
                                )}
                            </Pressable>

                            <Pressable style={[styles.FollowBtn, { backgroundColor: "white" }]}>
                                <MaterialIcons name="notifications-on" size={28} color={"black"} />
                                <Text style={[styles.followBtnText, { color: "black" }]}>Subscribe to user notification</Text>
                            </Pressable>
                        </>
                    }

                    <View style={{ marginTop: 50 }}>
                        <PortionSelector
                            options={portion}
                            onSelect={handleSelection}
                            defaultValue={selectedPortion}
                        />
                    </View>

                    <DropdownSelect
                        title="Last 30 days"
                        options={[
                            { label: "Last 7 days", value: "7" },
                            { label: "Last 30 days", value: "30" },
                            { label: "Last 60 days", value: "60" },
                            { label: "Last 90 days", value: "90" },
                        ]}
                        onSelect={(value) => setSelectedRange(value)}
                    />

                    <View>
                        {!isLoading && <WinRateChart winRates={UserProfile?.graphicalData} overallWinRate={UserProfile?.win_rate} />}
                    </View>

                    <View>
                        <FlatList
                            data={statsData}
                            keyExtractor={(item) => item.title}
                            numColumns={2}
                            renderItem={({ item }) => (
                                <StatCard title={item.title} subtitle={item.subtitle} value={item.value} icons={item.icons} />
                            )}
                            scrollEnabled={false}
                            removeClippedSubviews={true}
                        />
                    </View>

                    <Text style={styles.historyHeading}>Bet History</Text>

                    {!isLoading && <FlatList
                        data={filteredTips}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TipCard
                                lastWin={item.user.last_five}
                                winRate={"70%"}
                                profile={{
                                    name: item.user.username,
                                    image: item.user.profile_picture,
                                }}
                                tipStatus={item.result}
                                date={item.match_date}
                                odds={item.ods}
                                wallet={{
                                    name: item.betting_company.title,
                                    image: API_Images_Domain + item.betting_company.logo
                                }}
                                code={item.codes}
                            />
                        )}
                        scrollEnabled={false}
                        removeClippedSubviews={true}
                        contentContainerStyle={{ gap: 20 }}
                        ListFooterComponent={<View style={{ marginBottom: 100 }} />}
                    />}
                </View>
                {!isLoading && <EditBioModal
                    visible={isBioModalVisible}
                    onClose={closeBioModal}
                    userId={UserProfile?.user.id}
                    currentBio={UserProfile?.user.bio || ""}
                />}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    headerHead: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
        color: "black",
        fontSize: 25,
        fontWeight: 700,
    },
    backBtn: {
        backgroundColor: "black",
        width: 40,
        height: 40,
        margin: 10,
        marginLeft: "5%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "white",
        marginBottom: 30,
        alignSelf: "center",
    },
    profileInfo: {
        alignItems: "center",
        marginBlock: 20,
        marginTop: 60
    },
    usernameCan: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    username: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
    perimumBadge: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    statsCan: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    stat: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    statText: {
        color: "white",
    },
    bioCan: {
        backgroundColor: "#2B2B2B",
        padding: 20,
        borderRadius: 10,
        marginBlock: 20,
        marginTop: 40,
        color: "white"
    },
    headingBio: {
        fontSize: 20,
        color: "white"
    },
    bio: {
        fontSize: 16,
        textAlign: "justify",
        marginTop: 10
    },
    FollowBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: "yellow",
        padding: 10,
        borderRadius: 10,
    },
    followBtnText: {
        color: "black",
        fontSize: 16,
    },
    historyHeading: {
        fontSize: 20,
        color: "white",
        marginBottom: 20,
        marginTop: 40,
    },
});