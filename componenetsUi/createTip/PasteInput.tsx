import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";

interface BookingCodeInputProps {
  setBookingDate: (value: string) => void;
  placeholder?: string;
}

const PasteInput: React.FC<BookingCodeInputProps> = ({
  setBookingDate,
  placeholder = "Booking Code",
}) => {
  const [bookingCode, setBookingCode] = useState<string>("");

  // Paste last copied text
  const handlePaste = async () => {
    const clipboardText = await Clipboard.getStringAsync();
    if (clipboardText) {
      setBookingCode(clipboardText);
      setBookingDate(clipboardText); // Update parent state
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={bookingCode}
        onChangeText={(text) => {
          setBookingCode(text);
          setBookingDate(text);
        }}
      />
      <TouchableOpacity onPress={handlePaste}>
        <Text style={styles.pasteText}>Paste</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasteInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  pasteText: {
    color: "yellow",
    fontWeight: "bold",
  },
});
