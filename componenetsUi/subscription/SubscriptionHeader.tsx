import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Image } from 'react-native';

const bulletPoints: string[] = [
    "Secure more wins using expert - vetted tips with 90-99% Success Rate.",
    "Get predictions from the top 10 experts who won last week's contest.",
    "Enjoy fast and dedicated customer assistance.",
  ]

const SubscriptionHeader: React.FC = () => (
    <ImageBackground source={require('@/assets/images/subbg.png')} resizeMode="cover" style={styles.header}>
        <Image source={require("@/assets/images/permium.png")} style={styles.badge} />
        <Text style={styles.h1}>Upgrade to Premium</Text>
        <Text style={styles.h3}>With premium you get the following</Text>
        <View style={styles.bulletContainer}>
            {bulletPoints.map((item, index) => (
                <View style={styles.bulletItem} key={index}>
                    <Image source={require('@/assets/images/check.png')} style={styles.checkIcon} />
                    <Text style={styles.bulletText}>{item}</Text>
                </View>
            ))}
        </View>
    </ImageBackground>
);

export default SubscriptionHeader;

const styles = StyleSheet.create({
    header: { padding: 20 },
    badge: { position: 'absolute', right: 20, top: 10, width: 80, height: 80 },
    h1: { fontSize: 28, fontWeight: 'bold', color: '#FFD700' },
    h3: { fontSize: 16, color: '#FFF', marginTop: 5 },
    bulletContainer: { marginTop: 20 },
    bulletItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    checkIcon: { width: 20, height: 20, marginRight: 10 },
    bulletText: { color: '#FFF' }
});
