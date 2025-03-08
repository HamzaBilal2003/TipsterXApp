import { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import InputField from '@/componenetsUi/edit/InputField';
import { useMutation } from '@tanstack/react-query';
import { ResetPasswordOfEdit } from '@/utils/mutations/authMutations';
import { ApiError } from '@/utils/customApiCall';
import { showTopToast } from '@/utils/helpers';
import Loader from '@/componenetsUi/Loader';
import { useAuth } from '@/contexts/authContext';

export default function ChangePasswordSheet({ onClose }: { onClose: () => void }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { mutate: handleEdit, isPending: registerPending } = useMutation({
    mutationKey: ["editProfile"],
    mutationFn: ({ data, token }: { data: FormData, token: string }) => ResetPasswordOfEdit(data, token),
    onSuccess: async (data) => {
      showTopToast({
        type: "success",
        text1: "Success",
        text2: data.message,
      });
      onClose();
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
    if (formData.newPassword !== formData.confirmPassword) {
      showTopToast({
        type: "error",
        text1: "Error",
        text2: "New passwords do not match",
      });
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("old_password", formData.oldPassword);
    formDataToSend.append("new_password", formData.newPassword);
  
    handleEdit({ data: formDataToSend, token });
  };
  

  return (
    <View style={{flex:1}}>
      <Pressable onPress={onClose} style={[styles.closeButton,{flex:1}]}/>
      <View style={styles.container}>
        <View style={{marginVertical:10,width:50,height:5,backgroundColor:"gray",margin:"auto",borderRadius:5}} /> 
        <View style={styles.content}>
          <InputField
            value={formData.oldPassword}
            onChangeText={(text) => setFormData(prev => ({ ...prev, oldPassword: text }))}
            placeholder="Old Password"
            style={{marginHorizontal:0}}
          />
          <InputField
            value={formData.newPassword}
            onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
            placeholder="New Password"
            style={{marginHorizontal:0}}
          />
          <InputField
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
            placeholder="Confirm New Password"
            style={{marginHorizontal:0}}
          />

          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
            disabled={registerPending}
          >
            {registerPending ? (
              <Loader color="black" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height:350,
    backgroundColor: '#2B2B2B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: 'yellow',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});