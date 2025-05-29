"use client";

import { ChangeEvent, useState } from "react";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  getIdToken,
} from "firebase/auth";

import AuthContainer from "./AuthContainer";
import { AuthProvider } from "@/constants/authProviders";
import { Box } from "@mui/material";
import LoginForm from "./LoginForm";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import SocialLoginButtons from "./SocialLoginButtons";
import { auth } from "@/config/firebase";
import { generalValidation } from "@/utils/generalValidation";
import { handleSocialAuth } from "./socialAuthHandler";
import { observer } from "mobx-react";
import { styled } from "@mui/material/styles";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import validationSchema from "./authValidationSchema";

const Spinner = styled("div")(() => ({
  border: "6px solid #f3f3f3",
  borderTop: "6px solid #007bff",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  animation: "spin 1s linear infinite",
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
}));


const LeftSide = () => {
  const {
    emailAuthStore: { loginWithEmailAndPassword, errorMessage },
    phoneAuthStore: { setupRecaptcha, sendOtp, verifyPhoneOtp },
    userStore,
    appState,
  } = useStore();

  const userApi = appState.userAPi;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const router = useRouter();
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <-- FIXED

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

    const errors = generalValidation(validationSchema, formData);
    if (errors && typeof errors === "object") {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    try {
      setIsLoading(true);
      setRequestError("");

      await loginWithEmailAndPassword(formData.email, formData.password);

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not found after login.");

      const token = await getIdToken(user);
      if (!token) throw new Error("Failed to retrieve authentication token.");

      const userByEmail = await userApi.getUserByEmail(user.email || "");
      if (!userByEmail) throw new Error("User not found in the system.");

      userStore.setCurrentUser(userByEmail);
      setIsLoading(false);
      router.replace("/");
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      setRequestError("Email or password is incorrect!");
    }
  };

  const providerMap: Record<string, AuthProvider> = {
    Google:   AuthProvider.GOOGLE,    // "google.com"
    Facebook: AuthProvider.FACEBOOK,  // "facebook.com"
    Yahoo:    AuthProvider.YAHOO,     // "yahoo.com"
  };

  const handleSocialLogin = async (provider: any, authProviderName: string) => {
    try {
      const enumName = providerMap[authProviderName];
      if (!enumName) {
        throw new Error("Unknown social provider: " + authProviderName);
      }

      setIsLoading(true);
      
      await handleSocialAuth(auth, provider, userApi, userStore, enumName);
      router.replace("/");
    } catch (error) {
      console.error(`${authProviderName} login failed`, error);
      setIsLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: isMobile ? "center" : "normal",
    height: "100%",
    maxWidth: "480px",
    width: "100%",
    margin: "0 auto",
    backgroundColor: "var(--color-white)",
    borderRadius: "8px",
    position: "relative", // For overlay positioning
  };

  return (
    <div style={containerStyle}>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.8)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner />
        </Box>
      )}

      <AuthContainer>
        <LoginForm
          formData={formData}
          formErrors={formErrors}
          requestError={requestError || errorMessage}
          onChange={onChange}
          onSubmit={onSubmit}
          isLoading={isLoading} // optional: to disable button
        />
        <SocialLoginButtons
          socialAuthConfigs={socialAuthConfigs}
          onSocialLogin={handleSocialLogin}
        />
      </AuthContainer>
    </div>
  );
};

export default observer(LeftSide);