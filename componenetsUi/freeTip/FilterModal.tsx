import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GetCompany } from "@/utils/queries/Tip";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authContext";
import { API_Images_Domain } from "@/utils/apiConfig";
import { ScrollView } from "react-native-gesture-handler";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const bettingCompanies = [
  { id: 1, name: "Sporty Bet", logo: "🔴" },
  { id: 2, name: "1xBet", logo: "🔵" },
  { id: 3, name: "Bet9ja", logo: "🟢" },
  { id: 4, name: "BetWay", logo: "⚫" },
  { id: 5, name: "Stake", logo: "🔵" },
];

const categories = [
  { id: 1, name: "Football" },
  { id: 2, name: "Basketball" },
  { id: 3, name: "Volleyball" },
  { id: 4, name: "cricket" }
];

const winRateOptions = [
  { id: 1, label: "Top 1%", value: "1" },
  { id: 10, label: "Top 10%", value: "10" },
  { id: 25, label: "Top 25%", value: "25" },
];

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApplyFilters }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [odds, setOdds] = useState({ min: 0, max: 0 });
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedWinRate, setSelectedWinRate] = useState<number | null>(null);
  const [winRateRange, setWinRateRange] = useState({ min: 0, max: 0 });
  const { token } = useAuth()

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };
  const { data: betCompanys, isLoading, error } = useQuery({
    queryKey: ['betCompanies'],
    queryFn: () => GetCompany(token),
  });
  const companyData = betCompanys?.data;

  const handleCompanyToggle = (id: number) => {
    setSelectedCompanies((prev) =>
      prev.includes(id) ? prev.filter((compId) => compId !== id) : [...prev, id]
    );
  };

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    const filters = {
      odds,
      bettingCompanies: selectedCompanies,
      winRate: selectedWinRate ? selectedWinRate : winRateRange,
      categories: selectedCategories,
    };
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ gap: 10,marginBottom:20 }}>
          {/* Odds */}
          <TouchableOpacity style={styles.section} onPress={() => toggleSection("odds")}>
            <Text style={styles.sectionTitle}>Odds</Text>
            <Ionicons name={expanded === "odds" ? "chevron-up" : "chevron-down"} size={20} color="white" />
          </TouchableOpacity>
          {expanded === "odds" && (
            <View style={styles.rangeContainer}>
              <View style={styles.rangeItem}>
                <Text style={styles.rangeLabel}>Min</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(odds.min)}
                  onChangeText={(text) => setOdds({ ...odds, min: Number(text) || 0 })}
                />
              </View>
              <View style={styles.rangeItem}>
                <Text style={styles.rangeLabel}>Max</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(odds.max)}
                  onChangeText={(text) => setOdds({ ...odds, max: Number(text) || 0 })}
                />
              </View>
            </View>
          )
          }
        </View>

        <View style={{ gap: 10,marginBottom:20 }}>
          {/* Betting Companies */}
          <TouchableOpacity style={styles.section} onPress={() => toggleSection("betting")}>
            <Text style={styles.sectionTitle}>Betting Company</Text>
            <Ionicons name={expanded === "betting" ? "chevron-up" : "chevron-down"} size={20} color="white" />
          </TouchableOpacity>
          {
            !isLoading && companyData && expanded === "betting" && (
              <FlatList
                data={companyData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleCompanyToggle(item.id)}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <Image source={{ uri: API_Images_Domain + item.logo }} style={styles.checkboxImage} />
                      <Text style={{ fontSize: 16, color: "white" }}> {item.title}</Text>
                    </View>
                    {selectedCompanies.includes(item.id) && <Ionicons name="checkmark" size={20} color="yellow" />}
                  </TouchableOpacity>
                )}
              />
            )
          }
        </View>

        <View style={{ gap: 10,marginBottom:20 }}>
          {/* Win Rate */}
          <TouchableOpacity style={styles.section} onPress={() => toggleSection("winrate")}>
            <Text style={styles.sectionTitle}>Win Rate</Text>
            <Ionicons name={expanded === "winrate" ? "chevron-up" : "chevron-down"} size={20} color="white" />
          </TouchableOpacity>
          {
            expanded === "winrate" && (
              <>
                <View style={styles.rangeContainer}>
                  <View style={styles.rangeItem}>
                    <Text style={styles.rangeLabel}>Min</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(winRateRange.min)}
                      onChangeText={(text) => setWinRateRange({ ...winRateRange, min: Number(text) || 0 })}
                    />
                  </View>
                  <View style={styles.rangeItem}>
                    <Text style={styles.rangeLabel}>Max</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(winRateRange.max)}
                      onChangeText={(text) => setWinRateRange({ ...winRateRange, max: Number(text) || 0 })}
                    />
                  </View>
                </View>
              </>
            )
          }
        </View>

        <View style={{ gap: 10,marginBottom:20 }}>
          {/* Category */}
          <TouchableOpacity style={styles.section} onPress={() => toggleSection("category")}>
            <Text style={styles.sectionTitle}>Category</Text>
            <Ionicons name={expanded === "category" ? "chevron-up" : "chevron-down"} size={20} color="white" />
          </TouchableOpacity>
          {
            expanded === "category" && (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleCategoryToggle(item.name)}
                  >
                    <Text style={{ fontSize: 16, color: "white" }}>{item.name}</Text>
                    {selectedCategories.includes(item.name) && <Ionicons name="checkmark" size={20} color="yellow" />}
                  </TouchableOpacity>
                )}
              />
            )
          }
        </View>

        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyText}>Apply Filters</Text>
        </TouchableOpacity>
      </View >
    </Modal >
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: { height: 200, backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { backgroundColor: "#1E1E1E", padding: 20, borderRadius: 10, flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  headerText: { fontSize: 18, fontWeight: "bold", color: "white" },
  section: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 20, backgroundColor: "#2B2B2B", paddingHorizontal: 10, marginVertical: 10, borderRadius: 10 },
  sectionTitle: { fontSize: 16, color: "white" },
  checkboxContainer: { flexDirection: "row", justifyContent: "space-between", padding: 10 },
  buttonGroup: { flexDirection: "row", justifyContent: "space-evenly" },
  winRateButton: { padding: 10, borderWidth: 1, borderColor: "yellow", borderRadius: 5 },
  buttonText: {
    color: 'gray'
  },
  selectedWinRate: { backgroundColor: "yellow", color: "" },
  applyButton: { padding: 15, backgroundColor: "yellow", borderRadius: 10, marginTop: 20 },
  applyText: { textAlign: "center", fontSize: 16, color: "black", fontWeight: 900 },
  rangeContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, gap: 10 },
  rangeItem: { flex: 1 },
  rangeLabel: { fontSize: 14, color: "white", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "white", padding: 10, borderRadius: 5, color: "gray" },
  checkboxImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    borderRadius: 30
  }
});
