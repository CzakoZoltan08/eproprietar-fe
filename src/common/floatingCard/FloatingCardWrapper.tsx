import * as palette from "../../constants/colors";

import Box from "@mui/material/Box";
import React from "react";
import { SIZES_NUMBER_TINY_SMALL } from "../../constants/breakpoints";
import { SxProps } from "@mui/system";
import { useMediaQuery } from "react-responsive";

type FloatingCardWrapperProps = {
  children: React.ReactNode;
  sx?: SxProps;  // Made sx optional
};

const FloatingCardWrapper: React.FC<FloatingCardWrapperProps> = ({
  children,
  sx = {}, // Default to an empty object
}) => {
  const isMobile = useMediaQuery({ maxWidth: SIZES_NUMBER_TINY_SMALL });
  const padding = isMobile ? "16px" : "24px";

  return (
    <Box
      sx={{
        padding: padding,
        background: palette.COLOR_WHITE,
        border: `1px solid ${palette.COLOR_BORDER_PRIMARY}`,
        borderRadius: "6px",
        width: "100%",
        position: "relative",
        ...sx, // Spread custom styles
      }}
    >
      {children}
    </Box>
  );
};

export default FloatingCardWrapper;