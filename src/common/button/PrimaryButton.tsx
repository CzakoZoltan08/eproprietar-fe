import Button, { ButtonProps } from "@mui/material/Button";
import {
  COLOR_PRIMARY,
  COLOR_RED_BUTTON,
  COLOR_WHITE,
} from "@/constants/colors";

import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import PhoneIcon from "@mui/icons-material/Phone";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { SxProps } from "@mui/system";
import { styled } from "@mui/material/styles";

type Size = "large";
type IconType = "search" | "add" | "phone";

interface PrimaryButtonStyledProps extends ButtonProps {
  size?: Size;
}

interface PrimaryButtonProps {
  onClick: () => void;
  text: string;
  icon?: IconType;
  size?: Size;
  fullWidth?: boolean;
  sx?: SxProps;
  disabled?: boolean; // <-- Add this line
}

const PrimaryButtonStyled = styled(Button)<PrimaryButtonStyledProps>(
  ({ size }) => ({
    width: "fit-content",
    color: COLOR_WHITE,
    backgroundColor: COLOR_PRIMARY,
    borderRadius: "4px",
    height: "fit-content",
    paddingLeft: size === "large" ? "60px" : "40px",
  }),
);

const IconWrapper = ({
  icon,
  size,
}: {
  icon: React.ReactNode;
  size?: Size;
}) => {
  const height = size === "large" ? "50px" : "32px";
  const width = size === "large" ? "60px" : "40px";

  return (
    <Box
      sx={{
        height,
        width,
        position: "absolute",
        top: 0,
        left: 0,
        color: COLOR_WHITE,
        background: COLOR_RED_BUTTON,
        borderRadius: "4px",
        borderTopRightRadius: "0 !important",
        borderBottomRightRadius: "37% 100% !important",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {icon}
    </Box>
  );
};

export const PrimaryButton = ({
  onClick,
  text,
  icon,
  size,
  fullWidth,
  sx,
}: PrimaryButtonProps) => {
  const getIconByType = (icon?: IconType) => {
    switch (icon) {
      case "search":
        return <SearchIcon />;
      case "add":
        return <AddIcon />;
      case "phone":
        return <PhoneIcon />;
      default:
        return <DoubleArrowIcon />;
    }
  };

  return (
    <PrimaryButtonStyled
      variant="contained"
      startIcon={<IconWrapper icon={getIconByType(icon)} size={size} />}
      onClick={onClick}
      size={size}
      fullWidth={fullWidth}
      sx={{
        width: size === "large" || fullWidth ? "100%" : "fit-content",
        ...sx,
      }}
    >
      {text}
    </PrimaryButtonStyled>
  );
};
