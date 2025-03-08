import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link, useNavigation, useRouter } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/authContext';
import { API_Images_Domain } from '@/utils/apiConfig';
import { home } from '@/assets/icons/icon';
import { NavigationProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { FetchUserRank } from '@/utils/queries/Rank';

interface HeaderProps {
  profileImage?: string;
  rNumber?: number;
  notHeaderShown?: boolean;
}

const Header: React.FC<HeaderProps> = ({ profileImage, rNumber, notHeaderShown }) => {
  const router = useRouter();
  const { userData, token } = useAuth();
  const { navigate, reset } = useNavigation<NavigationProp<any>>();
  const handleProfile = (id: number) => {
    navigate("profile", {
      context: "signup",
      userId: id,
    });
  }
  const { data: UserRank, isLoading: UserloadingStatus, error: getUsererror } = useQuery({
    queryKey: ['Userrank'],
    queryFn: () => FetchUserRank(token),
  });
  const rankUser=  UserRank?.data.rank;
  // console.log( "images from header", userData?.profile_picture.replace(API_Images_Domain,''))

  return (
    <View style={styles.header}>
      {/* Larger Logo */}
      {!notHeaderShown && <Image source={require("@/assets/logo.png")} style={styles.logo} />}

      {notHeaderShown && (
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <AntDesign name="left" size={22} color="white" />
        </Pressable>
      )}

      {/* Right Section */}
      <View style={styles.headerRight}>
        <Link href={'/(tabs)/rankings'}>
          <View style={styles.rCan}>
            <Text style={styles.r}>R</Text>
            <Text style={styles.rNumber}>{rankUser}</Text>
          </View>
        </Link>

        <Pressable onPress={handleProfile}>
          <Image source={{ uri: userData?.profile_picture }} style={styles.headerProfile} />
        </Pressable>

        <Link href={"/notification"} style={styles.headerNotifitcation}>
          <Image source={home.notification} alt="" style={{ width: 20, height: 20 }} />
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    gap: 30,
  },
  logo: {
    maxWidth: 100, // Increased logo size
    height: 50,
    resizeMode: "contain",
  },
  headerRight: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  rCan: {
    backgroundColor: "#3f3f3f",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  r: {
    color: "black",
    backgroundColor: "yellow",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 14, // Reduced size
  },
  rNumber: {
    color: "white",
    fontSize: 14, // Reduced size
    fontWeight: "bold",
    paddingInline:12
  },
  headerProfile: {
    width: 40, // Reduced profile image size
    height: 40,
    borderRadius: 8,
  },
  headerNotifitcation: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#3f3f3f",
  },
  backBtn: {
    backgroundColor: "#2B2B2B",
    width: 50, // Smaller back button
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Header;
