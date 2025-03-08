import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

interface DropdownSelectProps {
  title: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({ title, options, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  return (
    // <View style={styles.container}>
      <RNPickerSelect
        onValueChange={(value) => {
          setSelectedValue(value);
          onSelect(value);
        }}
        items={options}
        placeholder={{ label: title, value: "30" }}
        style={{
          inputAndroid: styles.input,
          inputIOS: styles.input,
          iconContainer: styles.iconContainer, // <-- Add this
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => <Ionicons name="chevron-down" size={20} color="white" />}
      />
    // </View>
  );
};

export default DropdownSelect;

const styles = StyleSheet.create({
  input: {
    color: "white",
    fontSize: 16,
    backgroundColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer:{
    margin:12
  }
});