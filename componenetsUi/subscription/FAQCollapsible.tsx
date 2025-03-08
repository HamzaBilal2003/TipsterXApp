import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface FAQItem {
    question: string;
    answer: string;
}

type FAQCollapsibleProps = {
    faq: FAQItem;
};

const FAQCollapsible: React.FC<FAQCollapsibleProps> = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={[styles.container, isOpen && styles.activeContainer]}>
            <TouchableOpacity
                style={styles.heading}
                onPress={() => setIsOpen(!isOpen)}
                activeOpacity={0.8}>
                <Text style={styles.title}>{faq.question}</Text>
                <IconSymbol
                    name="chevron.right"
                    size={18}
                    weight="medium"
                    color={"white"}
                    style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
                />
            </TouchableOpacity>
            {isOpen && <Text style={styles.content}>{faq.answer}</Text>}
        </View>
    );
};

export default FAQCollapsible;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#222',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
    },
    activeContainer: {
        borderColor: '#FFD700',
        borderWidth: 1,
    },
    heading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
    content: {
        marginTop: 10,
        fontSize: 14,
        color: '#BBB',
    },
});