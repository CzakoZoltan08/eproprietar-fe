import React from "react";
import styled from "styled-components";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete/Autocomplete";
import { Autocomplete, TextField } from "@mui/material";

import * as palette from "../../constants/colors";
import HelperText from "@/common/error/HelperText";

const StyledAutocomplete = styled(Autocomplete)<{
  customWidth?: string | undefined;
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
      customWidth={customWidth}
      style={{ width: "300px" }}
      backgroundColor={backgroundColor}
      value={value}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={label}
          variant="filled"
          // @ts-ignore
          InputProps={{ ...params.InputProps, disableunderline: "true" }}
        />
      )}
      onChange={onChange}
    />
    {error && <HelperText>{error}</HelperText>}
  </>
);

export default AutocompleteDisabledOptions;
