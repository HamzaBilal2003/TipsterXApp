import React from 'react';
import {
  Modal, View, Text, StyleSheet, Pressable, TouchableOpacity
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { useAuth } from '@/contexts/authContext';
import { showTopToast } from '@/utils/helpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/utils/queries/PostQueries';
import SpinnerLoader from '../SpinnerLoader';
import { ApiError } from '@/utils/customApiCall';

interface PostActionModalProps {
  visible: boolean;
  onClose: () => void;
  postId: number;
  userId: number;
}

const PostActionModal: React.FC<PostActionModalProps> = ({ visible, onClose, postId, userId }) => {
  const { userData, token } = useAuth();
  console.log()
  console.log(userData?.id == userId);
  const route = useRouter();
  const { navigate, reset } = useNavigation<NavigationProp<any>>();
  const queryClient = useQueryClient()
  const { mutate: handleDeletePost, isPending: deleteLoading } = useMutation({
    mutationFn: () => deletePost(postId, token),
    onSuccess: (data) => {
      console.log("delete success", data)
      showTopToast({
        type: "success",
        text1: "Post",
        text2: "The post has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
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

  const handleFollowUser = () => {
    navigate("profile", {
      context: "profile",
      userId: userId,
    });
    onClose();
  };

  const handleReportPost = () => {
    showTopToast({
      type: "success",
      text1: "Post",
      text2: "The post has been reported successfully",
    });
    onClose();
  };

  const handleNotInterested = () => {
    showTopToast({
      type: "success",
      text1: "Post",
      text2: "You are no longer interested in this post",
    });
    onClose();
  };

  const handleDelete = () => {
    handleDeletePost();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.modalContainer}>
        <View style={{ width: 150, height: 2, backgroundColor: "gray", margin: "auto" }} />
        {userData?.id != userId ? (
          <>
            <TouchableOpacity style={styles.option} onPress={handleFollowUser}>
              <FontAwesome name={userData?.id != userId ? "user-plus" : "user-circle-o"} size={20} color="white" />
              <Text style={styles.optionText}>{userData?.id != userId ? "Follow user" : 'View profile'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleReportPost}>
              <Ionicons name="alert-circle-outline" size={20} color="white" />
              <Text style={styles.optionText}>Report Post</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleNotInterested}>
              <Ionicons name="warning-outline" size={20} color="white" />
              <Text style={styles.optionText}>Not Interested</Text>
            </TouchableOpacity>
          </>
        )
        : (
        <TouchableOpacity style={styles.option} onPress={handleDelete} disabled={deleteLoading}>
          {deleteLoading ? <SpinnerLoader color='white' size={20} /> : <Ionicons name="trash-outline" size={20} color="white" />}
          <Text style={styles.optionText}>Delete Post</Text>
        </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

export default PostActionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#2B2B2B',
    paddingVertical: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 20,
  },
  optionText: {
    color: "white",
    fontSize: 16,
    marginLeft: 15,
  },
});