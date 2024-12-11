import React, { useEffect, useState } from "react";
import AutocompleteDisabledOptions from "./Autocomplete";

import { cities } from "../../constants/citiesRomania";
import HelperText from "@/common/error/HelperText";
import { Box } from "@mui/material";

const AutocompleteCities = ({
  onChange,
  label,
  customWidth,
  backgroundColor,
  error,
  value,
}: {
  onChange: (event: any, value: string | null) => void;
  label: string;
  customWidth?: string;
  backgroundColor?: string;
  error?: string;
  value?: string;
}) => {
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  useEffect(() => {
    const citiesName = cities.map((city) => city.nume);
    const cityOptions = Array.from(new Set(citiesName));

    setCityOptions(cityOptions);
  }, []);

  return (
    <AutocompleteDisabledOptions
      options={cityOptions}
      onChange={onChange}
      label={label}
      customWidth={customWidth}
      backgroundColor={backgroundColor}
      error={error}
      value={value || ""}
    />
  );
};

export default AutocompleteCities;
