"use client";

import React from "react";
import { Box, Divider } from "@mui/material";
import { InputField } from "@/common/input/InputField";
import { PrimaryButton } from "@/common/button/PrimaryButton";

const OtpVerification = ({
  isOtpSent,
  phoneNumber,
  otp,
  onPhoneNumberChange,
  onOtpChange,
  handleSendOtp,
  handleVerifyOtp,
}: {
  isOtpSent: boolean;
  phoneNumber: string;
  otp: string;
  onPhoneNumberChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  handleSendOtp: () => void;
  handleVerifyOtp: () => void;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Divider>or</Divider>
      {!isOtpSent ? (
        <>
          <InputField
            label="Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="+1XXXXXXXXXX"
          />
          <Box>
            <PrimaryButton onClick={handleSendOtp} text="Send OTP" size="large" />
          </Box>
        </>
      ) : (
        <>
          <InputField
            label="Enter OTP"
            name="otp"
            value={otp}
            onChange={(e) => onOtpChange(e.target.value)}
            placeholder="6-digit code"
          />
          <Box>
            <PrimaryButton onClick={handleVerifyOtp} text="Verify OTP" size="large" />
          </Box>
        </>
      )}
    </Box>
  );
};

export default OtpVerification;