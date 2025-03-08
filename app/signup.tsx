import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Alert, KeyboardAvoidingView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import FloatingLabelInput from "@/componenetsUi/login/floatingLabelInput";
import DateOfBirthInput from "@/componenetsUi/signup/dateOfBirthInput";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/signupStyle";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authContext";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from 'expo-image-picker';
import { showTopToast } from "@/utils/helpers";
import { ApiError } from "@/utils/customApiCall";
import { register } from "@/utils/mutations/authMutations";
import { NavigationProp } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";


interface RegisterInputData {
    username: string;
    phone: string;
    email: string;
    dob: string;
    nationality: string;
    password: string;
    profileImage?: string;
}

const Register = () => {
    const router = useRouter();
    const { setToken, setUserData } = useAuth();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const currentYear = new Date().getFullYear();
    const { navigate, reset } = useNavigation<NavigationProp<any>>();
    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        phone: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .min(10, "Must be at least 10 digits")
            .required("Phone number is required"),
        email: Yup.string().email("Enter a valid email").required("Email is required"),
        day: Yup.number()
            .typeError("Day must be a number")
            .integer("Day must be a whole number")
            .min(1, "Day must be at least 1")
            .max(31, "Day cannot exceed 31")
            .required("Day is required"),
        month: Yup.number()
            .typeError("Month must be a number")
            .integer("Month must be a whole number")
            .min(1, "Month must be at least 1")
            .max(12, "Month cannot exceed 12")
            .required("Month is required"),
        year: Yup.number()
            .typeError("Year must be a number")
            .integer("Year must be a whole number")
            .min(1900, "Year must be at least 1900") // Set a minimum reasonable year
            .max(currentYear, `Year cannot exceed ${currentYear}`)
            .required("Year is required"),
        nationality: Yup.string().required("Nationality is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });

    const { mutate: handleRegister, isPending: registerPending } = useMutation({
        mutationFn: register,
        mutationKey: ["register"],
        onSuccess: async (data) => {
            const result = data?.data;
            // console.log("result Data : ", result)
            reset({
                index: 0,
                routes: [{ name: "verifyEmail" }],
            });
            navigate("verifyEmail", {
                context: "signup",
                email: result.email,
                otp: result.otp,
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

    const pickImage = async () => {
        // settimeout if the user click mulitple for that
        setTimeout(async () => {

            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission Denied",
                    "Permission to access media is required!"
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
                aspect: [1, 1],
            });

            if (!result.canceled && result.assets?.length > 0) {
                const imageUri = result.assets[0].uri;
                setProfileImage(imageUri);
                // console.log("Selected Profile Image:", imageUri); // Log directly
            }
        }, 1000);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <Text style={styles.title}>Register</Text>
                <Text style={styles.subtitle}>Create an account</Text>

                <Formik
                    initialValues={{
                        username: "",
                        phone: "",
                        email: "",
                        day: "",
                        month: "",
                        year: "",
                        nationality: "",
                        password: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        const formData = new FormData();
                        formData.append("username", values.username);
                        formData.append("phone", values.phone);
                        formData.append("email", values.email);
                        formData.append("dob", `${values.day}-${values.month}-${values.year}`);
                        formData.append("nationality", values.nationality);
                        formData.append("password", values.password);

                        if (profileImage) {
                            formData.append("profile_picture", {
                                uri: profileImage,
                                type: "image/jpeg",
                                name: "profile.jpg",
                            } as unknown as Blob);
                        } else {
                            showTopToast({
                                type: "error",
                                text1: "Error",
                                text2: "Please select a profile image",
                            });
                            return false;
                        }
                        // console.log(formData.get("profile_image"))
                        handleRegister(formData);
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <TouchableOpacity style={{ width: 100, height: 100, borderRadius: 100, backgroundColor: "#2B2B2B", marginVertical: 20, marginInline: "auto", alignItems: "center", justifyContent: "center" }} onPress={pickImage}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 100 }} />
                                )
                                    :
                                    <Ionicons name="camera-outline" size={50} color="white" />
                                }
                            </TouchableOpacity>
                            {profileImage && (
                                <Image source={{ uri: profileImage }} style={{}} />
                            )}

                            <FloatingLabelInput
                                label="Username"
                                value={values.username}
                                onChangeText={handleChange("username")}
                                onBlur={handleBlur("username")}
                                error={touched.username && errors.username ? errors.username : undefined}
                            />

                            <FloatingLabelInput
                                label="Phone number"
                                value={values.phone}
                                onChangeText={handleChange("phone")}
                                onBlur={handleBlur("phone")}
                                keyboardType="phone-pad"
                                error={touched.phone && errors.phone ? errors.phone : undefined}
                            />

                            <FloatingLabelInput
                                label="Email"
                                value={values.email}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                keyboardType="email-address"
                                error={touched.email && errors.email ? errors.email : undefined}
                            />

                            {/* Date of Birth Input */}
                            <DateOfBirthInput
                                day={values.day}
                                month={values.month}
                                year={values.year}
                                onChange={(field, value) => {
                                    handleChange(field)(value); // Ensure Formik updates the state correctly
                                }}
                                onBlur={(field) => {
                                    handleBlur(field); // Ensure Formik registers blur event correctly
                                }}
                                errors={{ day: errors.day, month: errors.month, year: errors.year }}
                                touched={{ day: touched.day, month: touched.month, year: touched.year }}
                            />

                            <FloatingLabelInput
                                label="Nationality"
                                value={values.nationality}
                                onChangeText={handleChange("nationality")}
                                onBlur={handleBlur("nationality")}
                                error={touched.nationality && errors.nationality ? errors.nationality : undefined}
                            />

                            <View style={styles.passwordContainer}>
                                <FloatingLabelInput
                                    label="Password"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    secureTextEntry={!passwordVisible}
                                    error={touched.password && errors.password ? errors.password : undefined}
                                />
                                <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                                    <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={24} color="gray" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.registerButton} onPress={() => handleSubmit()} disabled={registerPending}>
                                <Text style={styles.registerButtonText}>{registerPending ? "Registering..." : "Register"}</Text>
                            </TouchableOpacity>

                            <Text style={styles.registerText}>
                                Already have an account? <Link href={"/login"} style={styles.registerLink}>Login</Link>
                            </Text>
                        </>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Register;