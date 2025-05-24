import { Box, useMediaQuery, useTheme } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import {
  COLOR_PRIMARY,
  COLOR_RED_BUTTON,
  COLOR_WHITE,
} from "@/constants/colors";

import AddIcon from "@mui/icons-material/Add";
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
  disabled?: boolean;
}

const PrimaryButtonStyled = styled(Button)<PrimaryButtonStyledProps>(({ size }) => ({
  position: "relative",
  color: COLOR_WHITE,
  backgroundColor: COLOR_PRIMARY,
  borderRadius: "4px",
  height: size === "large" ? "50px" : "36px",
  paddingLeft: size === "large" ? "60px" : "44px",
  paddingRight: "16px",
  fontSize: size === "large" ? "1rem" : "0.875rem",
  textTransform: "none",
  display: "inline-flex",
  alignItems: "center",
}));

const IconWrapper = ({
  icon,
  size,
}: {
  icon: React.ReactNode;
  size?: Size;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Use different sizes for mobile vs desktop
  const dimensions = size === "large" ? 50 : 26;
  const iconSize = size === "large" ? 20 : 16;
  const containerWidth = size === "large" ? 60 : 40;

  return (
    <Box
      sx={{
        height: dimensions,
        width: containerWidth,
        position: "absolute",
        top: 0,
        left: 0,
        color: COLOR_WHITE,
        background: COLOR_RED_BUTTON,
        borderRadius: "4px",
        borderTopRightRadius: "0",
        borderBottomRightRadius: "37% 100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& svg": {
          fontSize: iconSize,
        },
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
  disabled,
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
      onClick={onClick}
      size={size}
      fullWidth={fullWidth}
      sx={{
        width: size === "large" || fullWidth ? "100%" : "fit-content",
        ...sx,
      }}
      disabled={disabled}
    >
      {icon && <IconWrapper icon={getIconByType(icon)} size={size} />}
      {text}
    </PrimaryButtonStyled>
  );
};