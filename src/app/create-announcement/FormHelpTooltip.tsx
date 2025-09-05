// components/FormHelpTooltip.tsx
"use client";

import { IconButton, Tooltip } from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const FormHelpTooltip = ({ title }: { title: string }) => {
  return (
    <Tooltip title={title} placement="right" arrow>
      <IconButton size="small" sx={{ padding: 0, marginLeft: 1 }}>
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default FormHelpTooltip;