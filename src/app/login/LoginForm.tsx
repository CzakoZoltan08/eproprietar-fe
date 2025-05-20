"use client";

import { Box, Typography } from "@mui/material";

import { InputField } from "@/common/input/InputField";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import React from "react";
import { useRouter } from "next/navigation";

const styles = {
  title: {
    fontWeight: 600,
    marginBottom: "24px",
    textAlign: "center",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "6px",
  },
  errorText: {
    color: "var(--color-error)",
  },
  linkContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  link: {
    color: "var(--color-text)",
    lineHeight: "20px",
    cursor: "pointer",
  },
};

const LoginForm = ({
  formData,
  formErrors,
  requestError,
  onChange,
  onSubmit,
  isLoading = false, // <-- added with default
}: {
  formData: { email: string; password: string };
  formErrors: { email: string; password: string };
  requestError: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading?: boolean; // <-- make it optional
}) => {
  const router = useRouter();

  return (
    <Box>
      <Typography variant="h4" sx={styles.title}>
        Log in
      </Typography>

      <Box sx={styles.formContainer}>
        <Box sx={styles.inputContainer}>
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

          <Box mt={2}>
            <PrimaryButton
              onClick={onSubmit}
              text={isLoading ? "Logging in..." : "Log in"}
              size="large"
              disabled={isLoading} // <-- disable during loading
            />
          </Box>
          {requestError && <span style={styles.errorText}>{requestError}</span>}
        </Box>

        <Box style={styles.linkContainer}>
          <Typography
            variant="subtitle1"
            style={styles.link}
            onClick={() => router.push("/forgot-password")}
          >
            Forgot Password
          </Typography>
          <Typography
            variant="subtitle1"
            style={styles.link}
            onClick={() => router.push("/register")}
          >
            Register
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;