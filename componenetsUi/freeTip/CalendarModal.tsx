import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfMonth, getDaysInMonth, addMonths, isBefore } from 'date-fns';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 64) / 7);
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarProps {
    onDateSelect: (date: string) => void;
    visible: boolean,
    onClose:() => void
}

export default function Calendar({ onDateSelect, visible,onClose }: CalendarProps) {
    const [isVisible, setIsVisible] = useState(visible);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysArray = useMemo(() => {
        const firstDay = startOfMonth(currentMonth);
        const daysInMonth = getDaysInMonth(currentMonth);
        const startingDayIndex = firstDay.getDay();

        const days = Array(startingDayIndex).fill(null);
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
        }
        return days;
    }, [currentMonth]);

    const handleDateSelect = (date: Date) => {
        const formattedDate = format(date, 'dd-MM-yyyy');
        setSelectedDate(date);
        onDateSelect(formattedDate);
        setIsVisible(false);
        onClose()
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const prevMonth = () => {
        const newMonth = addMonths(currentMonth, -1);
        if (!isBefore(newMonth, new Date())) {
            setCurrentMonth(newMonth);
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.dateButton} onPress={() => setIsVisible(true)}>
                <Text style={[styles.dateText, !selectedDate && styles.placeholder]}>
                    {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select Date'}
                </Text>
                <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Modal visible={isVisible} transparent animationType="slide" onRequestClose={() => {setIsVisible(false); onClose()}}>
                <View style={styles.modalContainer}>
                    <View style={styles.calendarContainer}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Select Date</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setIsVisible(false)}>
                                <Ionicons name="close" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.monthSelector}>
                            <TouchableOpacity style={styles.monthButton} onPress={prevMonth}>
                                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text style={styles.monthYear}>{MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Text>
                            <TouchableOpacity style={styles.monthButton} onPress={nextMonth}>
                                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.weekDaysContainer}>
                            {DAYS.map((day, index) => (
                                <View key={index} style={styles.weekDayCell}>
                                    <Text style={[styles.weekDay, index === 0 && styles.sunday]}>
                                        {day}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.daysGrid}>
                                {getDaysArray.map((date, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dayCell}
                                        onPress={() => date && handleDateSelect(date)}
                                        disabled={!date}
                                    >
                                        <Text style={styles.dayText}>{date ? date.getDate() : ''}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2B2B2B',
        borderRadius: 12,
        padding: 16,
    },
    dateText: { color: '#FFFFFF', fontSize: 16 },
    placeholder: { color: '#888888' },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    calendarContainer: {
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        padding: 16,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '600',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    monthButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    monthYearContainer: {
        alignItems: 'center',
        flex: 1,
    },
    monthYear: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    weekDaysContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    weekDayCell: {
        width: CELL_SIZE,
        alignItems: 'center',
        paddingVertical: 8,
    },
    weekDay: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    sunday: {
        color: '#FFE600',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // paddingHorizontal: 4,
    },
    dayCell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
    },
    dayText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
});