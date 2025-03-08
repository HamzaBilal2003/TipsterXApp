import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostInput from "@/componenetsUi/createPost.tsx/postInput";
import ImagePickerGrid from "@/componenetsUi/createPost.tsx/imagePickerGrid";
import { useMutation } from "@tanstack/react-query";
import { AddPost } from "@/utils/mutations/postAdd";
import { useNavigation, useRouter } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { showTopToast } from "@/utils/helpers";
import { useAuth } from "@/contexts/authContext";
import { ApiError } from "@/utils/customApiCall";
import Loader from "@/componenetsUi/Loader";

const CreatePost = () => {
  const { goBack, navigate, reset } = useNavigation<NavigationProp<any>>();
  const { token, userData } = useAuth();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const route = useRouter();
  const handleImageSelection = (images: string[]) => {
    setSelectedImages(images);
  };

  const { mutate: handleAddPost, isPending: addPostPending } = useMutation({
    mutationKey: ["addPost"],
    mutationFn: ({ formdata, token }: { formdata: FormData; token: string }) => AddPost(formdata, token),
    onSuccess: async (data) => {
      showTopToast({
        type: "success",
        text1: "success",
        text2: "Your post has been submitted for review and will be live once approved"
      });
      route.push("/(tabs)");
      const result = data?.data;
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });

  const handleSubmit = () => {
    const formdata = new FormData();
    formdata.append("content", selectedContent);
    selectedImages.forEach((image, index) => {
      const imageBlob = {
        uri: image,
        type: 'image/jpeg',
        name: `image${index}.jpg`,
      } as any;
      formdata.append(`images[${index}]`, imageBlob);
    });
    formdata.append("user_id", userData.id.toString());
    handleAddPost({ formdata, token });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      {/* Post Input */}
      <PostInput setSelectedContent={setSelectedContent} />

      {/* Image Picker Grid */}
      <ImagePickerGrid images={selectedImages} onImageSelect={handleImageSelection} />
      {/* Submit Button */}
      {addPostPending ? <Loader color="white" /> :
        <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={addPostPending}>
          <Text style={styles.btnText}>Upload Now</Text>
        </Pressable>
      }
    </KeyboardAvoidingView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  submitButton: {
    backgroundColor: "yellow",
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 16,
  }
});