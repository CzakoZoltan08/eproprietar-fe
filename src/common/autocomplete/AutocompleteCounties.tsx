import React, { useEffect, useState } from "react";

import AutocompleteDisabledOptions from "./Autocomplete";
import { counties } from "../../constants/countiesRomania";

const AutocompleteCounties = ({
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
  const [countyOptions, setCountyOptions] = useState<string[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  useEffect(() => {
    const uniqueCounties = Array.from(new Set(counties));
    setCountyOptions(uniqueCounties);

    if (!value && uniqueCounties.length > 0) {
      const initialCounty = uniqueCounties[0];
      setSelectedCounty(initialCounty);
      onChange(null, initialCounty);
    }
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedCounty(value);
    }
  }, [value]);

  return (
    <AutocompleteDisabledOptions
      options={countyOptions}
      onChange={(event, newValue) => {
        setSelectedCounty(newValue);
        onChange(event, newValue);
      }}
      label={label}
      customWidth={customWidth}
      backgroundColor={backgroundColor}
      error={error}
      value={selectedCounty || ""}
    />
  );
};

export default AutocompleteCounties;