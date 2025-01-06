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

export default function EditAnnouncement() {
  const [] = useState(0);

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
