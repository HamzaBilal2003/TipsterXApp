import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TipCard from './TipCard';
import { FlatListComponent } from 'react-native';
import { FlatList } from 'react-native';

type TipCardProps = {
    winRate: string;
    profile: {
      image: string;
      name: string;
    };
    tipStatus: string;
    date: string;
    time: string;
    odds: string;
    wallet: {
      image?: string;
      name: string;
    };
    code: string;
  }

type TipCardListProps = {
    tipJson: TipCardProps[];
};

const TipCardList = ({ tipJson }: TipCardListProps) => {

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <FlatList
                data={tipJson}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TipCard
                        winRate={item.winRate}
                        profile={item.profile}
                        tipStatus={item.tipStatus}
                        date={item.date}
                        time={item.time}
                        odds={item.odds}
                        wallet={item.wallet}
                        code={item.code}
                    />
                )}
                contentContainerStyle={{ gap: 20 }}
                removeClippedSubviews={false}
            />
        </ScrollView>
    );
};

export default TipCardList;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});
