import * as React from "react";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import HelperText from "@/common/error/HelperText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

type StringOption = string;
type ObjectOption = { id: string; value: string };
type Option = StringOption | ObjectOption;

function isObjectOption(o: Option): o is ObjectOption {
  return typeof o === "object" && o !== null && "id" in o && "value" in o;
}

export default function RadioButtonsGroup({
  label,
  id,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  id: string;
  value: string; // always the selected id
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: Option[]; // accepts ["A", "B"] or [{id, value}, ...]
}) {
  return (
    <FormControl error={!!error}>
      <FormLabel id={id}>{label}</FormLabel>
      <RadioGroup
        aria-labelledby={id}
        name={id}
        value={value}
        onChange={onChange}
        sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 1 }}
      >
        {options?.map((option, index) => {
          const optionId = isObjectOption(option) ? option.id : option;
          const optionLabel = isObjectOption(option) ? option.value : option;

          return (
            <FormControlLabel
              key={`${id}-${optionId}-${index}`}
              name={id}
              value={optionId}          // 🔑 emits the id
              control={<Radio />}
              label={optionLabel}        // 🏷️ shows the label
            />
          );
        })}
      </RadioGroup>
      {error && <HelperText>{error}</HelperText>}
    </FormControl>
  );
}
