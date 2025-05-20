"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import { Box, Typography } from "@mui/material";

import { AuthLayout } from "@/common/layout/AuthLayout";
import EditAnnouncementType from "@/app/edit-announcement/[id]/EditAnnouncementType";
import React from "react";
import styled from "styled-components";

// Styled components
const StyledSubtitle = styled(Typography)`
  font-weight: 500;
  font-size: 30px;
  color: ${palette.COLOR_TEXT};

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    font-size: 24px;
  }
`;

const StyledSubtitleAdvice = styled(Typography)`
  font-weight: 300;
  font-size: 20px;
  color: ${palette.COLOR_TEXT};

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    font-size: 12px;
  }
`;

export default function EditAnnouncement() {
  return (
    <AuthLayout>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <StyledSubtitle variant="h1">Editează anunțul tău</StyledSubtitle>
        <StyledSubtitleAdvice variant="h2">
          Modifică informațiile, apoi salvează!
        </StyledSubtitleAdvice>
        <Box width="100%">
          <EditAnnouncementType />
        </Box>
      </Box>
    </AuthLayout>
  );
}