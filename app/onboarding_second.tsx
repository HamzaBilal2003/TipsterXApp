import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Onboarding from '@/componenetsUi/onboard/onboarding';
import onboardImage from '@/assets/images/onboard_2.png';
import { styles } from '@/styles/onboardingstyle';
import { useFonts } from 'expo-font';
import { Link } from 'expo-router';

const Onboarding_second = () => {
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
                    <Text style={styles.headintext}>Access</Text>
                    <Text style={styles.headintext}>Expert</Text>
                    <View style={{ flexWrap: 'wrap', gap: 5, flexDirection: "row" }}>
                        <Text style={styles.headintext}>Verified</Text>
                        <Text style={[styles.subHeadingtext, { fontFamily: "Handlee-Regular", fontStyle: "normal" }]}>
                            Tips
                        </Text>
                    </View>
                </View>


                <Text style={styles.para}>
                    Unlock 
                    {""}
                    <Text style={{fontWeight:"bold"}}>premium</Text>
                    {""} tips from high ranking,
                    vetted tipsters for smarter bets
                </Text>

                <Link href={'/onboarding_third'} style={styles.continuelink}>
                    <Text style={styles.continuelinkText}>Continue</Text>
                </Link>

            </View>
        </Onboarding>
    );
};

export default Onboarding_second;
