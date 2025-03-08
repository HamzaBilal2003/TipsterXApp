import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { editProfile } from '@/utils/mutations/authMutations';
import { useAuth } from '@/contexts/authContext';
import * as SecureStore from "expo-secure-store";
import { showTopToast } from '@/utils/helpers';
const USER_DATA_KEY = "USER_DATA";
interface EditBioModalProps {
  visible: boolean;
  onClose: () => void;
  userId: number;
  currentBio: string;
}

const EditBioModal: React.FC<EditBioModalProps> = ({ visible, onClose, userId, currentBio }) => {
  const { token, userData, setUserData } = useAuth();
  const [bio, setBio] = useState(currentBio);

  // Mutation for updating the bio
  const { mutate: updateBio, isPending } = useMutation({
    mutationKey: ["editProfile"],
    mutationFn: ({ data, user_id, token }: { data: FormData, user_id: number, token: string }) => editProfile(data, user_id, token),
    onSuccess: async () => {
      onClose(); // Close modal on success
      const updatedUserData = { ...userData, bio };
      setUserData(updatedUserData);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(updatedUserData));
      showTopToast({
        type: "success",
        text1: "Bio Updated",
        text2: 'Your bio has been successfully updated.',
      })
    },
    onError: (error: any) => {
      console.error("Error updating bio:", error);
    },
  });

  // Handle saving bio
  const handleSave = () => {
    if (!bio.trim()) return;

    const formData = new FormData();
    formData.append('bio', bio);

    updateBio({ data: formData, user_id: userId, token });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Edit Bio</Text>
          <TextInput
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            placeholder="Enter your bio..."
            placeholderTextColor={"white"}
            multiline
          />
          <View style={styles.buttonContainer}>
            <Pressable onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={[styles.buttonText, { color: "white" }]}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={[styles.button, styles.saveButton]}>
              {isPending ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Save</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditBioModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#2B2B2B',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textAlign: 'left',
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: 'yellow',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#8B8B8B',
    color: '#fff',
  },
});
