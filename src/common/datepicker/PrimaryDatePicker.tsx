import React, { ChangeEvent } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import HelperText from "@/common/error/HelperText";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

interface PrimaryDatePickerProps {
  name: string;
  label: string;
  error?: string;
  value: string | null;
  handleChange: (date: Date | null) => void;
}

const PrimaryDatePicker = ({
  name,
  label,
  value,
  handleChange,
  error,
}: PrimaryDatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value).toDate() : null}
        onChange={(newValue) => handleChange(newValue)}
        slotProps={{
          textField: {
            name: name,
            fullWidth: true,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default PrimaryDatePicker;
