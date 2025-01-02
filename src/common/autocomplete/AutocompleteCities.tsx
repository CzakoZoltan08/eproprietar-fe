import React, { useEffect, useState } from "react";

import AutocompleteDisabledOptions from "./Autocomplete";
import { cities } from "../../constants/citiesRomania";

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
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    // Generate unique city names
    const citiesName = cities.map((city) => city.nume);
    const uniqueCities = Array.from(new Set(citiesName));
    setCityOptions(uniqueCities);

    // Initialize the default city
    if (!value && uniqueCities.length > 0) {
      const initialCity = uniqueCities[0];
      setSelectedCity(initialCity);
      onChange(null, initialCity); // Notify parent about the default value
    }
  }, []); // Run only on component mount

  useEffect(() => {
    // Sync with the parent-provided value
    if (value) {
      setSelectedCity(value);
    }
  }, [value]); // Listen for changes in the `value` prop

  return (
    <AutocompleteDisabledOptions
      options={cityOptions}
      onChange={(event, newValue) => {
        setSelectedCity(newValue); // Update local state
        onChange(event, newValue); // Notify parent component
      }}
      label={label}
      customWidth={customWidth}
      backgroundColor={backgroundColor}
      error={error}
      value={selectedCity || ""}
    />
  );
};

export default AutocompleteCities;