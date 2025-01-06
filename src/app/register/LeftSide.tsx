"use client";

import { Box, Divider, Typography } from "@mui/material";
import {
  COLOR_RED_BUTTON,
  COLOR_RED_BUTTON_HOVER,
  COLOR_WHITE,
} from "@/constants/colors";
import { ChangeEvent, useEffect, useState } from "react";
import { FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";

import { CommonButton } from "../../common/button/CommonButton";
import { Container } from "@/style/authStyledComponents";
import { ErrorText } from "../../style/formStyledComponents";
import GoogleIcon from "@mui/icons-material/Google";
import Image from "next/image";
import { InputField } from "@/common/input/InputField";
import Joi from "joi";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import TextField from "@mui/material/TextField";
import { generalValidation } from "@/utils/generalValidation";
import { googleAuth } from "@/config/firebase";
import logo from "@/assets/logo.svg";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import validationSchema from "./registrationValidationSchema";

const INITIAL_DATA = {
  email: "",
  password: "",
  passwordConfirm: "",
  firstName: "",
  lastName: "",
};

const LeftSide = () => {
  const {
    appState: { authApi },
    authStore: { loginWithGoogle },
  } = useStore();
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [isRegisterWithEmail, setIsRegisterWithEmail] = useState(false);

  const router = useRouter();

  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  useEffect(() => {
    setIsRegisterWithEmail(formData.email.includes("@"));
  }, [formData.email]);

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setRequestError("");
    setFormData(updatedFormData);

    const error = generalValidation(validationSchema, updatedFormData, name);
    setFormErrors({
      ...formErrors,
      [name]: error,
    });
  };

  const googleLogin = async (provider: GoogleAuthProvider) => {
    await loginWithGoogle(provider, true);
    router.replace("/");
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    setRequestError("");

    const errors = generalValidation(validationSchema, formData);
    if (errors && typeof errors === "object") {
      setFormErrors({
        email: errors.email || "",
        password: errors.password || "",
        passwordConfirm: errors.passwordConfirm || "",
        firstName: errors.firstName || "",
        lastName: errors.lastName || "",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await authApi.register(formData);
      setIsSubmitting(false);
      router.replace("/login");
    } catch (e: any) {
      setIsSubmitting(false);
      const errorMessage = e?.response?.data?.message || "Request Error";
      setRequestError(errorMessage);
    }
  };

  return (
    <Container sx={{ background: isMobile ? COLOR_WHITE : "unset" }}>
      {isMobile && (
        <Image src={logo} alt="eproprietar" width={152} style={{ marginTop: "32px" }} />
      )}
      <Typography variant="h4">Register</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <CommonButton
          onClick={() => googleLogin(googleAuth)}
          text={isMobile ? "Google" : "Sign in with Google"}
          size="large"
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{
            backgroundColor: COLOR_RED_BUTTON,
            "&:hover": { backgroundColor: COLOR_RED_BUTTON_HOVER },
          }}
        />
        <Divider>
          <Typography sx={{ color: "rgba(0, 0, 0, 0.12)" }}>or</Typography>
        </Divider>
        <Box
          display="flex"
          sx={{
            flexDirection: "column",
            gap: "2px",
            marginBottom: "2px",
          }}
        >
          <TextField
            id="register-email-field"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            placeholder="Enter email"
          />
          {isRegisterWithEmail && (
            <>
              <InputField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                helperText={formErrors.password}
                type="password"
              />
              <InputField
                label="Confirm Password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                helperText={formErrors.passwordConfirm}
                type="password"
              />
              <TextField
                id="register-firstName-field"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                placeholder="Enter first name"
              />
              <TextField
                id="register-lastName-field"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                placeholder="Enter last name"
              />
              {requestError && <ErrorText>{requestError}</ErrorText>}
            </>
          )}
        </Box>
        {isRegisterWithEmail && (
          <PrimaryButton onClick={onSubmit} text="Inregistrare" size="large" />
        )}
      </Box>
    </Container>
  );
};

export default LeftSide;
