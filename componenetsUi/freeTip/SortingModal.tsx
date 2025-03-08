import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SortingModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  selectedValue: string;
}

const SortingModal: React.FC<SortingModalProps> = ({ visible, onClose, onSelect, selectedValue }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.option} 
          onPress={() => {
            onSelect("latest");
            onClose();
          }}
        >
          <Text style={styles.optionText}>Latest - Oldest</Text>
          {selectedValue === "latest" && <Ionicons name="checkmark" size={20} color="yellow" />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.option} 
          onPress={() => {
            onSelect("oldest");
            onClose();
          }}
        >
          <Text style={styles.optionText}>Oldest - Newest</Text>
          {selectedValue === "oldest" && <Ionicons name="checkmark" size={20} color="yellow" />}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SortingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1E1E1E",
    paddingVertical: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingLeft: 20,
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
});
