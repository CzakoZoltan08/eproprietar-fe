"use client";
import { ChangeEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Joi from "joi";
import { Box, Divider, Typography } from "@mui/material";
import { FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import GoogleIcon from "@mui/icons-material/Google";
import { useRouter } from "next/navigation";

import {
  COLOR_RED_BUTTON,
  COLOR_RED_BUTTON_HOVER,
  COLOR_WHITE,
} from "@/constants/colors";

import { generalValidation } from "@/utils/generalValidation";
import { useStore } from "@/hooks/useStore";
import { ErrorText } from "../../style/formStyledComponents";
import { googleAuth } from "@/config/firebase";
import { CommonButton } from "../../common/button/CommonButton";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { InputField } from "@/common/input/InputField";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import { Container } from "@/style/authStyledComponents";
import Image from "next/image";
import logo from "@/assets/logo.svg";

const INITIAL_DATA = {
  email: "",
  password: "",
  passwordConfirm: "",
  firstName: "",
  lastName: "",
};

const validationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: false })
    .messages({
      "string.email": "Email must be a valid email address!",
      "string.empty": "The email address is required!",
    })
    .label("Email"),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}$/)
    .messages({
      "string.pattern.base":
        "Password should contain at least 8 characters (1 lowercase, 1 uppercase and 1 number)",
      "string.min":
        "Password should contain at least 8 characters (1 lowercase, 1 uppercase and 1 number)",
      "string.empty": "The password is required!",
    })
    .label("Password"),
  passwordConfirm: Joi.string()
    .min(8)
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "The passwords do not match. Please try again",
      "string.empty": "The password is required!",
    })
    .label("Confirm password"),
  firstName: Joi.string()
    .messages({
      "string.empty": "First Name Required",
    })
    .required()
    .label("First Name"),
  lastName: Joi.string()
    .messages({
      "string.empty": "Last Name Required",
    })
    .required()
    .label("Last Name"),
});

const LeftSide = () => {
  const {
    appState: { authApi },
    authStore: { loginWithGoogle },
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

  const googleLogin = async (provider: GoogleAuthProvider) => {
    await loginWithGoogle(provider, true);
    router.replace("/");
  };

  const facebookLogin = async (provider: FacebookAuthProvider) => {};

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

    try {
      await authApi.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

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
      <h1>Register</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <CommonButton
          onClick={() => googleLogin(googleAuth)}
          text={isMobile ? "Google" : "Sign in with Google"}
          size="large"
          fullWidth={true}
          startIcon={<GoogleIcon />}
          sx={{
            backgroundColor: COLOR_RED_BUTTON,
            "&:hover": {
              backgroundColor: COLOR_RED_BUTTON_HOVER,
            },
          }}
        />
        <Divider>
          <Typography sx={{ color: "rgba(0, 0, 0, 0.12)" }}>or</Typography>
        </Divider>
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
                label={"First Name"}
                name={"firstName"}
                type={"text"}
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                placeholder={"Enter first name"}
              />
              <TextField
                id="register-lastName-field"
                label={"Last Name"}
                name={"lastName"}
                type={"text"}
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                placeholder={"Enter last name"}
              />
              {requestError ? <ErrorText>{requestError}</ErrorText> : null}
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
