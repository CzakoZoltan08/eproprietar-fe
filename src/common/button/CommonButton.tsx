import React from "react";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/system";

type Size = "large";

interface CommonButtonProps {
  onClick: () => void;
  text: string;
  startIcon?: React.ReactNode;
  size?: Size;
  fullWidth?: boolean;
  sx?: SxProps;
}

export const CommonButton = ({
  onClick,
  text,
  startIcon,
  size,
  fullWidth,
  sx,
}: CommonButtonProps) => {
  return (
    <Button
      variant="contained"
      startIcon={startIcon}
      onClick={onClick}
      size={size}
      fullWidth={fullWidth}
      sx={sx}
    >
      {text}
    </Button>
  );
};
