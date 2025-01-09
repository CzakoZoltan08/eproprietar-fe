"use client";

import React from "react";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import { Box } from "@mui/material";

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  const containerStyle = {
    backgroundColor: isMobile ? "var(--color-white)" : "unset",
    maxWidth: isMobile ? "100%" : "480px", // Adjust width for desktop
    borderRadius: "8px", // Optional: adds a rounded corner for desktop
    boxShadow: !isMobile ? "0px 4px 12px rgba(0, 0, 0, 0.1)" : "none", // Optional: adds a shadow for desktop
  };

  return (
    <div style={containerStyle}>
      {isMobile && (
        <Box sx={{ marginTop: "32px", marginBottom: "32px", display: "flex", justifyContent:"center", alignItems:"stretch" }}>
            <Image src={logo} alt="eproprietar" width={152}/>
        </Box>
      )}
      {children}
    </div>
  );
};

export default AuthContainer;