"use client";

import { Box, Divider } from "@mui/material";

import { CommonButton } from "@/common/button/CommonButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import React from "react";
import YahooIcon from "@mui/icons-material/Mail";

const buttonStyles = {
  google: {
    backgroundColor: "rgb(234, 67, 53)",
    "&:hover": {
      backgroundColor: "rgb(219, 50, 40)",
    },
  },
  facebook: {
    backgroundColor: "rgb(59, 89, 152)",
    "&:hover": {
      backgroundColor: "rgb(45, 67, 115)",
    },
  },
  yahoo: {
    backgroundColor: "rgb(96, 1, 210)",
    "&:hover": {
      backgroundColor: "rgb(75, 0, 145)",
    },
  },
};

const SocialLoginButtons = ({
  handleGoogleLogin,
  handleFacebookLogin,
  handleYahooLogin,
  isMobile,
}: {
  handleGoogleLogin: () => Promise<void>;
  handleFacebookLogin: () => Promise<void>;
  handleYahooLogin: () => Promise<void>;
  isMobile: boolean;
}) => {
  return (
    <Box>
      <Divider>or</Divider>
      <Box display="flex" flexDirection="column" gap={2} sx={{ marginTop: 2, marginBottom: 2 }}>
        <CommonButton
          onClick={handleGoogleLogin}
          text={isMobile ? "Google" : "Sign in with Google"}
          size="large"
          fullWidth
          startIcon={<GoogleIcon />}
          sx={buttonStyles.google}
        />
        <CommonButton
          onClick={handleFacebookLogin}
          text={isMobile ? "Facebook" : "Sign in with Facebook"}
          size="large"
          fullWidth
          startIcon={<FacebookIcon />}
          sx={buttonStyles.facebook}
        />
        <CommonButton
          onClick={handleYahooLogin}
          text={isMobile ? "Yahoo" : "Sign in with Yahoo"}
          size="large"
          fullWidth
          startIcon={<YahooIcon />}
          sx={buttonStyles.yahoo}
        />
      </Box>
    </Box>
  );
};

export default SocialLoginButtons;