import { useAuth } from "@/contexts/authContext";
import { API_DOMAIN, API_Images_Domain } from "@/utils/apiConfig";
import React from "react";
import { View, Text, TextInput, Image, StyleSheet } from "react-native";

type props = {
  setSelectedContent: (content: string) => void;
}

const PostInput = ({setSelectedContent} : props) => {
  const { userData } = useAuth()
  // console.log("user Data",userData);
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputBox}>
        <Image source={{ uri: API_Images_Domain + userData.profile_picture.substring(API_Images_Domain.length) }} style={styles.profileImage} />
        <Text style={styles.username}>{userData.username}</Text>
      </View>
      <TextInput placeholder="Start typing" placeholderTextColor="gray" style={styles.textInput} multiline onChangeText={(text) => setSelectedContent(text)} />
    </View>
  );
};

export default PostInput;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor:"#1f1f1f",
    borderRadius:10,
    padding:20
  },
  profileImage: {
    width:50,
    height:50,
    borderRadius:80
  },
  inputBox: {
    // flex: 1,
    flexDirection: "row",
    alignItems:"flex-start",
    gap:10
  },
  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    paddingTop:10
    // marginBottom: 5,
  },
  textInput: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    minHeight: 200, // Set a minimum height
    textAlignVertical: "top", // Ensures text starts from the top
  },
});
