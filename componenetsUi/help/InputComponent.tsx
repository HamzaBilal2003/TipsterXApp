import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

type InputComponentProps = {
    message: string;
    setMessage: (text: string) => void;
    pickImage: () => void;
    handleSubmit: () => void;
};

const InputComponent: React.FC<InputComponentProps> = ({ message, setMessage, pickImage, handleSubmit }) => {
    return (
        <View style={styles.inputContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.btn}>
                <AntDesign name="paperclip" size={25} color="white" />
            </TouchableOpacity>
            <TextInput 
                onChangeText={setMessage} 
                value={message} 
                placeholder='Type Anything' 
                placeholderTextColor="gray" 
                style={styles.textInput} 
                multiline
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                <Feather name="send" size={25} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default InputComponent;

const styles = StyleSheet.create({
    inputContainer: {
        paddingHorizontal: 10,
        backgroundColor: "#2B2B2B",
        borderRadius: 10,
        marginHorizontal: 10,
        paddingVertical: 15,
        flexDirection: "row",
        gap: 10,
        alignItems: "flex-end",
        marginBottom:100,
        position:"sticky",
        bottom:0,
    },
    textInput: {
        color: "white",
        fontSize: 16,
        flex: 1
    },
    btn: {
        marginBottom: 8
    }
});
