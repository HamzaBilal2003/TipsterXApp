import React, { useState } from "react";
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

interface ImagePickerGridProps {
  images: string[];
  onImageSelect: (images: string[]) => void;
}

const ImagePickerGrid: React.FC<ImagePickerGridProps> = ({ images, onImageSelect }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>(images);

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photos to select images.");
      return;
    }

    // Open image gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImage = result.assets[0].uri;
      const updatedImages = [...selectedImages, newImage];
      setSelectedImages(updatedImages);
      onImageSelect(updatedImages); // Pass selected images back to parent component
    }
  };

  return (
    <View style={styles.gridContainer}>
      <TouchableOpacity style={styles.addImage} onPress={pickImage}>
        <Ionicons name="camera" size={28} color="yellow" />
      </TouchableOpacity>

      <FlatList
        data={selectedImages}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
    </View>
  );
};

export default ImagePickerGrid;

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addImage: {
    width: 80,
    height: 80,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 10,
  },
});
