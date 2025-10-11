import React, { useState } from "react";

import HelperText from "@/common/error/HelperText";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import styled from "styled-components";

type PhoneTextFieldProps = {
  value: string;                 // expected NATIONAL format: 07xxxxxxxx
  name?: string;
  onChange: (phoneValue: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  label: string;
  error?: string;
  setError?: (error: string) => void;
  isSmall?: boolean;
};

// Romanian national mobile: 07 + 8 digits
const RO_MOBILE_NATIONAL_REGEX = /^07\d{8}$/;

const PhoneFieldWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["isSmall", "isInputFocused", "hasError"].includes(prop),
})<{
  isSmall: boolean;
  isInputFocused: boolean;
  hasError: boolean;
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PhoneTextField = ({
  value,
  name,
  onChange,
  onFocus,
  onBlur,
  label,
  error,
  setError,
  isSmall = false,
}: PhoneTextFieldProps) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const digitsOnly = (val: string) => val.replace(/\D/g, "").slice(0, 10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = digitsOnly(e.target.value);

    // Disallow country code: if it starts with 40, drop it
    if (digits.startsWith("40")) digits = digits.slice(2);

    onChange(digits);
    if (setError) setError(""); // clear live error while typing
  };

  const validateOnBlur = () => {
    if (!setError) return;

    // Enforce leading 0 if user pasted 7xxxxxxxx
    let normalized = value;
    if (normalized && normalized[0] !== "0") {
      normalized = "0" + normalized;
      normalized = digitsOnly(normalized);
      if (normalized !== value) onChange(normalized);
    }

    const isValid = RO_MOBILE_NATIONAL_REGEX.test(normalized);
    setError(isValid ? "" : "Introduceți un număr valid: 07xxxxxxxx");
  };

  return (
    <PhoneFieldWrapper
      isSmall={isSmall}
      isInputFocused={isInputFocused}
      hasError={!!error}
    >
      {label && (
        <InputLabel error={!!error} focused={isInputFocused} htmlFor={name}>
          {label}
        </InputLabel>
      )}

      <TextField
        id={name}
        name={name || "contact_phone_national"} // name to avoid autofill collisions
        value={value}
        onChange={handleChange}
        onFocus={() => {
          setIsInputFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setIsInputFocused(false);
          validateOnBlur();
          onBlur?.();
        }}
        placeholder="07xxxxxxxx"
        error={!!error}
        inputProps={{
          inputMode: "tel",
          autoComplete: "tel-national", // helps prevent Chrome autofill
          pattern: "[0-9]*",            // mobile keyboards show digits
          maxLength: 10,
        }}
        fullWidth
        size={isSmall ? "small" : "medium"}
      />

      {error && <HelperText>{error}</HelperText>}
    </PhoneFieldWrapper>
  );
};

export default PhoneTextField;