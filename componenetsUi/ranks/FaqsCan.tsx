import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { Fetchfaqs } from '@/utils/queries/Rank';
import { useAuth } from '@/contexts/authContext';
import FAQs from '../subscription/Faqs';

const FaqsCan = () => {
    const {token} = useAuth();
    const { data: RanksData, isLoading: loadingStatus, error: geterror } = useQuery({
        queryKey: ['rank'],
        queryFn: () => Fetchfaqs(token),
    });
    const faqs = RanksData?.data;
    return (
        <FAQs Faqs={faqs} />
    )
}

export default FaqsCan

const styles = StyleSheet.create({})