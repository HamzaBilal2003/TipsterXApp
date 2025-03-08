import { useAuth } from '@/contexts/authContext';
import { ApiError } from '@/utils/customApiCall';
import { showTopToast } from '@/utils/helpers';
import { subscriptions } from '@/utils/queries/subscription';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import FormatAmount from '../FormatAmount';

type SubscriptionSummaryProps = {
  selectedPackage: number;
  activePackage: number;
  packages: {
    id: number;
    title: string;
    duration: string;
    amount: string;
    created_at: string;
    updated_at: string;
  }[];
};

const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({ selectedPackage, activePackage, packages }) => {
  const { token } = useAuth();
  const route = useRouter();
  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
  const isSubscribed = selectedPackage === activePackage;
  const { mutate: handleAddPost, isPending: addPostPending } = useMutation({
    mutationKey: ["subscribe"],
    mutationFn: ({ packageId, token }: { packageId: number; token: string }) => subscriptions(packageId, token),
    onSuccess: async (data) => {
      showTopToast({
        type: "success",
        text1: "success",
        text2: data.message,
      });
      setTimeout(() => {
        const result = data?.data;
        // console.log("Post added successfully:", result);
        route.push("/(tabs)")
      }, 2000);
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });
  const handleSubscription = (packageId : number) => {
      handleAddPost({ packageId, token });
  }
  return (
    <View style={styles.summaryContainer}>
      {selectedPkg && (
        <TouchableOpacity style={[styles.subscribeButton, isSubscribed && styles.disabledButton]} disabled={isSubscribed} onPress={()=>handleSubscription(selectedPkg.id)}>
          {isSubscribed && <Image source={require('@/assets/images/checkA.png')} style={styles.checkIcon} />}
          <Text style={[styles.subscribeText, isSubscribed && styles.disabledButtonText]}>
            {isSubscribed ? `${selectedPkg.title} subscription active` : `Get 1 ${selectedPkg.title.replace("One",'')} For N ${FormatAmount(selectedPkg.amount)}`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SubscriptionSummary;

const styles = StyleSheet.create({
  summaryContainer: {
    marginVertical: 20,
  },
  activeText: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 10,
  },
  subscribeButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row"
  },
  disabledButton: {
    backgroundColor: '#222',
  },
  disabledButtonText: {
    color: 'white'
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  checkIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginHorizontal: 10,
  }
});