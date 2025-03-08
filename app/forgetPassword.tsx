import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingLabelInput from "@/componenetsUi/login/floatingLabelInput";
import { useNavigation, useRouter } from "expo-router";
import { forgotPassword } from "@/utils/mutations/authMutations";
import { useMutation } from "@tanstack/react-query";
import { showTopToast } from "@/utils/helpers";
import { NavigationProp } from "@react-navigation/native";
import { ApiError } from "@/utils/customApiCall";

const ForgetPassword = () => {
    const { goBack, navigate, reset } = useNavigation<NavigationProp<any>>();
    const router = useRouter();
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Enter a valid email")
            .required("Email is required")
    });

    const { mutate: handleVerify, isPending: registerPending } = useMutation({
        mutationFn: forgotPassword,
        mutationKey: ["forgetpassword"],
        onSuccess: async (data) => {
            const result = data?.data;
            // // console.log("result Data : ", result);
            reset({
                index: 0,
                routes: [{
                    name: "forgetPasswordCode",
                    params: {
                        email: result.email,
                        otp: result.otp
                    },
                }],
            });
        },
        onError: (error: ApiError) => {
            showTopToast({
                type: "error",
                text1: "Error",
                text2: error.message,
            });
        },
    });

    const handleCompleteSubmit = (email: string) => {
        // // console.log("Login Data:", email);
        handleVerify({ email });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Input e-mail address</Text>

            <Formik
                initialValues={{ email: "" }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    handleCompleteSubmit(values.email);
                    resetForm();
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: 20 }}>
                        {/* Email Input */}
                        <FloatingLabelInput
                            label="Input Email"
                            value={values.email}
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            keyboardType="email-address"
                            error={touched.email && errors.email ? errors.email : undefined}
                        />

                        {/* Login Button */}
                        <TouchableOpacity style={styles.loginButton} disabled={registerPending} onPress={handleSubmit}>
                            <Text style={styles.loginButtonText}>{registerPending ? "Proceeding..." : 'Proceed'}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default ForgetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: 'yellow',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
});