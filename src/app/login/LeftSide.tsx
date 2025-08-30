"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  getIdToken,
} from "firebase/auth";
import { completeRedirectIfNeeded, startSocialAuth } from "./socialAuthHandler";
import { useRouter, useSearchParams } from "next/navigation";

import AuthContainer from "./AuthContainer";
import { AuthProvider as AuthProviderEnum } from "@/constants/authProviders";
import { Box } from "@mui/material";
import LoginForm from "./LoginForm";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import SocialLoginButtons from "./SocialLoginButtons";
import { auth } from "@/config/firebase";
import { generalValidation } from "@/utils/generalValidation";
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

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Providers (Yahoo: no extra scope needed now that Email+Profile are enabled in Yahoo) ---
  const yahooProvider = new OAuthProvider("yahoo.com");
  yahooProvider.setCustomParameters({ prompt: "login" });

  const socialAuthConfigs = [
    { name: "Google", provider: new GoogleAuthProvider(), styleKey: "google" as const },
    { name: "Facebook", provider: new FacebookAuthProvider(), styleKey: "facebook" as const },
    { name: "Yahoo", provider: yahooProvider, styleKey: "yahoo" as const },
  ];

  // Complete redirect flow if we are returning from Yahoo/Google/Facebook
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Show spinner if we know we initiated a redirect previously
        if (typeof window !== "undefined" && sessionStorage.getItem("SOCIAL_REDIRECT_PENDING") === "1") {
          setIsLoading(true);
        }
        const completed = await completeRedirectIfNeeded(auth, userApi, userStore);
        if (completed && mounted) {
          router.replace(returnTo);
        }
      } catch (err: any) {
        console.error("Redirect auth failed:", err);
        if (mounted) setRequestError(err?.message || "Autentificarea a eșuat după redirect.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [router, returnTo, userApi, userStore]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sanitizePhoneNumber = (phone: string): string =>
    phone.replace(/\s+/g, "").replace(/[^+\d]/g, "");

  const handleSendOtp = async () => {
    try {
      setRequestError("");
      const sanitized = sanitizePhoneNumber(phoneNumber);
      if (!sanitized.startsWith("+")) {
        throw new Error("Numărul de telefon trebuie să includă prefixul internațional (ex: +40).");
      }
      await setupRecaptcha(auth, "recaptcha-container");
      const result = await sendOtp(auth, sanitized);
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
    } catch {
      setRequestError("Verificarea codului a eșuat. Te rugăm să încerci din nou.");
    }
  };

  const onSubmit = async () => {
    setFormErrors({ email: "", password: "" });
    const errors = generalValidation(validationSchema, formData);
    if (errors && typeof errors === "object") {
      setFormErrors(prev => ({ ...prev, ...errors }));
      return;
    }

    try {
      setIsLoading(true);
      setRequestError("");

      await loginWithEmailAndPassword(formData.email, formData.password);

      const authInstance = getAuth();
      const user = authInstance.currentUser;
      if (!user) throw new Error("Utilizatorul nu a fost găsit după autentificare.");

      const token = await getIdToken(user);
      if (!token) throw new Error("Nu s-a putut obține tokenul de autentificare.");

      const emailFromFirebase =
        user.email || user.providerData?.find(p => !!p.email)?.email || "";

      if (!emailFromFirebase) throw new Error("Autentificarea a eșuat: email-ul este obligatoriu.");

      const userByEmail = await userApi.getUserByEmail(emailFromFirebase);
      if (!userByEmail) throw new Error("Utilizatorul nu există în sistem.");

      userStore.setCurrentUser(userByEmail);
      router.replace(returnTo);
    } catch (error: any) {
      console.error("Autentificarea a eșuat:", error);
      setRequestError(error?.message || "Email sau parolă incorecte!");
    } finally {
      setIsLoading(false);
    }
  };

  const providerMap: Record<string, AuthProviderEnum> = {
    Google: AuthProviderEnum.GOOGLE,
    Facebook: AuthProviderEnum.FACEBOOK,
    Yahoo: AuthProviderEnum.YAHOO,
  };

  const handleSocialLogin = async (provider: any, authProviderName: string) => {
    const enumName = providerMap[authProviderName];
    if (!enumName) {
      setRequestError("Provider necunoscut.");
      return;
    }

    setIsLoading(true);
    setRequestError("");

    try {
      const mode = await startSocialAuth(auth, provider, userApi, userStore, enumName);
      // If we’re in redirect mode, the browser navigates away; no further action here.
      if (mode === "popup") {
        router.replace(returnTo);
      }
    } catch (error: any) {
      console.error(`Autentificare ${authProviderName} eșuată`, error);
      // If it wasn't a popup/redirect issue, show an error
      setRequestError(error?.message || "Autentificarea a eșuat. Încearcă din nou.");
    } finally {
      // Spinner OFF immediately unless the page is navigating (redirect mode)
      if (typeof window === "undefined" || sessionStorage.getItem("SOCIAL_REDIRECT_PENDING") !== "1") {
        setIsLoading(false);
      }
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