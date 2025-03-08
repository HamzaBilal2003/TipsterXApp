import { useAuth } from '@/contexts/authContext';
import { API_Images_Domain } from '@/utils/apiConfig';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface LeaderboardRowProps {
  item: {
    points: number;
    profile_picture: string;
    rank: number;
    user_id: number;
    username: string;
    win_rate: string;
    price?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ item, isSelected, onSelect }) => {
  const { userData } = useAuth();

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
      <View style={[styles.row, isSelected && styles.selectedRow]}>
        <Text style={[styles.text, styles.rankColumn]}>{item.rank}</Text>
        <View style={styles.profileColumn}>
          <Image 
            source={{ uri: API_Images_Domain + item.profile_picture }} 
            style={styles.profileImage} 
          />
          <Text style={styles.name} numberOfLines={1}>
            {userData?.id === item.user_id ? "Mine" : item.username.length > 8 ? item.username.slice(0,8) : item.username}
          </Text>
        </View>
        <Text style={[styles.text, styles.column]}>{item.win_rate}</Text>
        <Text style={[styles.text, styles.column]}>{item.points.toFixed(2)}</Text>
        <Text style={[styles.text, styles.column]}>{item.price || "?"}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
  },
  selectedRow: {
    borderColor:"yellow",
    borderWidth: 2,
    borderRadius: 4,
  },
  rankColumn: {
    flex: 0.8,
  },
  profileColumn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  column: {
    flex: 1,
    textAlign: 'center',
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333333',
  },
  name: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default LeaderboardRow;