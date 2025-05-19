import React, { useEffect, useMemo, useState } from "react";

import AutocompleteDisabledOptions from "./Autocomplete";
import { ListboxComponent } from "./VirtualizedListbox"; // Custom virtualized dropdown
import { debounce } from "lodash";
import { uniqueCities } from "../../constants/uniqueCities"; // Preprocessed unique names

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
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Debounced filter function
  const debouncedFilter = useMemo(
    () =>
      debounce((input: string) => {
        const filtered = uniqueCities.filter((city) =>
          city.toLowerCase().includes(input.toLowerCase())
        );
        setCityOptions(filtered);
      }, 300),
    []
  );

  // Filter when input changes
  useEffect(() => {
    debouncedFilter(inputValue);
  }, [inputValue, debouncedFilter]);

  // // Initial setup on mount
  // useEffect(() => {
  //   setCityOptions(uniqueCities);
  //   if (!value && uniqueCities.length > 0) {
  //     const defaultCity = uniqueCities[0];
  //     setSelectedCity(defaultCity);
  //     onChange(null, defaultCity);
  //   }
  // }, []);

  // Sync with parent value
  useEffect(() => {
    if (value) {
      setSelectedCity(value);
    }
  }, [value]);

  return (
    <AutocompleteDisabledOptions
      options={cityOptions}
      onChange={(event, newValue) => {
        setSelectedCity(newValue);
        onChange(event, newValue);
      }}
      onInputChange={(event: any, newInputValue: React.SetStateAction<string>) => {
        setInputValue(newInputValue);
      }}
      label={label}
      customWidth={customWidth}
      backgroundColor={backgroundColor}
      error={error}
      value={selectedCity || ""}
      ListboxComponent={ListboxComponent}
    />
  );
};

export default AutocompleteCities;