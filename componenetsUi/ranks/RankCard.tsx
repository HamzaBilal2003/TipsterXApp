import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

interface RankCardProps {
  amount: string;
  rank: number;
}

const RankCard: React.FC<RankCardProps> = ({ amount, rank }) => {
  let rankImage;
  if (rank === 1) {
    rankImage = require('@/assets/images/first.png');
  } else if (rank === 2) {
    rankImage = require('@/assets/images/second.png');
  } else if (rank === 3) {
    rankImage = require('@/assets/images/third.png');
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {rankImage ? (
          <Image source={rankImage} alt="rankImage" style={styles.rankLogo} />
        ) : (
          <Text style={styles.rankText}>{rank}th</Text>
        )}
      </View>
      <Text style={styles.amountText}>{amount}</Text>
    </View>
  );
};

export default RankCard;

const styles = StyleSheet.create({
  container: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  logoContainer: {
    backgroundColor: '#2B2B2B',
    height: 70,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#F9A604',
  },
  rankText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  amountText: {
    marginTop: 8,
    color: 'white',
    fontSize: 16,
  },
});