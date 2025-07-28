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
  helperText,
  value,
}: {
  onChange: (event: any, value: string | null) => void;
  label: string;
  customWidth?: string;
  backgroundColor?: string;
  error?: boolean;
  helperText?: string;
  value?: string;
}) => {
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

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

  useEffect(() => {
    debouncedFilter(inputValue);
  }, [inputValue, debouncedFilter]);

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
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      label={label}
      customWidth={customWidth}
      backgroundColor={backgroundColor}
      error={error}
      helperText={helperText}
      value={selectedCity || ""}
      ListboxComponent={ListboxComponent}
    />
  );
};

export default AutocompleteCities;