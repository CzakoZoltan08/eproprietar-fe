"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import React, { useState } from "react";

import { AuthLayout } from "@/common/layout/AuthLayout";
import { Box } from "@mui/material";
import EditAnnouncementType from "@/app/edit-announcement/[id]/EditAnnouncementType";
import styled from "styled-components";

const Subtitle = styled.h1`
  font-weight: 500;
  font-size: 30px;
  color: ${palette.COLOR_TEXT};

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    font-size: 24px;
  }
`;

const SubtitleAdvice = styled.h2`
  font-weight: 300;
  font-size: 20px;
  color: ${palette.COLOR_TEXT};

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    font-size: 12px;
  }
`;

const iconStyle = {
  fontSize: "48px",
  color: palette.COLOR_CONTRAST,
  cursor: "pointer",
};

const selectedIconStyle = {
  fontSize: "64px",
  color: palette.COLOR_PRIMARY,
};

export default function EditAnnouncement() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <AuthLayout>
      <Box
        display="flex"
        sx={{
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "center",
          gap: "12px",
        }}
      >
        <Subtitle>Editeaza anunțul tău</Subtitle>
        <EditAnnouncementType />
      </Box>
    </AuthLayout>
  );
}
