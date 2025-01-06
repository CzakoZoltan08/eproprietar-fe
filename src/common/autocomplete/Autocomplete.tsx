import * as palette from "../../constants/colors";

import { Autocomplete, TextField } from "@mui/material";

import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete/Autocomplete";
import HelperText from "@/common/error/HelperText";
import React from "react";
import styled from "styled-components";

// Styled wrapper for the Autocomplete
const StyledAutocomplete = styled(Autocomplete).withConfig({
  shouldForwardProp: (prop) => prop !== "customWidth" && prop !== "backgroundColor",
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

const AutocompleteDisabledOptions = ({
  options,
  onChange,
  label,
  customWidth,
  backgroundColor,
  error,
  value,
}: {
  options: string[];
  onChange: (event: any, value: any) => void;
  label: string;
  value: string;
  customWidth?: string;
  backgroundColor?: string;
  error?: string;
}) => (
  <>
    <StyledAutocomplete
      id="autocomplete"
      options={options}
      customWidth={customWidth} // This is now safely handled by styled-components
      backgroundColor={backgroundColor} // This too
      value={value}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={label}
          variant="filled"
          InputProps={{ ...params.InputProps, disableUnderline: true }}
        />
      )}
      onChange={onChange}
    />
    {error && <HelperText>{error}</HelperText>}
  </>
);

export default AutocompleteDisabledOptions;
