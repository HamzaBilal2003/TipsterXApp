import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import formatAmount from '../FormatAmount';

type PackageProps = {
    selectedPackage: number;
    setSelectedPackage: (pkg: number) => void;
    packages: {
        id: number;
        title: string;
        duration: string;
        amount: string;
        created_at: string;
        updated_at: string;
    }[];
};


const PackageSelector: React.FC<PackageProps> = ({ selectedPackage, packages, setSelectedPackage }) => {
    function searchAndCenter(packages: any[], searchTerm: string): any[] {
        const lowerSearchTerm = searchTerm.toLowerCase();

        // Filter the packages based on the duration (case insensitive)
        const filteredPackages = packages.filter(pkg =>
            pkg.duration.toLowerCase().includes(lowerSearchTerm)
        );

        if (filteredPackages.length === 0) return packages; // Return original if no match

        const remainingPackages = packages.filter(pkg =>
            !pkg.duration.toLowerCase().includes(lowerSearchTerm)
        );

        // Calculate the center index
        const centerIndex = Math.floor((packages.length - filteredPackages.length) / 2);

        // Place the filtered packages in the center
        return [
            ...remainingPackages.slice(0, centerIndex),
            ...filteredPackages,
            ...remainingPackages.slice(centerIndex)
        ];
    }
    const filteredPackages = searchAndCenter(packages, 'month');
    return (
        <View style={styles.packageContainer}>
            {filteredPackages.map((pkg) => (
                <TouchableOpacity
                    key={pkg.id}
                    style={[styles.packageBox, selectedPackage === pkg.id && styles.selectedPackage]}
                    onPress={() => setSelectedPackage(pkg.id)}
                >
                    {pkg?.discount && <Text style={styles.discountText}>{pkg?.discount}</Text>}
                    <Text style={styles.packageLabelTitle}>1</Text>
                    <Text style={styles.packageLabel}>{pkg.title.replace('One', '').replace('Package', '')}</Text>
                    <Text style={styles.packagePrice}>N {formatAmount(pkg.amount)}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default PackageSelector;

const styles = StyleSheet.create({
    packageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        gap: 20,
        paddingHorizontal: 20
    },
    packageBox: {
        paddingVertical: 10,
        backgroundColor: '#222',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: "center",
        flex: 1,
        position: "relative",
        gap: 10,
        minHeight: 130
    },
    selectedPackage: {
        borderColor: '#FFD700',
        borderWidth: 2
    },
    discountText: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 3,
        fontSize: 12,
        fontWeight: 'bold',
        borderRadius: 5,
        marginBottom: 5,
        position: 'absolute',
        top: -20
    },
    packageLabelTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: 900
    },
    packageLabel: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#FFF',
        textTransform: "capitalize",
        wordWrap: 'keep-all'
    },
    packagePrice: {
        fontSize: 14,
        color: '#FFF'
    },
});