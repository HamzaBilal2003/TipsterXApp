import React, { useState, useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const screenWidth = Dimensions.get("window").width;

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={240} // Make controls larger
        width={screenWidth - 20}
        videoId={videoId}
        play={playing}
        onChangeState={onStateChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 240,
  },
});

export default YouTubePlayer;
