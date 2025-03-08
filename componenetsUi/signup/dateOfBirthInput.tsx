import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { styles as floatingLabelStyles } from "@/styles/Loginstyle";

interface DateOfBirthInputProps {
  day: string;
  month: string;
  year: string;
  onChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
  errors: { day?: string; month?: string; year?: string };
  touched: { day?: boolean; month?: boolean; year?: boolean };
}

const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({
  day,
  month,
  year,
  onChange,
  onBlur,
  errors,
  touched,
}) => {
  const [isFocused, setIsFocused] = useState({ day: false, month: false, year: false });

  const handleFocus = (field: string) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field: string) => {
    setIsFocused({ ...isFocused, [field]: false });
    onBlur(field);
  };

  return (
    <View style={[styles.dobContainer]}>
      <View style={[styles.inputWrapper,{margin:0}]}>
        <Text
          onPress={() => handleFocus("day")}
          style={[
            floatingLabelStyles.label,
            (isFocused.day || day) && floatingLabelStyles.hoverLabel,
          ]}
        >
          Day
        </Text>
        <TextInput
          style={[
            floatingLabelStyles.input, { width: 100 },
            (isFocused.day || day) && floatingLabelStyles.hoverInput,
            touched.day && errors.day ? floatingLabelStyles.errorBorder : null,
          ]}
          keyboardType="numeric"
          maxLength={2}
          value={day}
          onChangeText={(value) => onChange("day", value)}
          onFocus={() => handleFocus("day")}
          onBlur={() => handleBlur("day")}
        />
        {touched.day && errors.day && <Text style={floatingLabelStyles.error}>{errors.day}</Text>}
      </View>

      <View style={styles.inputWrapper}>
        <Text
          onPress={() => handleFocus("month")}
          style={[
            floatingLabelStyles.label,
            (isFocused.month || month) && floatingLabelStyles.hoverLabel,
          ]}
        >
          Month
        </Text>
        <TextInput
          style={[
            floatingLabelStyles.input, { width: 100 },
            (isFocused.month || month) && floatingLabelStyles.hoverInput,
            touched.month && errors.month ? floatingLabelStyles.errorBorder : null,
          ]}
          keyboardType="numeric"
          maxLength={2}
          value={month}
          onChangeText={(value) => onChange("month", value)}
          onFocus={() => handleFocus("month")}
          onBlur={() => handleBlur("month")}
        />
        {touched.month && errors.month && <Text style={floatingLabelStyles.error}>{errors.month}</Text>}
      </View>

      <View style={[styles.inputWrapper, { flex: 1 }]}>
        <Text
          onPress={() => handleFocus("year")}
          style={[
        floatingLabelStyles.label,
        (isFocused.year || year) && floatingLabelStyles.hoverLabel,
          ]}
        >
          Year
        </Text>
        <TextInput
          style={[
        floatingLabelStyles.input, { width: '100%' },
        (isFocused.year || year) && floatingLabelStyles.hoverInput,
        touched.year && errors.year ? floatingLabelStyles.errorBorder : null,
          ]}
          keyboardType="numeric"
          maxLength={4}
          value={year}
          onChangeText={(value) => onChange("year", value)}
          onFocus={() => handleFocus("year")}
          onBlur={() => handleBlur("year")}
        />
        {touched.year && errors.year && <Text style={floatingLabelStyles.error}>{errors.year}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dobContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap:10
  },
  inputWrapper: {
    alignItems: "center",
    marginHorizontal: 0,
  },
});

export default DateOfBirthInput;