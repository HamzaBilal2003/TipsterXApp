import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/Loginstyle";
import FloatingLabelInput from "@/componenetsUi/login/floatingLabelInput";
import { useNavigation, useRouter } from "expo-router";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { FetchResetPassword } from "@/utils/mutations/authMutations";
import { showTopToast } from "@/utils/helpers";
import { ApiError } from "@/utils/customApiCall";

const ResetPassword = () => {
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const route = useRoute();
    const { goBack, navigate, reset } = useNavigation<NavigationProp<any>>();
    const { email, otp } = route.params as { email: string; otp: string; };
    // console.log("email and otp from reset: ", email, otp);
    // console.log("Route Params in resetPassword:", route.params);
    // ✅ Validation Schema
    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const { mutate: handleVerify, isPending: registerPending } = useMutation({
        mutationFn: (data: { email: string; password: string }) => FetchResetPassword(data.email, data.password),
        mutationKey: ["resetpassword"],
        onSuccess: async (data) => {
            const result = data?.data;
            // console.log("result Data : ", result);
            showTopToast({
                type: "success",
                text1: "Reset password",
                text2:  "Password reset successfully",
            });
            router.push('/login');
        },
        onError: (error: ApiError) => {
            showTopToast({
                type: "error",
                text1: "Error",
                text2: error.message,
            });
        },
    });

    const handleCompleteSubmit = (values: { password: string }) => {
        // console.log("Submitted Password:", { email, password: values.password });
        handleVerify({ email, password: values.password });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Add a new password</Text>

            <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    handleCompleteSubmit(values);
                    resetForm();
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={{ flex: 1, justifyContent: "space-between", paddingBottom: 20 }}>
                        <View>
                            {/* New Password Input */}
                            <FloatingLabelInput
                                label="New Password"
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                secureTextEntry={!passwordVisible}
                                error={touched.password && errors.password ? errors.password : undefined}
                            />

                            {/* Confirm Password Input */}
                            <FloatingLabelInput
                                label="Re-type Password"
                                value={values.confirmPassword}
                                onChangeText={handleChange("confirmPassword")}
                                onBlur={handleBlur("confirmPassword")}
                                secureTextEntry={!confirmPasswordVisible}
                                error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                            />
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, registerPending && { backgroundColor: '#ccc' }]}
                            onPress={handleSubmit}
                            disabled={registerPending}
                        >
                            <Text style={styles.loginButtonText}>
                                {registerPending ? "Processing..." : "Save"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default ResetPassword;