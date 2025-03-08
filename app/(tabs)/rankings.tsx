import { View, Text, StyleSheet, Pressable, Alert, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import CustomDropdown from '@/componenetsUi/global/CustomDropdown'
import RankCard from '@/componenetsUi/ranks/RankCard'
import PortionSelector from '@/componenetsUi/Home/portionSelector'
import LeaderBoard from '@/componenetsUi/ranks/LeaderBoard'
import LeaderboardTable from '@/componenetsUi/ranks/LeaderboardTable'
import FAQs from '@/componenetsUi/subscription/Faqs'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Fetchfaqs, FetchUserRank, getRank } from '@/utils/queries/Rank'
import { useAuth } from '@/contexts/authContext'
import FaqsCan from '@/componenetsUi/ranks/FaqsCan'

const Rankings = () => {
  const route = useRouter();
  const { token } = useAuth()
  const [selected, setSelected] = useState('this_week');
  const [selectedPortion, setSelectedPortion] = useState("rankings");

  const rankList = [
    {
      "amount": "N 1000",
      "rank": 1
    },
    {
      "amount": "N 800",
      "rank": 2
    },
    {
      "amount": "N 600",
      "rank": 3
    },
    {
      "amount": "N 400",
      "rank": 4
    },
    {
      "amount": "N 200",
      "rank": 5
    },
    {
      "amount": "N 500",
      "rank": 6
    },
    {
      "amount": "N 400",
      "rank": 7
    },
    {
      "amount": "N 500",
      "rank": 8
    },
    {
      "amount": "N 600",
      "rank": 9
    },
    {
      "amount": "N 200",
      "rank": 10
    }
  ];
  const { data: RanksData, isLoading: loadingStatus, error: geterror } = useQuery({
    queryKey: ['rank'],
    queryFn: () => getRank(token),
  });

  const { data: UserRank, isLoading: UserloadingStatus, error: getUsererror } = useQuery({
    queryKey: ['Userrank'],
    queryFn: () => FetchUserRank(token),
  });
  console.log("RanksData:", RanksData?.data);
  // console.log("UsersDAta:", UserRank?.data);
  const leaderboardData = RanksData?.data;
  const UserleaderboardData = UserRank?.data;
  console.log("user data",UserRank?.data)


  const handleSelection = (value: string) => {
    setSelectedPortion(value);
  };


  return (
    <SafeAreaView>
      <ScrollView>
        <LinearGradient
          colors={['#CFFF0B', '#F9A604']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.navigation}>
              <Pressable style={styles.backBtn} onPress={() => route.back()}>
                <AntDesign name='left' size={28} color={"white"} />
              </Pressable>
              <Text style={styles.heading}>Rankings</Text>
            </View>
            <Text style={styles.subtitle}>Contest will end and winners will announced on Sunday</Text>

          </View>
          <View style={styles.rankContainer}>
            <FlatList
              data={rankList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <RankCard amount={item.amount} rank={item.rank} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 20 }}
            // scrollEnabled={false}
            // removeClippedSubviews={false}
            />
          </View>
        </LinearGradient>

        <View style={styles.gap}>
          <View style={styles.portions}>
            <PortionSelector
              options={[
                { name: "Rankings", value: "rankings" },
                { name: "My Rank", value: "my_rank" },
                { name: "FAQs", value: "faqs" },
              ]}
              onSelect={handleSelection}
              defaultValue={selectedPortion}
            />
          </View>

          {selectedPortion == "rankings" ? (
            <>
              <View style={styles.leaderBoard}>
                {leaderboardData?.slice(0, 3).map((item, index) => (
                  <LeaderBoard key={index} {...item} />
                ))}
              </View>
              <View>
                <LeaderboardTable data={leaderboardData?.slice(3)} />
              </View>
            </>
          ) : selectedPortion == "my_rank" ? (
            <View>
              {UserleaderboardData && <LeaderboardTable data={[UserleaderboardData]} />}
            </View>
          ) : <FaqsCan />}

        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default Rankings

const styles = StyleSheet.create({
  text: {
    color: 'white'
  },
  header: {
    minHeight: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingVertical: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  backBtn: {
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    fontSize: 25,
    flex: 1,
    fontWeight: 'bold',
    textAlign: "center"
  },
  subtitle: {
    marginVertical: 10
  },
  rankContainer: {
    marginBlock: 20
  },
  portions: {
    marginBlock: 20
  },
  gap: {
    paddingHorizontal: 20,
  },
  leaderBoard: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBlock: 20
  }
})