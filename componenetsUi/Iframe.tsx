import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

type Props = {
  videoId: string;
  setheight?: any;
  setwidth?: any;
};

const Iframe = ({ videoId, setheight, setwidth }: Props) => {
  const videoHtml = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: black;
          }
          iframe {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0&playsinline=1"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, { width: setwidth || "100%", height: setheight || 250 }]}>
      <WebView
        source={{ html: videoHtml }}
        style={styles.video}
        allowsFullscreenVideo={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 250,
  },
  video: {
    flex: 1,
  },
});

export default Iframe;
