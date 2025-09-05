import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { SxProps } from "@mui/system";

interface DropdownProps {
  label?: string;
  additionalText?: string;
  value: string | number;
  handleChange: (event: SelectChangeEvent<string | number>) => void;
  options: Array<{ id: string | number; value: string | number }>;
  sx?: SxProps;
  labelStyle?: SxProps;
  name: string;
  error?: boolean;
  helperText?: string;
}

const SelectDropdown = ({
  label,
  value,
  handleChange,
  options,
  sx,
  additionalText = "",
  name,
  labelStyle,
  error,
  helperText,
}: DropdownProps) => {
  return (
    <FormControl fullWidth sx={sx} error={error}>
      {label && (
        <InputLabel sx={{ pl: "10px", ...labelStyle }} variant="standard">
          {label}
        </InputLabel>
      )}
      <Select
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          top: "unset",
          width: "100%",
          ...sx,
        }}
        name={name}
        // @ts-ignore
        value={value}
        onChange={handleChange}
        displayEmpty
      >
        {options?.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {`${option.value} ${additionalText}`}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectDropdown;