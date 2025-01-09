"use client";

import { Box, Divider, Typography } from "@mui/material";
import { COLOR_RED_BUTTON, COLOR_RED_BUTTON_HOVER } from "@/constants/colors";
import { ChangeEvent, useState } from "react";
import {
  GoogleAuthProvider,
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
import { googleAuth } from "@/config/firebase";
import logo from "@/assets/logo.svg";
import { observer } from "mobx-react";
import styles from "./LeftSide.module.css";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import validationSchema from "./authValidationSchema";

const LeftSide = () => {
  const {
    authStore: { loginWithGoogle, loginWithFacebook, loginWithYahoo, signInEmailAndPassword, errorMessage, setupRecaptcha, sendPhoneOtp, verifyPhoneOtp },
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

  const handleLogin = async (provider: GoogleAuthProvider) => {
    await loginWithGoogle(provider);
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
      const result = await sendPhoneOtp(auth, sanitizedPhoneNumber);
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
      await signInEmailAndPassword(formData.email, formData.password);

      const auth = getAuth();
      onAuthStateChanged(auth, async (user: any) => {
        if (user) {
          const token = await getIdToken(user);
          if (token && typeof window !== "undefined") {
            localStorage.setItem(StorageKeys.token, token);
          }
          setCurrentUser(user);
          setIsLoading(false);
          router.replace("/");
        }
      });
    } catch {
      setIsLoading(false);
      setRequestError("Email or password is incorrect!");
    }
  };

  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  return (
    <Container
      className={isMobile ? styles.container : styles["container-desktop"]}
    >
      {isMobile && (
        <Image src={logo} alt="eproprietar" width={152} style={{ marginTop: "32px" }} />
      )}
  
      <Typography variant="h4" className={styles.title}>
        Log in
      </Typography>
  
      <Box className={styles["form-container"]}>
        <Box className={styles["input-field-container"]}>
          <InputField
            label="Email"
            name="email"
            value={formData.email}
            onChange={onChange}
            helperText={formErrors.email}
          />
          <InputField
            label="Password"
            name="password"
            value={formData.password}
            onChange={onChange}
            helperText={formErrors.password}
            type="password"
          />
          {(requestError || errorMessage) && (
            <ErrorText>{requestError || errorMessage}</ErrorText>
          )}
        </Box>
  
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography
            variant="subtitle1"
            className={styles.link}
            onClick={() => router.push("/forgot-password")}
          >
            Forgot Password
          </Typography>
          <Typography
            variant="subtitle1"
            className={styles.link}
            onClick={() => router.push("/register")}
          >
            Register
          </Typography>
        </Box>
  
        <Box>
          <PrimaryButton onClick={onSubmit} text="Log in" size="large" />
        </Box>
  
        <Divider>or</Divider>
  
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Google Button */}
          <CommonButton
            onClick={() => handleLogin(googleAuth)}
            text={isMobile ? "Google" : "Sign in with Google"}
            size="large"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{
              backgroundColor: COLOR_RED_BUTTON,
              "&:hover": {
                backgroundColor: COLOR_RED_BUTTON_HOVER,
              },
            }}
          />

          {/* Facebook Button */}
          <CommonButton
            onClick={() => loginWithFacebook()}
            text={isMobile ? "Facebook" : "Sign in with Facebook"}
            size="large"
            fullWidth
            startIcon={<FacebookIcon />}
            sx={{
              whiteSpace: "nowrap",
              backgroundColor: "#3b5998", // Facebook's blue
              "&:hover": {
                backgroundColor: "#2d4373", // Darker shade of Facebook's blue
              },
            }}
          />

          {/* Yahoo Button */}
          <CommonButton
            onClick={() => loginWithYahoo()}
            text={isMobile ? "Yahoo" : "Sign in with Yahoo"}
            size="large"
            fullWidth
            startIcon={<YahooIcon />}
            sx={{
              whiteSpace: "nowrap",
              backgroundColor: "#6001D2", // Yahoo's purple
              "&:hover": {
                backgroundColor: "#4b0091", // Darker shade of Yahoo's purple
              },
            }}
          />
        </Box>

        <Divider>or</Divider>

        <Box display="flex" flexDirection="column" gap={2}>
          {!isOtpSent ? (
            <>
              <InputField
                label="Phone Number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1XXXXXXXXXX"
              />
              <Box>
                <PrimaryButton onClick={handleSendOtp} text="Trimite cod SMS pentru verificare" size="large" />
              </Box>
            </>
          ) : (
            <>
              <InputField
                label="Enter OTP"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
              />
              <Box>
                <PrimaryButton onClick={handleVerifyOtp} text="Confirmă codul de verificare" size="large" />
              </Box>
            </>
          )}
        </Box>

        <div id="recaptcha-container"></div>  

      </Box>
    </Container>
  );
};

export default observer(LeftSide);