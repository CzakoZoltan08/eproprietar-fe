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

  // Normalize helper: remove diacritics and handle common ligatures
  const normalizeToEnglish = (s: string) =>
    s
      .normalize?.("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .replace(/œ/g, "oe");

  // Memoize a normalized version of the source city list
  const normalizedCities = useMemo(
    () => uniqueCities.map((c) => normalizeToEnglish(c)),
    []
  );

  const debouncedFilter = useMemo(
    () =>
      debounce((input: string) => {
        const filtered = normalizedCities.filter((city) =>
          city.toLowerCase().includes(input.toLowerCase())
        );
        setCityOptions(filtered);
      }, 300),
    [normalizedCities]
  );

  useEffect(() => {
    debouncedFilter(inputValue);
  }, [inputValue, debouncedFilter]);

  useEffect(() => {
    if (value) {
      setSelectedCity(normalizeToEnglish(value));
    }
  }, [value]);

  return (
    <AutocompleteDisabledOptions
      options={cityOptions}
      onChange={(event, newValue) => {
        const normalized = newValue ? normalizeToEnglish(newValue) : null;
        setSelectedCity(normalized);
        onChange(event, normalized);
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