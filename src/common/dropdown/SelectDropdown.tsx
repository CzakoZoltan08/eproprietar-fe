import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { ChangeEvent } from "react";
import InputLabel from "@mui/material/InputLabel";
import { SxProps } from "@mui/system";

interface DropdownProps {
  label?: string;
  additionalText?: string;
  value: string | number;
  handleChange: (
    event: SelectChangeEvent<string | number>,
  ) => void;
  options: Array<{ id: string | number; value: string | number }>;  // Allow both types
  sx?: SxProps;
  labelStyle?: SxProps;
  name: string;
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
}: DropdownProps) => {
  return (
    <FormControl fullWidth sx={sx}>
      {label && (
        <InputLabel sx={labelStyle} variant="standard">
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
    </FormControl>
  );
};

export default SelectDropdown;
