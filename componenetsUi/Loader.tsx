import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, Text, StyleSheet } from "react-native";

const Loader = ({ color, Loadingtext }: { color: string, Loadingtext?: string }) => {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const createAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -10, // Move dot up
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0, // Move dot back down
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = dots.map((dot, index) => createAnimation(dot, index * 200));
    animations.forEach((animation, index) => setTimeout(() => animation.start(), index * 150));

    return () => animations.forEach(animation => animation.stop());
  }, []);

  if (Loadingtext) {
    return (<View style={styles.LoadingTextCan}>
      <View style={styles.container}>
        {dots.map((dot, index) => (
          <Animated.Text key={index} style={[styles.dot, { transform: [{ translateY: dot }], color: color }]}>
            •
          </Animated.Text>
        ))}
      </View>
      <Text style={{ fontSize: 14, color: color }}>{Loadingtext}</Text>
    </View>)
  } else {
    return (<View style={styles.container}>
      {dots.map((dot, index) => (
        <Animated.Text key={index} style={[styles.dot, { transform: [{ translateY: dot }], color: color }]}>
          •
        </Animated.Text>
      ))}
    </View>)
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    fontSize: 28,
    marginHorizontal: 4,
  },
  LoadingTextCan: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  }
});

export default Loader;
