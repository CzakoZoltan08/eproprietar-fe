"use client";

import { ChangeEvent, useState } from "react";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  getIdToken,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  const rawReturnTo = searchParams.get("returnTo");
  const returnTo = rawReturnTo?.startsWith("/") ? rawReturnTo : "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        throw new Error("Numărul de telefon trebuie să includă prefixul internațional (ex: +40).");
      }
      await setupRecaptcha(auth, "recaptcha-container");
      const result = await sendOtp(auth, sanitizedPhoneNumber);
      setConfirmationResult(result);
      setIsOtpSent(true);
    } catch (error: any) {
      console.error("Eroare la trimiterea codului OTP:", error);
      setRequestError(error.message || "Nu s-a putut trimite codul. Încearcă din nou.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!confirmationResult) throw new Error("Rezultatul confirmării OTP lipsește.");
      await verifyPhoneOtp(confirmationResult, otp);
      router.replace(returnTo);
    } catch (error) {
      setRequestError("Verificarea codului a eșuat. Te rugăm să încerci din nou.");
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
      if (!user) throw new Error("Utilizatorul nu a fost găsit după autentificare.");

      const token = await getIdToken(user);
      if (!token) throw new Error("Nu s-a putut obține tokenul de autentificare.");

      const userByEmail = await userApi.getUserByEmail(user.email || "");
      if (!userByEmail) throw new Error("Utilizatorul nu există în sistem.");

      userStore.setCurrentUser(userByEmail);
      setIsLoading(false);
      router.replace(returnTo);
    } catch (error) {
      console.error("Autentificarea a eșuat:", error);
      setIsLoading(false);
      setRequestError("Email sau parolă incorecte!");
    }
  };

  const providerMap: Record<string, AuthProvider> = {
    Google: AuthProvider.GOOGLE,
    Facebook: AuthProvider.FACEBOOK,
    Yahoo: AuthProvider.YAHOO,
  };

  const handleSocialLogin = async (provider: any, authProviderName: string) => {
    try {
      const enumName = providerMap[authProviderName];
      if (!enumName) {
        throw new Error("Provider necunoscut: " + authProviderName);
      }

      setIsLoading(true);

      await handleSocialAuth(auth, provider, userApi, userStore, enumName);
      router.replace(returnTo);
    } catch (error) {
      console.error(`Autentificare ${authProviderName} eșuată`, error);
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
    position: "relative",
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
          isLoading={isLoading}
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