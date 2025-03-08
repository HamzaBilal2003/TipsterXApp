import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubscriptionHeader from '@/componenetsUi/subscription/SubscriptionHeader';
import PackageSelector from '@/componenetsUi/subscription/PackageSelector';
import SubscriptionSummary from '@/componenetsUi/subscription/SubscriptionSummary';
import FAQs from '../componenetsUi/subscription/Faqs';
import { View } from 'react-native';
import { useAuth } from '@/contexts/authContext';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchPackage } from '@/utils/queries/subscription';

const Subscription: React.FC = () => {
    const faqs = [
        { question: 'When will I be billed', answer: 'You will be billed at the start of your subscription period.' },
        { question: 'Do I get promotions', answer: 'You can get special promotions that are offered on some particular days or months.' }
    ];
    const { token } = useAuth();
    const { data: packagesData, isLoading: loadingStatus, error: geterror } = useSuspenseQuery({
        queryKey: ['packages'],
        queryFn: () => fetchPackage(token),
    });
    // console.log("packages Data", packagesData?.data);
    const fetchPackages = packagesData?.data;

    const [selectedPackage, setSelectedPackage] = useState<number>(1);
    const [activePackage, setActivePackage] = useState<number>(0);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <SubscriptionHeader />
            <PackageSelector selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} packages={fetchPackages || []} />
            <SubscriptionSummary selectedPackage={selectedPackage} activePackage={activePackage} packages={fetchPackages || []} />
            <View style={{ margin: 20,marginTop:50 }}>
                <FAQs Faqs={faqs} heading={true} />
            </View>
        </SafeAreaView>
    );
};

export default Subscription;