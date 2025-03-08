import { Pressable, StyleSheet, Text, View, FlatList, Image, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { GetCompany } from "@/utils/queries/Tip";
import { useAuth } from "@/contexts/authContext";
import { API_Images_Domain } from "@/utils/apiConfig";

const bettingCompanies = [
    { id: 1, name: "Sporty Bet", icon: "https://example.com/sporty-bet.png" },
    { id: 2, name: "1xBet", icon: "https://example.com/1xbet.png" },
    { id: 3, name: "Bet 9ja", icon: "https://example.com/bet9ja.png" },
    { id: 4, name: "Betway", icon: "https://example.com/betway.png" },
    { id: 5, name: "Stake.com", icon: "https://example.com/stake.png" },
];


const CompanyDropDown = ({ onSelect }: { onSelect: (company: string) => void }) => {
    const { token } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>({
        icon: "",
        name: "Company",
        id: 0
    });

    const selectCompany = (company: any) => {
        setSelectedCompany(company);
        setModalVisible(false);
        onSelect(company.id);
    };
    const { data: betCompanys, isLoading, error } = useQuery({
        queryKey: ['betCompanies'],
        queryFn: () => GetCompany(token),
    });
    const companyData = betCompanys?.data;

    return (
        <>
            {/* Drop-down Button */}
            <Pressable style={styles.container} onPress={() => setModalVisible(true)}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    {selectedCompany.id != 0 ?
                        <>
                            <Image source={{ uri: API_Images_Domain + selectedCompany.logo || "https://via.placeholder.com/40" }}
                                style={styles.companyIcon} />
                            <Text style={styles.companyText}>{selectedCompany.title}</Text>
                        </>
                        :
                        <Text style={[styles.companyText,{paddingVertical:5}]}>Company</Text>
                    }
                </View>
                <AntDesign name="down" size={20} color={"white"} />
            </Pressable>

            {/* Modal */}
            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            {/* Modal Handle */}
                            <View style={styles.modalHandle} />

                            {/* Betting Companies List */}
                            <FlatList
                                data={companyData}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.listItem} onPress={() => selectCompany(item)}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <Image source={{ uri: API_Images_Domain + item.logo }} style={styles.companyIcon} />
                                            <Text style={styles.companyText}>{item.title}</Text>
                                        </View>
                                        {selectedCompany.id === item.id && (
                                            <AntDesign name="check" size={18} color="yellow" />
                                        )}
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

export default CompanyDropDown;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2B2B2B",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
    },
    companyIcon: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    companyText: {
        fontSize: 16,
        color: "white",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "flex-end",
        alignItems: "center",
        borderRadius: 50
    },
    modalContainer: {
        backgroundColor: "#2B2B2B",
        width: "100%",
        padding: 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    modalHandle: {
        width: 100,
        height: 4,
        backgroundColor: "white",
        alignSelf: "center",
        marginBottom: 10,
        borderRadius: 5,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#444",
    },
});