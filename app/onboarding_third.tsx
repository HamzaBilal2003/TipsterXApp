import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Onboarding from '@/componenetsUi/onboard/onboarding';
import onboardImage from '@/assets/images/onboard_3.png';
import { styles } from '@/styles/onboardingstyle';
import { useFonts } from 'expo-font';
import { Link } from 'expo-router';

const Onboarding_third = () => {
    const [fontsLoaded] = useFonts({
        "Handlee-Regular": require("../assets/fonts/Handlee-Regular.ttf"),
    });
    if (!fontsLoaded) {
        return null; // Show a loader until fonts are loaded
    }
    return (
        <Onboarding
            backgroundImage={onboardImage}
        >
            <View style={styles.bottomCan}>
                <View style={styles.heading}>
                    <Text style={styles.headintext}>Join a</Text>
                    <Text style={styles.headintext}>Winning</Text>
                    <Text style={[styles.subHeadingtext, { fontFamily: "Handlee-Regular", fontStyle: "normal" }]}>
                        Community
                    </Text>
                </View>


                <Text style={styles.para}>
                    Connect with top tipsters and fellow
                    bettors to share insight and strategy
                </Text>

                <Link href={'/login'} style={styles.continuelink}>
                    <Text style={styles.continuelinkText}>Continue</Text>
                </Link>

            </View>
        </Onboarding>
    );
};

export default Onboarding_third;
