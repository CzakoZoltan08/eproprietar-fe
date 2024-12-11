"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { Box } from "@mui/material";
import {
  COLOR_WHITE,
} from "@/constants/colors";
import { Container } from "@/style/authStyledComponents";
import Image from "next/image";
import Joi from "joi";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import TextField from "@mui/material/TextField";
import { generalValidation } from "@/utils/generalValidation";
import logo from "@/assets/logo.svg";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const INITIAL_DATA = {
  email: "",
};

const validationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: false })
    .messages({
      "string.email": "Email must be a valid email address!",
      "string.empty": "The email address is required!",
    })
    .label("Email"),
});

const LeftSide = () => {
  const {
    appState: { authApi },
    authStore: { loginWithGoogle, resetPassword },
  } = useStore();
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState<{ [key: string]: any }>(
    INITIAL_DATA,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [isRegisterWithEmail, setIsRegisterWithEmail] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (formData.email.includes("@")) {
      setIsRegisterWithEmail(true);
    } else {
      if (isRegisterWithEmail) setIsRegisterWithEmail(false);
    }
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

  const onSubmit = async () => {
    setIsSubmitting(true);
    setRequestError("");

    const errors: { [key: string]: any } | string | null | undefined =
      generalValidation(validationSchema, formData);
    if (errors && typeof errors === "object") {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }
    console.log("errors", errors);
    try {
      await resetPassword(formData.email);

      setIsSubmitting(false);
      router.replace("/login");
    } catch (e: any) {
      setIsSubmitting(false);
      if (e?.response && e?.response.data) {
        setRequestError(e.response.data.message || "Request Error");
      } else {
        setRequestError("Request Error");
      }
    }
  };

  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  return (
    <Container
      sx={{
        background: isMobile ? COLOR_WHITE : "unset",
      }}
    >
      {isMobile && (
        <Image
          src={logo}
          alt="eproprietar"
          width={152}
          style={{ marginTop: "32px" }}
        />
      )}
      <h1>Resetează parola</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} marginBottom={2}>
          <TextField
            id="register-email-field"
            label={"Email"}
            name={"email"}
            type={"email"}
            value={formData.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            placeholder={"Enter email"}
          />
          <PrimaryButton
            onClick={onSubmit}
            text="Resetează parola"
            size="large"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default LeftSide;
