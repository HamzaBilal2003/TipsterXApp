import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable, Text, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import TabSelector from '@/componenetsUi/edit/TabSelector';
import InputField from '@/componenetsUi/edit/InputField';
import ChangePassword from '@/componenetsUi/edit/ChangePassword';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/authContext';
import { API_Images_Domain } from '@/utils/apiConfig';
import { useMutation, useQuery } from '@tanstack/react-query';
import { editProfile } from '@/utils/mutations/authMutations';
import { ApiError } from '@/utils/customApiCall';
import { showTopToast } from '@/utils/helpers';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { GetBankDetail } from '@/utils/queries/Profile';
import Loader from '@/componenetsUi/Loader';
import * as SecureStore from "expo-secure-store";

export default function EditProfile() {
  const { token, userData, setUserData } = useAuth();
  const [pageLorder, setpageLorder] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'bank'>('profile');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(API_Images_Domain + userData?.profile_picture.replace("https://tipster.hmstech.org/storage/", ''));
  const [formData, setFormData] = useState({
    username: userData?.username,
    phone: userData?.phone,
    email: userData?.email,
    dob: userData?.dob,
    nationality: userData?.nationality,
  });
  const USER_DATA_KEY = "USER_DATA";

  // Handle profile picture selection
  const pickProfilePicture = async () => {
    setpageLorder(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
    setpageLorder(false);
  };

  const { mutate: handleEdit, isPending: registerPending } = useMutation({
    mutationKey: ["editProfile"],
    mutationFn: ({ data, user_id, token }: { data: FormData, user_id: number, token: string }) => editProfile(data, user_id, token),
    onSuccess: async (data) => {
      const result = data?.data;
      setUserData(result);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(result));
      showTopToast({
        type: "success",
        text1: "Profile Updated",
        text2: 'Your profile has been successfully updated.',
      });
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });

  const handleSave = async () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    if (profilePicture && profilePicture !== userData.profile_picture) {
      const fileName = profilePicture.split('/').pop();
      const fileType = fileName?.split('.').pop();

      formDataToSend.append('profile_picture', {
        uri: profilePicture,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
    }
    handleEdit({ data: formDataToSend, user_id: userData.id, token });
  };

  const { data: bankDetail, isLoading, error } = useQuery({
    queryKey: ['bankDetail'],
    queryFn: () => GetBankDetail(token),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const bankInfo = bankDetail?.data;

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" />
      <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
      {pageLorder && (
        <View style={styles.loaderContainer}>
          <Loader color='yellow' />
        </View>
      )}
      <ScrollView style={styles.content}>
        {activeTab === 'profile' ? (
          <>
            <View style={styles.profilePicContainer}>
              <Pressable onPress={pickProfilePicture}>
                {profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    style={styles.profileImage}
                  />
                ) : (
                  <FontAwesome name='camera' size={24} color='white' />
                )}
              </Pressable>
            </View>

            <InputField
              value={formData.username}
              onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
              placeholder="Full Name"
            />
            <InputField
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="Phone Number"
            />
            <InputField
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="Email"
            />
            <InputField
              value={formData.dob}
              onChangeText={(text) => setFormData(prev => ({ ...prev, dob: text }))}
              placeholder="Date of Birth"
            />
            <InputField
              value={formData.nationality}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nationality: text }))}
              placeholder="Nationality"
            />
            <Pressable onPress={handleSave} style={styles.saveBtn} disabled={registerPending}>
              {registerPending ? <Loader color='black' /> : <Text style={styles.saveBtnText}>Save</Text>}
            </Pressable>
            <Pressable style={styles.changePasswordBtn} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.changePasswordText}>Change Password</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.bankDetails}>
            <InputField
              value={bankInfo?.bank_name}
              placeholder="Bank Name"
            />
            <InputField
              value={bankInfo?.account_name}
              placeholder="Account Name"
            />
            <InputField
              value={bankInfo?.account_number}
              placeholder="Account Number"
            />

            <View style={styles.alertCan}>
              <Feather name="alert-circle" size={24} color="yellow" />
              <Text style={styles.alertText}>
                Kindly contact support to edit your bank details
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ChangePassword onClose={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: "#2B2B2B",
    width: 150,
    height: 150,
    borderRadius: 20,
    borderColor: 'white',
    overflow: 'hidden',
    margin: "auto"
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
    borderWidth: 2,
  },
  bankDetails: {
    flex: 1,
  },
  alertCan: {
    backgroundColor: "rgba(255, 255, 0, 0.5)",
    borderWidth: 2,
    borderColor: "yellow",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20
  },
  alertText: {
    color: "white",
    fontSize: 14,
    flex: 1,
    textAlign: "justify",
  },
  saveBtn: {
    backgroundColor: "yellow",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: "black",
    fontSize: 16
  },
  changePasswordBtn: {
    margin: 20,
  },
  changePasswordText: {
    color: "yellow",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    flex:1,
    
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
});