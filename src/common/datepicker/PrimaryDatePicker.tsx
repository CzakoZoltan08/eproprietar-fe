import "dayjs/locale/ro"; // ← pentru luni în română

import dayjs, { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";

interface PrimaryDatePickerProps {
  name: string;
  label: string;
  error?: string;
  value: string | null;                 // ISO string sau null
  handleChange: (date: Date | null) => void;
  monthYearOnly?: boolean;              // ← nou: afișează doar luna+an
  locale?: string;                      // ← opțional (default "ro")
}

const PrimaryDatePicker = ({
  name,
  label,
  error,
  value,
  handleChange,
  monthYearOnly = false,
  locale = "ro",
}: PrimaryDatePickerProps) => {
  // setează limba pentru dayjs (luni în română)
  dayjs.locale(locale);

  const parsed: Dayjs | null = value ? dayjs(value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <DatePicker
        label={label}
        value={parsed}
        views={monthYearOnly ? ["year", "month"] : ["year", "month", "day"]}
        openTo={monthYearOnly ? "month" : "day"}
        format={monthYearOnly ? "MMMM YYYY" : "DD.MM.YYYY"}
        onChange={(newValue) => {
          if (!newValue) {
            handleChange(null);
            return;
          }
          // dacă e doar lună+an, normalizăm la prima zi a lunii
          const normalized = monthYearOnly
            ? newValue.startOf("month").toDate()
            : newValue.toDate();
          handleChange(normalized);
        }}
        slotProps={{
          textField: {
            name,
            fullWidth: true,
            error: Boolean(error),
            helperText: error || "",
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default PrimaryDatePicker;