import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
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
}: PrimaryDatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={(newValue) => handleChange(newValue ? newValue.toDate() : null)}
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
