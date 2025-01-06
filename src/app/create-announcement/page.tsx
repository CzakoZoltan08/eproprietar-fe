// Import necessary modules and constants
"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import { Box, Typography } from "@mui/material";
import React, { useState } from "react";

import AnnouncementForm from "@/app/create-announcement/AnnouncementForm";
import { AuthLayout } from "@/common/layout/AuthLayout";
import HouseIcon from "@mui/icons-material/House";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ResidentialAnnouncementForm from "@/app/create-announcement/ResidentialAnnouncementForm";
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

const IconContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

// Reusable Icon component
interface TabIconProps {
  isSelected: boolean;
  IconComponent: React.ElementType;
  onClick: () => void;
}

const TabIcon: React.FC<TabIconProps> = ({ isSelected, IconComponent, onClick }) => {
  return (
    <IconComponent
      sx={{
        fontSize: isSelected ? "64px" : "48px",
        color: isSelected ? palette.COLOR_PRIMARY : palette.COLOR_CONTRAST,
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
};

export default function CreateAnnounce() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <AuthLayout>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={3}
      >
        <StyledSubtitle variant="h1">Adauga acum anunțul tău</StyledSubtitle>
        <StyledSubtitleAdvice variant="h2">
          Urmează pașii, e mai simplu ca niciodată!
        </StyledSubtitleAdvice>
        <IconContainer>
          <TabIcon
            isSelected={selectedTab === 0}
            IconComponent={HouseIcon}
            onClick={() => setSelectedTab(0)}
          />
          <TabIcon
            isSelected={selectedTab === 1}
            IconComponent={LocationCityIcon}
            onClick={() => setSelectedTab(1)}
          />
        </IconContainer>
        <Box width="100%">
          {selectedTab === 0 && <AnnouncementForm />}
          {selectedTab === 1 && <ResidentialAnnouncementForm />}
        </Box>
      </Box>
    </AuthLayout>
  );
}