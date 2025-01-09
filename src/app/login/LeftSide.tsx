"use client";

import { Box, Divider, Typography } from "@mui/material";
import { COLOR_RED_BUTTON, COLOR_RED_BUTTON_HOVER } from "@/constants/colors";
import { ChangeEvent, useState } from "react";
import {
  getAuth,
  getIdToken,
  onAuthStateChanged,
} from "firebase/auth";

import { CommonButton } from "@/common/button/CommonButton";
import { Container } from "@/style/authStyledComponents";
import { ErrorText } from "@/style/formStyledComponents";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import Image from "next/image";
import { InputField } from "@/common/input/InputField";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import { StorageKeys } from "@/constants/storageKeys";
import YahooIcon from "@mui/icons-material/Mail";
import { auth } from "@/config/firebase";
import { generalValidation } from "@/utils/generalValidation";
import logo from "@/assets/logo.svg";
import { observer } from "mobx-react";
import styles from "./LeftSide.module.css";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import validationSchema from "./authValidationSchema";
import AuthContainer from "./AuthContainer";
import SocialLoginButtons from "./SocialLoginButtons";
import OtpVerification from "./OtpVerification";
import LoginForm from "./LoginForm";

const LeftSide = () => {
  const {
    emailAuthStore: { loginWithEmailAndPassword, errorMessage },
    phoneAuthStore: { setupRecaptcha, sendOtp, verifyPhoneOtp },
    googleAuthStore: { loginWithGoogle },
    facebookAuthStore: { loginWithFacebook },
    yahooAuthStore: { loginWithYahoo },
    userStore: { setCurrentUser },
  } = useStore();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);


  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [requestError, setRequestError] = useState("");
  const [, setIsLoading] = useState(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    await loginWithGoogle();
    router.replace("/");
  };

  const sanitizePhoneNumber = (phone: string): string => {
    return phone.replace(/\s+/g, "").replace(/[^+\d]/g, "");
  };
  
  const handleSendOtp = async () => {
    try {
      setRequestError("");
  
      // Sanitize phone number input
      const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);
  
      if (!sanitizedPhoneNumber.startsWith("+")) {
        throw new Error("Phone number must include the country code (e.g., +40).");
      }
  
      await setupRecaptcha(auth, "recaptcha-container");
      const result = await sendOtp(auth, sanitizedPhoneNumber);
      setConfirmationResult(result);
      setIsOtpSent(true);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      setRequestError(error.message || "Failed to send OTP. Please try again.");
    }
  };
  
  const handleVerifyOtp = async () => {
    try {
      if (!confirmationResult) throw new Error("No OTP confirmation result found.");
      await verifyPhoneOtp(confirmationResult, otp);
      router.replace("/");
    } catch (error) {
      setRequestError("Failed to verify OTP. Please try again.");
    }
  };

  const onSubmit = async () => {
    setFormErrors({ email: "", password: "" });
  
    // Validate form data
    const errors = generalValidation(validationSchema, formData);
    if (errors && typeof errors === "object") {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return;
    }
  
    try {
      setIsLoading(true);
      setRequestError("");
  
      await loginWithEmailAndPassword(formData.email, formData.password);
  
      // Use Firebase onAuthStateChanged to confirm login success before redirect
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          if (token && typeof window !== "undefined") {
            localStorage.setItem(StorageKeys.token, token);
          }
          const userModel = {
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ")[1] || "",
            firebaseId: user.uid,
            email: user.email || "",
          };
          setCurrentUser(userModel); // Update the global user state
          setIsLoading(false); // Hide loading indicator
          unsubscribe(); // Unsubscribe from the auth state listener
          router.replace("/"); // Redirect to the homepage
        }
      });
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false); // Hide loading indicator
      setRequestError("Email or password is incorrect!"); // Show error to the user
    }
  };

  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  const containerStyle: React.CSSProperties = {
    display: "flex", // Use flexbox
    flexDirection: "column", // Stack items vertically
    justifyContent: "center", // Center items vertically
    alignItems: "center", // Center items horizontally
    height: "100%", // Ensure the container spans the full height of its parent
    maxWidth: "480px", // Limit width for desktop
    width: "100%", // Full width on smaller screens
    margin: "0 auto", // Center horizontally in its parent
    backgroundColor: "var(--color-white)", // Set background color
    borderRadius: "8px", // Add rounded corners
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional shadow for desktop
  };

  return (
    <div style={containerStyle}>
      <AuthContainer>
        <LoginForm
          formData={formData}
          formErrors={formErrors}
          requestError={requestError || errorMessage}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <SocialLoginButtons
          handleGoogleLogin={loginWithGoogle}
          handleFacebookLogin={loginWithFacebook}
          handleYahooLogin={loginWithYahoo}
          isMobile={isMobile}
        />
        <OtpVerification
          isOtpSent={isOtpSent}
          phoneNumber={phoneNumber}
          otp={otp}
          onPhoneNumberChange={setPhoneNumber}
          onOtpChange={setOtp}
          handleSendOtp={handleSendOtp}
          handleVerifyOtp={handleVerifyOtp}
        />
      </AuthContainer>
    </div>
  );
};

export default observer(LeftSide);