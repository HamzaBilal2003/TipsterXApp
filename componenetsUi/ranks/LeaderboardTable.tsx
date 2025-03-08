import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import LeaderboardHeader from './LeaderboardHeader';
import LeaderboardRow from './LeaderboardRow';
import { useAuth } from '@/contexts/authContext';

interface LeaderboardItem {
  points: number;
  profile_picture: string;
  rank: number;
  user_id: number;
  username: string;
  win_rate: string;
  price?: string;
}

interface LeaderboardTableProps {
  data: LeaderboardItem[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const { userData } = useAuth();

  return (
    <View style={styles.container}>
      <LeaderboardHeader />
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <LeaderboardRow
            item={item}
            isSelected={selectedRow === item.rank || userData?.id === item.user_id}
            onSelect={() => setSelectedRow(item.rank)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        removeClippedSubviews={false}
        ListFooterComponent={<View style={styles.footer} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#000000',
  },
  listContainer: {
    gap: 2,
  },
  footer: {
    marginBottom: 100,
  },
});

export default LeaderboardTable;