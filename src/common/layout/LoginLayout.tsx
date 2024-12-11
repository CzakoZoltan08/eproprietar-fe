"use client";
import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useStore } from "@/hooks/useStore";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import { COLOR_CONTRAST } from "@/constants/colors";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    authStore: { accessToken, getAccessToken },
  } = useStore();
  const router = useRouter();
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  useEffect(() => {
    getAccessToken();
  }, []);

  if (accessToken) {
    router.replace("/");
  }

  return (
    <Box
      display="flex"
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
