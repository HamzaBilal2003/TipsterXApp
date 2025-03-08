import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import FolderView from './FolderView';
import TipCardBox from './TipCardBox';
import TipCardBar from './TipCardBar';
import TipCardBtn from './TipCardBtn';
import { API_Images_Domain } from '@/utils/apiConfig';

interface TipCardProps {
  winRate: string;
  profile: {
    image: string;
    name: string;
  };
  tipStatus: string;
  date: string;
  time?: string;
  odds: string;
  wallet: {
    image?: string;
    name: string;
  };
  code: string;
  lastWin: string[];
}

const TipCard: React.FC<TipCardProps> = ({ winRate, profile, tipStatus, date, lastWin, time, odds, wallet, code }) => {
  return (
    <FolderView>
      <View style={styles.container}>
        {/* Win Rate */}
        <View style={styles.winrate}>
          <Text style={styles.heading}>Win Rate:</Text>
          <Text style={styles.subheading}>{winRate}</Text>
        </View>

        {/* Header */}
        <View style={styles.cardHeader}>
          <Image source={{ uri: API_Images_Domain + profile.image }} style={styles.cardHeaderImage} />
          <View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <View style={styles.cardHeaderInfo}>
              <Text style={styles.heading_2}>Last 5:</Text>
              <View style={styles.whiteball}>
                {lastWin.map((item, index) => (
                  item.toLocaleLowerCase() !== 'r' ? <TipCardBox text={item} key={index} /> : null
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Mid Bar */}
        <TipCardBar status={tipStatus} date={date} />

        {/* Odds & Wallet Section */}
        <TipCardBtn odds={odds} wallet={wallet} code={code} />
      </View>
    </FolderView>
  );
};

export default TipCard;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingHorizontal: 12,
    position: 'relative',
  },

  /* Win Rate Section */
  winrate: {
    position: 'absolute',
    top: 5,
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    gap:5
  },
  heading: {
    fontSize: 12, /* Reduced font size */
    opacity: 0.75,
    fontWeight: '500',
  },
  subheading: {
    fontSize: 14, /* Reduced font size */
    fontWeight: 'bold',
  },

  /* Card Header Section */
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 5
  },
  cardHeaderImage: {
    width: 50, /* Reduced size */
    height: 50,
    borderRadius: 25,
    borderColor: "#fff",
    borderWidth: 1.5
  },
  profileName: {
    fontSize: 13, /* Reduced font size */
    fontWeight: '600',
    color: "#fff",
    marginBottom: 4,
  },
  cardHeaderInfo: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 10
  },
  heading_2: {
    fontSize: 11, /* Reduced font size */
    color: 'rgba(255,255,255,0.6)',
  },

  /* Last 5 Wins */
  whiteball: {
    flexDirection: "row",
    gap: 4
  },
});
