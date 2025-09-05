"use client";

import { Box, Divider } from "@mui/material";

import { InputField } from "@/common/input/InputField";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import React from "react";

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
      <Divider>sau</Divider>
      {!isOtpSent ? (
        <>
          <InputField
            label="Număr de telefon"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="+40XXXXXXXXX"
          />
          <Box>
            <PrimaryButton onClick={handleSendOtp} text="Trimite codul" size="large" />
          </Box>
        </>
      ) : (
        <>
          <InputField
            label="Introdu codul OTP"
            name="otp"
            value={otp}
            onChange={(e) => onOtpChange(e.target.value)}
            placeholder="Cod din 6 cifre"
          />
          <Box>
            <PrimaryButton onClick={handleVerifyOtp} text="Verifică codul" size="large" />
          </Box>
        </>
      )}
    </Box>
  );
};

export default OtpVerification;