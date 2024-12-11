import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import HelperText from "@/common/error/HelperText";

const RadioButtonsGroup = ({
  label,
  id,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  id: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: string[];
}) => {
  return (
    <FormControl>
      <FormLabel id={id}>{label}</FormLabel>
      <RadioGroup
        aria-labelledby={id}
        name={id}
        value={value}
        onChange={onChange}
        sx={{ display: "flex", flexDirection: "row" }}
      >
        {options?.map((option, index) => (
          <FormControlLabel
            name={id}
            value={option}
            control={<Radio />}
            label={option}
            key={`${id}-${index}`}
          />
        ))}
      </RadioGroup>
      {error && <HelperText>{error}</HelperText>}
    </FormControl>
  );
};

export default RadioButtonsGroup;
