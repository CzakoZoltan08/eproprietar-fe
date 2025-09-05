"use client";

import { Box, FormHelperText, Tooltip, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

import {
  COLOR_WHITE,
} from "@/constants/colors";
import { Container } from "@/style/authStyledComponents";
import { ErrorText } from "../../style/formStyledComponents";
import Image from "next/image";
import { InputField } from "@/common/input/InputField";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import TextField from "@mui/material/TextField";
import { generalValidation } from "@/utils/generalValidation";
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
    emailAuthStore: { register },
  } = useStore();
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_DATA);
  const [, setIsSubmitting] = useState(false);
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
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      setIsSubmitting(false);
      router.replace("/login");
    } catch (error: any) {
      console.error("Eroare la înregistrare:", error);
      setIsSubmitting(false);
      const errorMessage = error?.message || "A apărut o eroare în timpul înregistrării.";
      setRequestError(errorMessage);
    }
  };

  const CustomHelperText = ({ text }: { text: string }) => (
    <Tooltip title={text} arrow>
      <FormHelperText
        component="span"
        sx={{
          display: "inline-block",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "300px",
        }}
      >
        {text}
      </FormHelperText>
    </Tooltip>
  );

  return (
    <Container sx={{ background: isMobile ? COLOR_WHITE : "unset" }}>
      {isMobile && (
        <Image src={logo} alt="eproprietar" width={152} style={{ marginTop: "32px" }} />
      )}
      <Typography variant="h4">Înregistrare</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
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
            helperText={<CustomHelperText text={formErrors.email || " "} />}
            placeholder="Introduceți emailul"
          />
          {isRegisterWithEmail && (
            <>
              <InputField
                label="Parolă"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                helperText={<CustomHelperText text={formErrors.password || " "} />}
                type="password"
              />
              <InputField
                label="Confirmare parolă"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                helperText={<CustomHelperText text={formErrors.passwordConfirm || " "} />}
                type="password"
              />
              <TextField
                id="register-firstName-field"
                label="Prenume"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!formErrors.firstName}
                helperText={<CustomHelperText text={formErrors.firstName || " "} />}
                placeholder="Introduceți prenumele"
              />
              <TextField
                id="register-lastName-field"
                label="Nume"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!formErrors.lastName}
                helperText={<CustomHelperText text={formErrors.lastName || " "} />}
                placeholder="Introduceți numele"
              />
              {requestError && <ErrorText>{requestError}</ErrorText>}
            </>
          )}
        </Box>
        {isRegisterWithEmail && (
          <PrimaryButton onClick={onSubmit} text="Înregistrare" size="large" />
        )}
      </Box>
    </Container>
  );
};

export default LeftSide;