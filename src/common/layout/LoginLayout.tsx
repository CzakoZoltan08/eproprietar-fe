"use client";

import React, { useEffect } from "react";

import { Box } from "@mui/material";
import { COLOR_CONTRAST } from "@/constants/colors";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import { observer } from "mobx-react";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    authStore: { accessToken, getAccessToken },
  } = useStore();
  const router = useRouter();
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  // Fetch access token when the component mounts
  useEffect(() => {
    getAccessToken();
  }, []);

  // Navigate to "/" if the user is already authenticated
  useEffect(() => {
    if (accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"} // Stack for mobile, side-by-side for desktop
      justifyContent="center" // Center horizontally
      alignItems="stretch" // Stretch children vertically
      height="100vh"
      width="100vw"
      sx={{
        background: isMobile ? COLOR_CONTRAST : "unset",
      }}
    >
      {children}
    </Box>
  );
};

export default observer(LoginLayout);
