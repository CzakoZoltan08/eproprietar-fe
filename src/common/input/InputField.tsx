import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextFieldProps } from "@mui/material";

export const InputField = (textFieldProps: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = textFieldProps.type === "password";
  const typeUsed = isPasswordField && showPassword ? "text" : "password";

  return (
    <TextField
      label={textFieldProps.label}
      name={textFieldProps.name}
      value={textFieldProps.value}
      onChange={textFieldProps.onChange}
      helperText={textFieldProps.helperText}
      disabled={textFieldProps.disabled}
      type={isPasswordField ? typeUsed : "text"}
      InputProps={{
        endAdornment: isPasswordField && (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {!showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
