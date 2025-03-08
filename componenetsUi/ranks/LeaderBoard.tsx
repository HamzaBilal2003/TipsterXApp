import { API_Images_Domain } from '@/utils/apiConfig';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface LeaderboardItemProps {
    points: number;
    profile_picture: string;
    rank: number;
    user_id: number;
    username: string;
    win_rate: string;
    // percentage?: number;
    // color?: string;
    // height?: number;
}

const LeaderBoard: React.FC<LeaderboardItemProps> = ({
    points,
    profile_picture,
    rank,
    user_id,
    username,
    win_rate,
}) => {
    const styling: { [key: number]: { color: string; height: number } } = {
        1: { color: '#CFFF0B33', height: 200 },
        2: { color: '#00800033', height: 180 },
        3: { color: '#0000FF33', height: 160 },
    }
    return (
        <View style={[styles.card, { backgroundColor: styling[rank].color, height: styling[rank].height }]}>
            <Image source={{ uri: API_Images_Domain + profile_picture }} style={styles.profileImage} />
            <View style={styles.info}>
                <Text style={styles.name}>{username}</Text>
                <Text style={styles.score}>{points?.toLocaleString()}</Text>
                <Text style={styles.percentage}>{win_rate} %</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 10,
        flex: 1
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'orange',
        position: 'absolute',
        top: -25,
    },
    name: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 35,
    },
    score: {
        color: 'gold',
        fontSize: 16,
        fontWeight: 'bold',
    },
    percentage: {
        color: 'white',
        fontSize: 12,
    },
    info: {
        flex: 1,
        alignItems: 'center',
        gap: 5
    }
});

export default LeaderBoard;
