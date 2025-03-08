import React, { useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { styles } from "@/styles/Loginstyle";

// 🔹 Define Props Type
interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  value: string;
  error?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ label, value, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleLabelPress = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  return (
    <View style={styles.inputContainer}>
      {/* Floating Label */}
      <Text
        onPress={handleLabelPress}
        style={[
          styles.label,
          (isFocused || value) && styles.hoverLabel, // Move label up if focused or has value
        ]}
      >
        {label}
      </Text>

      {/* Input Field */}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          (isFocused || value) && styles.hoverInput, // Highlight input when focused
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        {...props}
      />

      {/* Error Message */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default FloatingLabelInput;