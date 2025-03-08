import React, { useState, useEffect } from "react";
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
import { styles as verifyStyle } from '@/styles/verifyStyle';
import { useRouter } from "expo-router";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword, verifyPasswordOtp } from "@/utils/mutations/authMutations";
import { useNavigation } from "expo-router";
import { showTopToast } from "@/utils/helpers";
import { ApiError } from "@/utils/customApiCall";

const ForgetPasswordCode = () => {
  const [timer, setTimer] = useState(60); // Initial countdown
  const [codeSent, setCodeSent] = useState(false);
  const router = useRouter();
  const route = useRoute();
  const { goBack, navigate, reset } = useNavigation<NavigationProp<any>>();
  const { email, otp } = route.params as { email: string; otp: string; };
  // // console.log("Route Params in ForgetPasswordCode:", route.params);

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
  const { mutate: handleResendOtp, isPending: resendPending } = useMutation({
    mutationFn: forgotPassword,
    mutationKey: ["resendPassword"],
    onSuccess: async (data) => {
      const result = data?.data;
      // // console.log("result Data : ", result.otp);
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
    handleResendOtp({ email });
  }

  const { mutate: handleVerify, isPending: registerPending } = useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyPasswordOtp(data.email, data.otp),
    mutationKey: ["forgetpassword"],
    onSuccess: async (data) => {
      const result = data?.data;
      // // console.log("result Data email passoword: ", result.email, result.otp);
      reset({
        index: 0,
        routes: [{
          name: "resetPassword",
          params: {
            email: email,
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

  const handleCompleteSubmit = (value: string) => {
    // // console.log("Submitted Code:", value);
    handleVerify({ email, otp: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter the verification code</Text>

      <Formik
        initialValues={{ code: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          handleCompleteSubmit(values.code);
          resetForm();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={{ flex: 1, justifyContent: "space-between", paddingBottom: 20 }}>
            {/* Code Input */}
            <View>
              <FloatingLabelInput
                label="Enter Code"
                value={values.code}
                onChangeText={handleChange("code")}
                onBlur={handleBlur("code")}
                keyboardType="number-pad"
                maxLength={6}
                error={touched.code && errors.code ? errors.code : undefined}
              />

              {/* Timer / Resend Code */}
              {timer > 0 ? (
                <Text style={[verifyStyle.timerText, { alignSelf: "center" }]}>
                  Code will be resent in{" "}
                  <Text style={verifyStyle.timerNumber}>{timer}s</Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResent} style={{ alignSelf: "center" }} disabled={resendPending}>
                  <Text style={[verifyStyle.timerText, { color: "#FFD700" }]}>
                    {resendPending ? "Resending code ..." : "Resend Code"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Proceed Button */}
            <TouchableOpacity
              style={[styles.loginButton, registerPending && { backgroundColor: '#ccc' }]}
              onPress={handleSubmit}
              disabled={registerPending}
            >
              <Text style={styles.loginButtonText}>
                {registerPending ? "Processing..." : "Proceed"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default ForgetPasswordCode;