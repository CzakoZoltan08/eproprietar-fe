"use client";

import { ChangeEvent, useState } from "react";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  getIdToken,
  onAuthStateChanged,
} from "firebase/auth";

import AuthContainer from "./AuthContainer";
import { AuthProvider } from "@/constants/authProviders";
import LoginForm from "./LoginForm";
import OtpVerification from "./OtpVerification";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import SocialLoginButtons from "./SocialLoginButtons";
import { StorageKeys } from "@/constants/storageKeys";
import { auth } from "@/config/firebase";
import { generalValidation } from "@/utils/generalValidation";
import { handleSocialAuth } from "./socialAuthHandler";
import { observer } from "mobx-react";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import validationSchema from "./authValidationSchema";

const LeftSide = () => {
  const {
    emailAuthStore: { loginWithEmailAndPassword, errorMessage },
    phoneAuthStore: { setupRecaptcha, sendOtp, verifyPhoneOtp },
    userStore,
    appState,
  } = useStore();
  
  const userApi = appState.userAPi; // Extract userApi from appState

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

  const socialAuthConfigs = [
    {
      name: "Google",
      provider: new GoogleAuthProvider(),
      styleKey: "google" as "google",
    },
    {
      name: "Facebook",
      provider: new FacebookAuthProvider(),
      styleKey: "facebook" as "facebook",
    },
    {
      name: "Yahoo",
      provider: new OAuthProvider(AuthProvider.YAHOO),
      styleKey: "yahoo" as "yahoo",
    },
  ];

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  
      // Attempt to log in using Firebase
      await loginWithEmailAndPassword(formData.email, formData.password);
  
      // Confirm Firebase login success and retrieve the user
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        throw new Error("User not found after login.");
      }
  
      // Get Firebase token
      const token = await getIdToken(user);
      if (!token) {
        throw new Error("Failed to retrieve authentication token.");
      }
  
      // Retrieve user from backend to confirm existence
      const userByEmail = await userApi.getUserByEmail(user.email || "");
      if (!userByEmail) {
        throw new Error("User not found in the system.");
      }
  
      // Store token and update global user state
      if (typeof window !== "undefined") {
        localStorage.setItem(StorageKeys.token, token);
      }
      userStore.setCurrentUser(userByEmail);
  
      setIsLoading(false); // Hide loading indicator
      router.replace("/"); // Redirect to the homepage
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false); // Hide loading indicator
      setRequestError("Email or password is incorrect!"); // Show error to the user
  
      // Ensure token is removed if login fails
      if (typeof window !== "undefined") {
        localStorage.removeItem(StorageKeys.token);
      }
    }
  };

  const handleSocialLogin = async (provider: any, authProviderName: string) => {
    try {
      await handleSocialAuth(auth, provider, userApi, userStore, authProviderName);
      router.replace("/"); // Redirect to the home page
    } catch (error) {
      console.error(`${authProviderName} login failed`, error);
    }
  };

  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  const containerStyle: React.CSSProperties = {
    display: "flex", // Use flexbox
    flexDirection: "column", // Stack items vertically
    justifyContent: "center", // Center items vertically
    alignItems: isMobile ? "center" : "normal", // Center items horizontally
    height: "100%", // Ensure the container spans the full height of its parent
    maxWidth: "480px", // Limit width for desktop
    width: "100%", // Full width on smaller screens
    margin: "0 auto", // Center horizontally in its parent
    backgroundColor: "var(--color-white)", // Set background color
    borderRadius: "8px", // Add rounded corners
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
          socialAuthConfigs={socialAuthConfigs}
          onSocialLogin={handleSocialLogin}
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