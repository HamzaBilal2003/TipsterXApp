import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabSelectorProps {
  activeTab: 'profile' | 'bank';
  onTabChange: (tab: 'profile' | 'bank') => void;
}

export default function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
        onPress={() => onTabChange('profile')}
      >
        <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
          Profile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'bank' && styles.activeTab]}
        onPress={() => onTabChange('bank')}
      >
        <Text style={[styles.tabText, activeTab === 'bank' && styles.activeTabText]}>
          Bank Details
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 21,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFE600',
  },
  tabText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000000',
  },
});