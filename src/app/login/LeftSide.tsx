"use client";

import { Box, Divider, Typography } from "@mui/material";
import {
  COLOR_RED_BUTTON,
  COLOR_RED_BUTTON_HOVER,
  COLOR_TEXT,
  COLOR_WHITE,
} from "@/constants/colors";
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
import Joi from "joi";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import { StorageKeys } from "@/constants/storageKeys";
import { generalValidation } from "@/utils/generalValidation";
import { googleAuth } from "@/config/firebase";
import logo from "@/assets/logo.svg";
import { observer } from "mobx-react";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";

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
});

const LeftSide = () => {
  const {
    authStore: { loginWithGoogle, signInEmailAndPassword, errorMessage },
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
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (provider: GoogleAuthProvider) => {
    await loginWithGoogle(provider);
    router.replace("/");
  };

  const onSubmit = () => {
    setFormErrors({
      email: "",
      password: "",
    });

    const errors = generalValidation(validationSchema, formData);

    if (errors && typeof errors === "object") {
      setFormErrors({
        ...formErrors,
        ...errors,
      });
      return;
    }

    try {
      setIsLoading(true);
      signInEmailAndPassword(formData.email, formData.password);

      const auth = getAuth();

      onAuthStateChanged(auth, async (user: any) => {
        if (user) {
          const token = await getIdToken(user);
          if (token) {
            if (typeof window !== "undefined") {
              localStorage.setItem(StorageKeys.token, token);
            }
          }
          setCurrentUser(user);
          setIsLoading(false);
          router.replace("/");
        }
      });
    } catch (e) {
      setIsLoading(false);
      setRequestError("Email or password is incorrect!");
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

      <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: "32px" }}>
        Log in
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Box 
          display="flex" 
          sx={{
            flexDirection: "column",
            gap: "2px",
            marginBottom: "6px"
          }}
        >
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
          {requestError || errorMessage ? (
            <ErrorText>{requestError || errorMessage}</ErrorText>
          ) : null}
        </Box>

        <Box
          display={"flex"}
          sx={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: COLOR_TEXT,
              lineHeight: "20px",
              cursor: "pointer",
            }}
            onClick={() => router.push("/forgot-password")}
          >
            Forgot Password
          </Typography>{" "}
          <Typography
            variant="subtitle1"
            sx={{
              color: COLOR_TEXT,
              lineHeight: "20px",
              cursor: "pointer",
            }}
            onClick={() => router.push("/register")}
          >
            Register
          </Typography>
        </Box>

        <Box>
          <PrimaryButton onClick={onSubmit} text="Log in" size="large" />
        </Box>

        <Divider>or</Divider>

        <Box
          display="flex"
          sx={{
            justifyContent: "space-between",
            flexDirection: "row",
            gap: "2px",
          }}
        >
          <CommonButton
            onClick={() => handleLogin(googleAuth)}
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
          <CommonButton
            onClick={() => handleLogin(googleAuth)}
            text={isMobile ? "Facebook" : "Sign in with Facebook"}
            size="large"
            startIcon={<FacebookIcon />}
            fullWidth={true}
            sx={{ whiteSpace: "nowrap" }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default observer(LeftSide);
