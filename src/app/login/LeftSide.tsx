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
    authStore: { loginWithGoogle, loginWithFacebook, signInEmailAndPassword, errorMessage },
    userStore: { setCurrentUser },
  } = useStore();

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
  
        <Box display="flex" justifyContent="space-between">
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
          <CommonButton
            onClick={() => loginWithFacebook()}
            text={isMobile ? "Facebook" : "Sign in with Facebook"}
            size="large"
            fullWidth
            startIcon={<FacebookIcon />}
            sx={{ whiteSpace: "nowrap" }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default observer(LeftSide);