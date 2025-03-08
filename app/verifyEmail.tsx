import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/Loginstyle";
import FloatingLabelInput from "@/componenetsUi/login/floatingLabelInput";
import { styles as timerstyle } from "@/styles/verifyStyle";
import { NavigationProp, useRoute } from '@react-navigation/native';
import { useNavigation } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { showTopToast } from "@/utils/helpers";
import { ApiError } from "@/utils/customApiCall";
import { forgotPassword, verifyEmailOtp } from "@/utils/mutations/authMutations";


const ForgetPasswordCode = () => {
  const { goBack, navigate, reset } = useNavigation<NavigationProp<any>>();
  const [timer, setTimer] = useState(60); // Initial countdown
  const [codeSent, setCodeSent] = useState(false);
  const route = useRoute();
  const { context, email, otp } = route.params as { context: string; email: string; otp: string };
  // ⏳ Countdown Timer for Resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 📩 Resend Code Handler
  const handleResendCode = () => {
    setTimer(60); // Reset timer
    setCodeSent(true);
  };
  // ✅ Validation Schema
  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .required("Code is required"),
  });
  const { mutate: handleVerify, isPending: resendPending } = useMutation({
    mutationFn: forgotPassword,
    mutationKey: ["forgetpassword"],
    onSuccess: async (data) => {
      const result = data?.data;
      // console.log("result Data : ", result.otp);
      showTopToast({
        type: "success",
        text1: "success",
        text2: "The code is send to your email",
      });
      handleResendCode()
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });
  const handleResent = () => {
    handleVerify({ email });
  }

  const { mutate: hanldeVerifyOtp, isPending: registerPending } = useMutation({
    mutationFn: verifyEmailOtp,
    mutationKey: ["otpVerify"],
    onSuccess: async (data) => {
      const result = data?.data;
      // console.log("result Data : ", result.otp)
      reset({
        index: 0,
        routes: [{ name: "login" }],
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



  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Verify E-Mail</Text>
      <Text style={styles.subtitle}>A 5-Digit code has been sent to your email</Text>

      <Formik
        initialValues={{ code: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          Alert.alert("Submitted Code:", values.code);
          hanldeVerifyOtp({ otp: values.code, email: email })
          // resetForm();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={{ flex: 1, justifyContent: "space-between", paddingBottom: 20 }}>
            {/* Code Input */}
            <View style={{ gap: 10 }}>
              <FloatingLabelInput
                label="Enter Code"
                value={values.code}
                onChangeText={handleChange("code")}
                onBlur={handleBlur("code")}
                keyboardType="number-pad"
                error={touched.code && errors.code ? errors.code : undefined}
              />

              {/* Timer / Resend Code */}
              {timer > 0 ? (
                <Text style={timerstyle.timerText}>
                  Resent code in{" "}
                  <Text style={timerstyle.timerNumber}>{timer}s</Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResent} disabled={resendPending}>
                  <Text style={[timerstyle.timerText, { color: "#FFD700" }]}>
                    {resendPending ? "Resending code..." : "Resend Code"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Proceed Button */}
            <TouchableOpacity style={styles.loginButton} disabled={registerPending} onPress={() => handleSubmit()}>
              <Text style={styles.loginButtonText}>{registerPending ? "Proceeding..." : "Proceed"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default ForgetPasswordCode;
