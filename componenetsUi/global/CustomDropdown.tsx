import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';

interface DropdownProps {
  data: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({ data, selectedValue, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={data}
        setOpen={setOpen}
        setValue={setValue}
        onChangeValue={onSelect}
        style={styles.dropdown}
        textStyle={styles.text}
        dropDownContainerStyle={styles.dropdownContainer}
        ArrowUpIconComponent={({ style }) => (
          <Ionicons name="chevron-up" size={24} color="white" style={style} />
        )}
        ArrowDownIconComponent={({ style }) => (
          <Ionicons name="chevron-down" size={24} color="white" style={style} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
  },
  dropdown: {
    backgroundColor: 'black',
    borderColor: 'gray',
    borderRadius: 8,
  },
  text: {
    color: 'white',
  },
  dropdownContainer: {
    backgroundColor: 'black',
    borderColor: 'gray',
  },
});

export default CustomDropdown;