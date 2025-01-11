"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import logo from "@/assets/logo.svg";
import { useMediaQuery } from "@/hooks/useMediaquery";

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  const containerStyle = {
    backgroundColor: isMobile ? "var(--color-white)" : "unset",
    maxWidth: isMobile ? "100%" : "480px", // Adjust width for desktop
    borderRadius: "8px", // Optional: adds a rounded corner for desktop
  };

  return (
    <div style={containerStyle}>
      {isMobile && (
        <Box sx={{ marginTop: "32px", marginBottom: "32px", display: "flex", alignItems:"stretch" }}>
            <Image src={logo} alt="eproprietar" width={152}/>
        </Box>
      )}
      {children}
    </div>
  );
};

export default AuthContainer;