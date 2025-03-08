import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/Loginstyle";
import FloatingLabelInput from "@/componenetsUi/login/floatingLabelInput";
import { Link, useNavigation, useRouter } from "expo-router";
import { loginUser } from "@/utils/mutations/authMutations";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authContext";
import * as SecureStore from "expo-secure-store";
import { showTopToast } from "@/utils/helpers";
import { ApiError } from "@/utils/customApiCall";
import { NavigationProp } from "@react-navigation/native";

const Login = () => {

    const TOKEN_KEY = "USER_TOKEN";
    const USER_DATA_KEY = "USER_DATA";
    const { reset, navigate } = useNavigation<NavigationProp<any>>();

    const router = useRouter()
    const { setToken, setUserData } = useAuth();
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Enter a valid email")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });
    const { mutate: handleLogin, isPending: loginPending } = useMutation({
        mutationFn: loginUser,
        mutationKey: ["login"],
        onSuccess: async (data) => {
            // // console.log(data);
            const result=data?.data;
            const { token, user: user } = result;
            setToken(token);
            setUserData(user);
            await SecureStore.setItemAsync(TOKEN_KEY, token);
            await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
            router.push('/(tabs)')
        },
        onError: (error: ApiError) => {
            showTopToast({
                type: "error",
                text1: "Error",
                text2: error.message,
            });
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Login to your account</Text>

            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    // // console.log("Login Data:", values);
                    handleLogin(values)
                    // resetForm();
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        {/* Email Input */}
                        <FloatingLabelInput
                            label="Email"
                            value={values.email}
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            keyboardType="email-address"
                            error={touched.email && errors.email ? errors.email : undefined}
                        />

                        {/* Password Input */}
                        <FloatingLabelInput
                            label="Password"
                            value={values.password}
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            secureTextEntry
                            error={touched.password && errors.password ? errors.password : undefined}
                        />

                        {/* Forgot Password Link */}
                        <Link href={"/forgetPassword"} style={{ alignSelf: "flex-end", marginBlock: 10 }}>
                            <Text style={styles.forgotPassword}>Forgot password?</Text>
                        </Link>

                        {/* Login Button */}
                        <TouchableOpacity style={styles.loginButton} disabled={loginPending} onPress={() => handleSubmit()}>
                            <Text style={styles.loginButtonText}>
                                {loginPending ? " Loading..." :"Login"}</Text>
                        </TouchableOpacity>

                        {/* Register Link */}
                        <Text style={styles.registerText}>
                            Don't have an account? <Link href={"/signup"} style={styles.registerLink}>Register</Link>
                        </Text>
                    </>
                )}
            </Formik>
        </SafeAreaView>
    );
};

// 🔹 Custom Floating Label Input Component


export default Login;
