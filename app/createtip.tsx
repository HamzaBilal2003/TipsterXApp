import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Calendar from "@/componenetsUi/createTip/Calander";
import PasteInput from "@/componenetsUi/createTip/PasteInput";
import { Feather } from "@expo/vector-icons";
import CompanyDropDown from "@/componenetsUi/createTip/CompanyDropDown";
import CategoryDropDown from "@/componenetsUi/createTip/CategoryDropDown";
import SuccessModal from "@/componenetsUi/createTip/SuccessModal";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { AddTip } from "@/utils/mutations/TipAdd";
import { useAuth } from "@/contexts/authContext";
import { ApiError } from "@/utils/customApiCall";
import { showTopToast } from "@/utils/helpers";
import { useRouter } from "expo-router";
import Loader from "@/componenetsUi/Loader";

const CreateTip = () => {
    const route = useRouter();
    const { token, userData } = useAuth();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validationSchema = Yup.object().shape({
        matchDate: Yup.string().required("Match date is required"),
        bookingCode: Yup.string().required("Booking code is required"),
        ods: Yup.string().required("Number of odds is required"),
        company: Yup.string().required("Company is required"),
        category: Yup.array().min(1, "At least one category is required").required('Category is required'),
    });

    const { mutate: handleAddTip, isPending: addPostPending } = useMutation({
        mutationKey: ["addtip"],
        mutationFn: ({ formdata, token }: { formdata: any; token: string }) => AddTip(formdata, token),
        onSuccess: async (data) => {
            const result = data?.data;
            setShowSuccessModal(true);
        },
        onError: (error: ApiError) => {
            showTopToast({
                type: "error",
                text1: "Error",
                text2: error.message,
            });
        },
    });

    const handleSubmit = (values: any) => {
        const formdata = {
            codes: values.bookingCode,
            ods: values.ods,
            betting_company_id: values.company,
            betting_category: values.category.join(","),
            match_date: values.matchDate,
        };
        handleAddTip({ formdata, token });
    };

    return (
        <SafeAreaView style={{ paddingHorizontal: 15, flex: 1 }}>
            <Formik
                initialValues={{
                    matchDate: "",
                    bookingCode: "",
                    ods: "",
                    company: "",
                    category: [],
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                    <>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ gap: 20, paddingTop: 20 }}>
                                <Calendar
                                    onDateSelect={(date: string) => setFieldValue("matchDate", date)}
                                />
                                {touched.matchDate && errors.matchDate && (
                                    <Text style={styles.errorText}>{errors.matchDate}</Text>
                                )}

                                <CompanyDropDown
                                    onSelect={(company: string) => setFieldValue("company", company)}
                                />
                                {touched.company && errors.company && (
                                    <Text style={styles.errorText}>{errors.company}</Text>
                                )}

                                <PasteInput
                                    setBookingDate={(code: string) => setFieldValue("bookingCode", code)}
                                />
                                {touched.bookingCode && errors.bookingCode && (
                                    <Text style={styles.errorText}>{errors.bookingCode}</Text>
                                )}

                                <CategoryDropDown
                                    onSelect={(categories: string[]) => setFieldValue("category", categories)}
                                />
                                {touched.category && errors.category && (
                                    <Text style={styles.errorText}>{errors.category}</Text>
                                )}

                                <PasteInput
                                    setBookingDate={(code: string) => setFieldValue("ods", code)}
                                    placeholder="Number of Odds"
                                />
                                {touched.ods && errors.ods && (
                                    <Text style={styles.errorText}>{errors.ods}</Text>
                                )}

                                <View style={styles.alertCan}>
                                    <Feather name="alert-circle" size={24} color="yellow" />
                                    <Text style={styles.alertText}>
                                        Please note that all sports tips must be submitted at least two days before the match is played. For accumulator tips, all selected matches must take place on the same day. Additionally, you can submit a maximum of three tips per day.
                                    </Text>
                                </View>
                            </View>
                            <Pressable
                                style={[styles.createTipButton]}
                                disabled={addPostPending}
                                onPress={() => handleSubmit()}
                            >
                                {addPostPending ? (
                                    <Loader color="black" />
                                ) : (
                                    <Text style={styles.createTipButtonText}>Submit Tip</Text>
                                )}
                            </Pressable>
                        </ScrollView>

                        <SuccessModal
                            visible={showSuccessModal}
                            onClose={() => setShowSuccessModal(false)}
                        />
                    </>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default CreateTip;

const styles = StyleSheet.create({
    selectedDateText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
    createTipButton: {
        backgroundColor: "#FFE600",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginVertical: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    createTipButtonText: {
        color: "#000000",
        fontSize: 18,
        fontWeight: "600",
    },
    alertCan: {
        backgroundColor: "rgba(255, 230, 0, 0.1)",
        borderWidth: 1,
        borderColor: "#FFE600",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
    },
    alertText: {
        color: "white",
        fontSize: 14,
        flex: 1,
        lineHeight: 20,
    },
    errorText: {
        color: "#FF453A",
        fontSize: 12,
        marginTop: 4,
    },
});