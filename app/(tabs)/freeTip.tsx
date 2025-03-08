import { Alert, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/componenetsUi/Header';
import DateCircle from '@/componenetsUi/freeTip/DateCircle';
import SortFilter from '@/componenetsUi/freeTip/SortFilter';
import { FlatList, Pressable, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import TipCard from '@/componenetsUi/freeTip/TipCard';
import { Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from '@/contexts/authContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetTips } from '@/utils/queries/Tip';
import moment from 'moment';
import SortingModal from '@/componenetsUi/freeTip/SortingModal';
import FilterModal from '@/componenetsUi/freeTip/FilterModal';
import Loader from '@/componenetsUi/Loader';
import { API_Images_Domain } from '@/utils/apiConfig';
import Calendar from '@/componenetsUi/freeTip/CalendarModal';
import Item from '@/componenetsUi/menu/Item';
import { isDate } from 'date-fns';

const ScreenWidth = Dimensions.get("window").width;

type tipJson = {
  id: number;
  user_id: number;
  betting_company_id: number;
  codes: string;
  ods: string;
  status: string;
  result: string;
  match_date: string;
  betting_category: string;
  created_at: string;
  updated_at: string;
  betting_company: {
    created_at: string;
    id: number;
    logo: string;
    status: string;
    title: string;
    updated_at: string;
  };
  user: {
    id: number;
    username: string;
    profile_picture: string;
    win_rate: string;
    last_five: string[];
  };
};

const FreeTip = () => {
  const [currentWeek, setCurrentWeek] = useState<{ day: string; date: string; fullDate: string }[]>([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [DateFromModel, setDateFromModel] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | undefined>('');
  const { token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const today = new Date();
    const firstDayOfWeek = today.getDate() - today.getDay() + 1;
    const week = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(today.setDate(firstDayOfWeek + i));
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullDate = moment(date).format("YYYY-MM-DD");
      week.push({ day, date: formattedDate, fullDate });
    }

    setCurrentWeek(week);
    setSelectedDate(week.find((day) => day.fullDate === moment().format("YYYY-MM-DD"))?.fullDate || moment().format("YYYY-MM-DD"));
  }, []);

  const { data: tipsData, isLoading, error } = useQuery({
    queryKey: ['tips'],
    queryFn: () => GetTips(token),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['tips'] });
    setRefreshing(false);
  };

  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<any>({});

  const handleApplyFilters = (filters: any) => {
    setSelectedFilters(filters);
  };

  const tipJson = tipsData?.data as tipJson[];

  const filteredTips = tipJson
    ?.filter((tip) => {
      const tipDate = moment(tip.created_at).format('YYYY-MM-DD');
      const isDateMatch = tipDate == selectedDate;

      const isCompanyMatch =
        selectedFilters.bettingCompanies?.length > 0
          ? selectedFilters.bettingCompanies.includes(tip.betting_company_id)
          : true;

      const isCategoryMatch =
        selectedFilters.categories?.length > 0
          ? selectedFilters.categories.includes(tip.betting_category.toLowerCase())
          : true;

      let isOddsMatch = true;
      if (selectedFilters.odds) {
        isOddsMatch = tip.ods >= (selectedFilters.odds?.min || 0) &&
          tip.ods <= (selectedFilters.odds?.max || 8000);
      }

      const userWinRate = parseInt(tip.user.win_rate.replace("%", ""), 10);
      const isWinRateMatch =
        selectedFilters.winRate
          ? typeof selectedFilters.winRate === "number"
            ? userWinRate >= selectedFilters.winRate
            : userWinRate >= (selectedFilters.winRate.min || 0) &&
            userWinRate <= (selectedFilters.winRate.max || 100)
          : true;

      return isDateMatch && isCompanyMatch && isCategoryMatch && isOddsMatch && isWinRateMatch;
    })
    ?.sort((a, b) => {
      return sortOrder === "latest"
        ? moment(b.created_at).valueOf() - moment(a.created_at).valueOf()
        : moment(a.created_at).valueOf() - moment(b.created_at).valueOf();
    }) || [];

  const handleDateSelect = (date: string) => {
    const formattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setIsCalendarVisible(false);
    setDateFromModel(true);
  };

  const formatDisplayDate = (dateString: string) => {
    return moment(dateString).format("YYYY-MM-DD");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007AFF"]} />}>
        <View style={styles.header}>
          <View style={{ paddingHorizontal: 20 }}>
            <Header profileImage={"https://randomuser.me/api/portraits/men/1.jpg"} rNumber={10} />
          </View>
          <View style={styles.calandarCan}>
            <Pressable onPress={() => setIsCalendarVisible(true)} style={[styles.dateCircle, { backgroundColor: 'white' }]}>
             {DateFromModel ? <Text>{selectedDate?.substring(8)}</Text>  : <Image source={require('@/assets/images/Calendar.png')} style={styles.calandarIcon} />}
            </Pressable>
            {currentWeek.map((item, index) => (
              <DateCircle
                key={index}
                day={item.day}
                date={item.date}
                isSelected={item.fullDate === selectedDate}
                setSelected={() => {setSelectedDate(item.fullDate) ; setDateFromModel(false)}}
              />
            ))}
          </View>
        </View>

        <View style={styles.gap}>
          <View style={styles.filterCan}>
            <SortFilter
              title='sort'
              subTitle={sortOrder}
              icon='sort-variant'
              bgColor='white'
              onPress={() => setIsSortModalVisible(true)}
            />
            <SortFilter
              title='filter'
              subTitle='all'
              icon='filter-variant'
              bgColor='yellow'
              onPress={() => setFilterModalVisible(true)}
            />
          </View>

          {refreshing || isLoading ? (
            <Loader color='yellow' />
          ) : (
            <FlatList
              data={filteredTips}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TipCard
                  lastWin={item.user.last_five}
                  winRate={(Math.random() * 100).toFixed(0) + "%"}
                  profile={{
                    name: item.user.username,
                    image: item.user.profile_picture,
                  }}
                  tipStatus={item.result}
                  date={item.match_date}
                  odds={item.ods}
                  wallet={{
                    name: item.betting_company.title,
                    image: `${API_Images_Domain}${item.betting_company.logo}`
                  }}
                  code={item.codes}
                />
              )}
              contentContainerStyle={{ gap: 20 }}
              scrollEnabled={false}
              removeClippedSubviews={false}
              ListFooterComponent={<View style={{ marginBottom: 90 }}></View>}
            />
          )}
        </View>
      </ScrollView>

      {!isLoading && (
        <Link href={'/createTipForm'} style={styles.createpost}>
          <View>
            <Image source={require('@/assets/images/Polygon.png')} style={styles.plusIcon} />
            <AntDesign name='plus' size={30} color={"black"} style={styles.createTip} />
          </View>
        </Link>
      )}

      {isCalendarVisible && (
        <Calendar
          visible={isCalendarVisible}
          onClose={() => setIsCalendarVisible(false)}
          onDateSelect={handleDateSelect}
        />
      )}

      <SortingModal
        visible={isSortModalVisible}
        onClose={() => setIsSortModalVisible(false)}
        onSelect={(value) => setSortOrder(value)}
        selectedValue={sortOrder}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
};

export default FreeTip;

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "#2B2B2B",
    paddingBottom: 20
  },
  calandarCan: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 5,
    overflow: 'hidden'
  },
  dateCircle: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: '#4B4B4B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calandarIcon: {
    width: 30,
    height: 30,
  },
  filterCan: {
    flexDirection: "row",
    gap: 10,
  },
  gap: {
    paddingHorizontal: 20,
    gap: 20,
    marginTop: 20
  },
  tipCan: {
    width: ScreenWidth,
  },
  createpost: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 10,
  },
  plusIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    tintColor: 'red'
  },
  createTip: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
});