import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

type Props = {
  text: string;
};

const TipCardBox = ({ text }: Props) => {
  let boxStyle = styles.box;
  let textStyle = styles.boxText;

  if (text.toLowerCase() === 'w') {
    boxStyle = { ...boxStyle, borderColor: 'green'};
    textStyle = { ...textStyle, color: 'green' };
  } else if (text.toLowerCase() === 'r') {
    boxStyle = { ...boxStyle, borderColor: 'yellow'};
    textStyle = { ...textStyle, color: 'yellow' };
  } else if (text.toLowerCase() === 'l') {
    boxStyle = { ...boxStyle, borderColor: 'red' };
    textStyle = { ...textStyle, color: 'white' };
  }

  return (
    <View style={boxStyle}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

export default TipCardBox;

const styles = StyleSheet.create({
  box: {
    borderWidth: 2,
    borderColor: 'yellow',
    width: 20,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    fontSize: 10,
    color: 'white',
  },
});