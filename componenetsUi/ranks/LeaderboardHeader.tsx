import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LeaderboardHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={[styles.headerText, styles.rankColumn]}>Rank</Text>
      <Text style={[styles.headerText, styles.profileColumn]}>Profile</Text>
      <Text style={[styles.headerText, styles.column]}>Win rate</Text>
      <Text style={[styles.headerText, styles.column]}>Point</Text>
      <Text style={[styles.headerText, styles.column]}>Price</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  rankColumn: {
    flex: 0.8,
  },
  profileColumn: {
    flex: 2,
  },
  column: {
    flex: 1,
    textAlign: 'center',
  },
});

export default LeaderboardHeader;