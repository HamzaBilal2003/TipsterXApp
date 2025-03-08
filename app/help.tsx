import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import MessageBubble from '@/componenetsUi/help/MessageBubble';
import InputComponent from '@/componenetsUi/help/InputComponent';
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import { useAuth } from '@/contexts/authContext';
import Loader from '@/componenetsUi/Loader';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

const API_BASE_URL = "https://tipster.hmstech.org/api";

const Help: React.FC = () => {
    const router = useRouter();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const loginId = '456';
    const chatId = '1';
    const { token, user } = useAuth();
    const scrollViewRef = React.useRef<ScrollView>(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/message/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "We need access to your photos to select images.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled && result.assets.length > 0) {
            setSelectedImages([...selectedImages, result.assets[0].uri]);
        }
    };

    const handleSubmit = async () => {
        if (!token) {
            Alert.alert("Error", "Authentication token is missing.");
            return;
        }

        if (selectedImages.length === 0 && message.trim() === '') {
            Alert.alert("Error", "Type a message or select an image");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('sender_type', 'user');
            formData.append('content', message);

            selectedImages.forEach((imageUri, index) => {
                formData.append(`attachment`, {
                    uri: imageUri,
                    name: `image_${index}.jpg`,
                    type: 'image/jpeg',
                });
            });

            const response = await axios.post(`${API_BASE_URL}/message/send`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.data) {
                setMessages([...messages, response.data.data]);
            }

            setMessage('');
            setSelectedImages([]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileSection}>
                <Image
                    source={require("@/assets/images/man.png")}
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>TipsterX Support</Text>
            </View>

            <View style={styles.divider} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.chatContainer}
            >
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <Loader color='#FFE600' />
                    </View>
                ) : (
                    <ScrollView
                        ref={scrollViewRef} 
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <MessageBubble
                                    message={item.content}
                                    userId={item.sender_type}
                                    loginId={loginId}
                                    images={item.attachment ? [item.attachment] : []}
                                />
                            )}
                            contentContainerStyle={styles.messageListContent}
                            scrollEnabled={false}
                            scrollsToTop
                        />
                    </ScrollView>
                )}

                {selectedImages.length > 0 && (
                    <View style={styles.selectedImagesContainer}>
                        <FlatList
                            data={selectedImages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Image source={{ uri: item }} style={styles.selectedImage} />
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                )}
                <InputComponent
                    message={message}
                    setMessage={setMessage}
                    pickImage={pickImage}
                    handleSubmit={handleSubmit}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Help;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#000000',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center',
        marginRight: 44, // To center the title accounting for back button
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#333333',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    divider: {
        height: 1,
        backgroundColor: '#333333',
        marginHorizontal: 8,
    },
    chatContainer: {
        flex: 1,
        // marginTop: 8,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageListContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    selectedImagesContainer: {
        padding: 8,
        backgroundColor: '#1C1C1E',
        borderTopWidth: 1,
        borderTopColor: '#333333',
    },
    selectedImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 8,
    },
});