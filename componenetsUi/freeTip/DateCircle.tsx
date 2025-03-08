import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';

const screenWidth = Dimensions.get('window').width; // Get screen width
const circleSize = screenWidth / 7.5; // Dynamic size (adjust to fit all circles)

type Props = {
  date: string;
  day: string;
  isSelected: boolean;
  setSelected: (selected: string) => void;
};

const DateCircle = ({ date, day, isSelected, setSelected }: Props) => {
  console.log("date form dateCicle",date);
  return (
    <Pressable onPress={() => setSelected(date)}>
      <View style={[styles.dateCircle, isSelected && styles.selectedDateCircle, { width: circleSize, height: circleSize }]}>
        <Text style={[styles.dateHeading, isSelected && styles.selectedText]}>{day}</Text>
        <Text style={[styles.dateSubheading, isSelected && styles.selectedText]}>{date}</Text>
      </View>
    </Pressable>
  );
};

export default DateCircle;

const styles = StyleSheet.create({
  dateCircle: {
    borderRadius: 50,
    backgroundColor: '#4B4B4B',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2, // Add some spacing
  },
  selectedDateCircle: {
    backgroundColor: 'yellow',
  },
  dateHeading: {
    fontSize: 12,
    marginBottom: 5,
    color: 'white',
    textTransform: 'capitalize',
  },
  dateSubheading: {
    color: 'white',
    fontSize: 8,
  },
  selectedText: {
    color: 'black',
  },
});
