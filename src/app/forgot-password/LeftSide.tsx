"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { Box } from "@mui/material";
import { Container } from "@/style/authStyledComponents";
import Image from "next/image";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import TextField from "@mui/material/TextField";
import { generalValidation } from "@/utils/generalValidation";
import logo from "@/assets/logo.svg";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import validationSchema from "./forgotPasswordValidationSchema";

// Constants
const INITIAL_DATA = { email: "" };
const ERROR_MESSAGES = {
  EMAIL_INVALID: "Email must be a valid email address!",
  EMAIL_REQUIRED: "The email address is required!",
  REQUEST_ERROR: "Request Error",
};
const ROUTES = { LOGIN: "/login" };
const PLACEHOLDERS = { EMAIL: "Enter email" };
const LABELS = { EMAIL: "Email", RESET_PASSWORD: "Resetează parola" };

const LeftSide = () => {
  const {
    authStore: { resetPassword },
  } = useStore();
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_DATA);
  const [, setIsRegisterWithEmail] = useState(false);
  const [, setIsSubmitting] = useState(false);
  const [, setRequestError] = useState("");

  const router = useRouter();
  const isMobile = useMediaQuery(600);

  useEffect(() => {
    setIsRegisterWithEmail(formData.email.includes("@"));
  }, [formData.email]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    setRequestError("");

    const error = generalValidation(validationSchema, updatedFormData, name);
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    setRequestError("");

    const errors = generalValidation(validationSchema, formData);
    if (errors && typeof errors === "object") {
      setFormErrors({ ...INITIAL_DATA, ...errors });
      setIsSubmitting(false);
      return;
    }

    try {
      await resetPassword(formData.email);
      setIsSubmitting(false);
      router.replace(ROUTES.LOGIN);
    } catch (e: any) {
      setIsSubmitting(false);
      setRequestError(e?.response?.data?.message || ERROR_MESSAGES.REQUEST_ERROR);
    }
  };

  return (
    <Container sx={{ background: isMobile ? "#FFFFFF" : "unset" }}>
      {isMobile && (
        <Image src={logo} alt="eproprietar" width={152} style={{ marginTop: "32px" }} />
      )}
      <h1>{LABELS.RESET_PASSWORD}</h1>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Box
          display="flex"
          sx={{
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            gap: "2px",
            marginBottom: "2px",
          }}
        >
          <TextField
            id="register-email-field"
            label={LABELS.EMAIL}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            placeholder={PLACEHOLDERS.EMAIL}
          />
          <PrimaryButton onClick={onSubmit} text={LABELS.RESET_PASSWORD} size="large" />
        </Box>
      </Box>
    </Container>
  );
};

export default LeftSide;
