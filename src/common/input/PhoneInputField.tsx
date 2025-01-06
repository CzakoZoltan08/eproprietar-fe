import React, { useState } from "react";

import HelperText from "@/common/error/HelperText";
import InputLabel from "@mui/material/InputLabel";
import PhoneInput from "react-phone-input-2";
import { ROMANIAN_PHONE_REGEX } from "../../constants/regex/romanianPhoneRegex";
import styled from "styled-components";

type PhoneInputFieldProps = {
  value: string;
  name?: string;
  onChange: (phoneValue: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  label: string;
  error?: string;
  setError: (error: string) => void;
  isSmall?: boolean;
};

const PhoneInputFieldWrapper = styled.div.withConfig({
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

  .form-control {
    width: 100%;
    height: ${(props) => (props.isSmall ? "35px" : "48px")};

    &:focus {
      box-shadow: unset;
    }
  }

  .special-label {
    display: none;
  }
`;

const PhoneInputField = ({
  value,
  name,
  onChange,
  onFocus,
  onBlur,
  label,
  error,
  setError,
  isSmall = false,
}: PhoneInputFieldProps) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasInputBeenTouched, setHasInputBeenTouched] = useState(false);

  const validateRomanianPhone = (input: string, country: any) => {
    if (country.countryCode === "ro") {
      const match = input.match(ROMANIAN_PHONE_REGEX);

      if (!match && hasInputBeenTouched) {
        setError("Format invalid");
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  return (
    <PhoneInputFieldWrapper
      isSmall={isSmall}
      isInputFocused={isInputFocused}
      hasError={!!error}
    >
      {label && (
        <InputLabel error={!!error} focused={isInputFocused} htmlFor={name}>
          {label}
        </InputLabel>
      )}
      <PhoneInput
        inputClass="phone-input"
        country={"ro"}
        value={value}
        countryCodeEditable={false}
        onChange={(value, data, event, formattedValue) => {
          validateRomanianPhone(value, data);
          onChange(formattedValue);
        }}
        inputProps={{
          onFocus: () => {
            setIsInputFocused(true);
            setHasInputBeenTouched(true);
            onFocus && onFocus();
          },
          onBlur: () => {
            setIsInputFocused(false);
            onBlur && onBlur();
          },
          name,
        }}
        inputStyle={{
          fontSize: "16px",
          boxShadow: "none",
          height: "40px",
        }}
      />
      {error && <HelperText>{error}</HelperText>}
    </PhoneInputFieldWrapper>
  );
};

export default PhoneInputField;