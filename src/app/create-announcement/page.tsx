"use client";
import React, { useState } from "react";
import styled from "styled-components";
import HouseIcon from "@mui/icons-material/House";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { Box } from "@mui/material";

import * as breakpoints from "@/constants/breakpoints";

import { AuthLayout } from "@/common/layout/AuthLayout";
import AnnouncementForm from "@/app/create-announcement/AnnouncementForm";
import ResidentialAnnouncementForm from "@/app/create-announcement/ResidentialAnnouncementForm";
import * as palette from "@/constants/colors";

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

export default function CreateAnnounce() {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <AuthLayout>
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
        gap={"12px"}
      >
        <Subtitle>Adauga acum anunțul tău</Subtitle>
        <SubtitleAdvice>
          Urmează pașii, e mai simplu ca niciodată!
        </SubtitleAdvice>
        <Box display="flex" alignItems="center">
          <HouseIcon
            sx={selectedTab === 0 ? selectedIconStyle : iconStyle}
            onClick={() => setSelectedTab(0)}
          />
          <LocationCityIcon
            sx={selectedTab === 1 ? selectedIconStyle : iconStyle}
            onClick={() => setSelectedTab(1)}
          />
        </Box>

        {selectedTab === 0 && <AnnouncementForm />}
        {selectedTab === 1 && <ResidentialAnnouncementForm />}
      </Box>
    </AuthLayout>
  );
}
