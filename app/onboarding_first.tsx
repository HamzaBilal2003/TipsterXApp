import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Onboarding from '@/componenetsUi/onboard/onboarding';
import onboardImage from '@/assets/images/onboard_1.png';
import { styles } from '@/styles/onboardingstyle';
import { useFonts } from 'expo-font';
import { Link } from 'expo-router';

const Onboarding_first = () => {
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
                    <Text style={styles.headintext}>Get Free</Text>
                    <View style={{ flexWrap: 'wrap', gap: 5, flexDirection: "row" }}>
                        <Text style={styles.headintext}>Tips</Text>
                        <Text style={[styles.subHeadingtext, { fontFamily: "Handlee-Regular", fontStyle: "normal" }]}>
                            anytime
                        </Text>
                    </View>
                </View>


                <Text style={styles.para}>
                    Tap into free predictions from the{" "}
                    <Text style={{ fontWeight: "bold" }}>TipsterX</Text>
                    {" "}community and stay ahead
                </Text>

                <Link href={'/onboarding_second'} style={styles.continuelink}>
                    <Text style={styles.continuelinkText}>Continue</Text>
                </Link>

            </View>
        </Onboarding>
    );
};

export default Onboarding_first;
