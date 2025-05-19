import * as palette from "../../constants/colors";

import { Autocomplete, TextField } from "@mui/material";

import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete/Autocomplete";
import HelperText from "@/common/error/HelperText";
import React from "react";
import styled from "styled-components";

const StyledAutocomplete = styled(Autocomplete).withConfig({
  shouldForwardProp: (prop) =>
    prop !== "customWidth" && prop !== "backgroundColor",
})<{
  customWidth?: string;
  backgroundColor?: string;
}>`
  width: ${(props) => props.customWidth || "fit-content"} !important;
  min-width: 196px !important;

  .MuiFilledInput-root {
    background: ${(props) => props.backgroundColor || palette.COLOR_WHITE};

    &:hover,
    &:active {
      background: ${(props) => props.backgroundColor || palette.COLOR_WHITE};
    }
  }

  .MuiFilledInput-underline:hover:before {
    border-bottom: unset;
  }

  .MuiIconButton-root {
    color: #000;
  }
`;

type AutocompleteDisabledOptionsProps = {
  options: string[];
  onChange: (event: any, value: any) => void;
  onInputChange?: (event: React.SyntheticEvent, value: string) => void; // ✅ NEW
  label: string;
  value: string;
  customWidth?: string;
  backgroundColor?: string;
  error?: string;
  ListboxComponent?: React.JSXElementConstructor<React.HTMLAttributes<HTMLElement>>; // ✅ FIXED TYPE
};

const AutocompleteDisabledOptions = ({
  options,
  onChange,
  onInputChange,
  label,
  value,
  customWidth,
  backgroundColor,
  error,
  ListboxComponent,
}: AutocompleteDisabledOptionsProps) => (
  <>
    <StyledAutocomplete
      id="autocomplete"
      options={options}
      value={value}
      onChange={onChange}
      onInputChange={onInputChange} // ✅ Pass it down
      ListboxComponent={ListboxComponent} // ✅ Pass it down
      customWidth={customWidth}
      backgroundColor={backgroundColor}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={label}
          variant="filled"
          InputProps={{ ...params.InputProps, disableUnderline: true }}
        />
      )}
    />
    {error && <HelperText>{error}</HelperText>}
  </>
);

export default AutocompleteDisabledOptions;