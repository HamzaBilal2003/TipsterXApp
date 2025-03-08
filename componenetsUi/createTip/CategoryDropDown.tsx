import { Pressable, StyleSheet, Text, View, FlatList, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

// Sample Categories List
const categories = [
    { id: 0, name: "Mixed (All)" },
    { id: 1, name: "Football" },
    { id: 2, name: "Basketball" },
    { id: 3, name: "Volleyball" },
    { id: 4, name: "Cycling" },
    { id: 5, name: "Golf" },
];

const CategoryDropDown = ({ onSelect }: { onSelect: (categories: string[]) => void }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const toggleCategory = (id: number) => {
        if (id === 0) {
            // If "Mixed" is selected, select all categories
            setSelectedCategories(selectedCategories.length === categories.length ? 
                [] : categories.map(cat => cat.id));
        } else {
            setSelectedCategories(prevSelected => {
                const newSelection = prevSelected.includes(id)
                    ? prevSelected.filter(catId => catId !== id)
                    : [...prevSelected, id];

                // Remove "Mixed" if not all categories are selected
                if (newSelection.length !== categories.length) {
                    return newSelection.filter(catId => catId !== 0);
                }
                // Add "Mixed" if all categories are selected
                if (newSelection.length === categories.length - 1) {
                    return [...newSelection, 0];
                }
                return newSelection;
            });
        }
    };

    const handleGesture = ({ nativeEvent }: any) => {
        if (nativeEvent.translationY > 50) {
            setModalVisible(false);
        }
    };

    const handleSelect = () => {
        const selectedCategoryNames = categories
            .filter(cat => selectedCategories.includes(cat.id))
            .map(cat => cat.name)
            .filter(name => name !== "Mixed (All)"); // Remove "Mixed" from the final selection

        onSelect(selectedCategoryNames.length === 0 ? ["Mixed (All)"] : selectedCategoryNames);
        setModalVisible(false);
    };

    const getSelectionText = () => {
        if (selectedCategories.length === 0) return "Select Category";
        if (selectedCategories.includes(0)) return "Mixed (All)";
        return `Selected (${selectedCategories.length})`;
    };

    return (
        <>
            <Pressable 
                style={[styles.container, modalVisible && styles.containerActive]} 
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.categoryText}>{getSelectionText()}</Text>
                <AntDesign 
                    name={modalVisible ? "up" : "down"} 
                    size={20} 
                    color="white" 
                    style={styles.icon}
                />
            </Pressable>

            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <PanGestureHandler onGestureEvent={handleGesture}>
                            <Animated.View 
                                entering={FadeIn.duration(200)}
                                exiting={FadeOut.duration(200)}
                                style={styles.modalContainer}
                            >
                                <View style={styles.modalHandle} />

                                <Text style={styles.modalTitle}>Select Categories</Text>

                                <FlatList
                                    data={categories}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.listItem,
                                                selectedCategories.includes(item.id) && styles.listItemSelected
                                            ]}
                                            onPress={() => toggleCategory(item.id)}
                                        >
                                            <Text style={[
                                                styles.categoryText,
                                                item.id === 0 && styles.mixedText,
                                                selectedCategories.includes(item.id) && styles.selectedText
                                            ]}>
                                                {item.name}
                                            </Text>
                                            {selectedCategories.includes(item.id) && (
                                                <AntDesign name="checksquare" size={20} color="#FFE600" />
                                            )}
                                        </TouchableOpacity>
                                    )}
                                    style={styles.list}
                                />

                                <Pressable 
                                    style={styles.selectButton} 
                                    onPress={handleSelect}
                                >
                                    <Text style={styles.selectButtonText}>
                                        Confirm Selection
                                    </Text>
                                </Pressable>
                            </Animated.View>
                        </PanGestureHandler>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

export default CategoryDropDown;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2B2B2B",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    containerActive: {
        borderColor: '#FFE600',
    },
    categoryText: {
        fontSize: 16,
        color: "white",
        fontWeight: '500',
    },
    icon: {
        opacity: 0.8,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#1C1C1E",
        width: "100%",
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        alignSelf: "center",
        marginBottom: 20,
        borderRadius: 2,
    },
    modalTitle: {
        fontSize: 20,
        color: "white",
        fontWeight: "600",
        marginBottom: 16,
        textAlign: 'center',
    },
    list: {
        maxHeight: 400,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginVertical: 4,
    },
    listItemSelected: {
        backgroundColor: 'rgba(255, 230, 0, 0.1)',
    },
    mixedText: {
        color: '#FFE600',
        fontWeight: '600',
    },
    selectedText: {
        fontWeight: '600',
    },
    selectButton: {
        backgroundColor: "#FFE600",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    selectButtonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "600",
    },
});