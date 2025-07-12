// Import necessary modules and constants
"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import { Box, Typography } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";

import AnnouncementForm from "@/app/create-announcement/AnnouncementForm";
import { AuthLayout } from "@/common/layout/AuthLayout";
import BrokerIcon from "@/assets/Broker_eproprietar.png";
import DezvIcon from "@/assets/Dezvoltator_eproprietar.png";
import PFIcon from "@/assets/PF_eproprietar.png";
import { ProviderType } from "@/constants/provider-types.enum";
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
  IconComponent?: React.ElementType;
  imageSrc?: string | StaticImageData;
  onClick: () => void;
}

const TabIcon: React.FC<TabIconProps> = ({ isSelected, IconComponent, imageSrc, onClick }) => {
  const size = isSelected ? 64 : 48;

  return (
    <Box onClick={onClick} sx={{ cursor: "pointer" }}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt="Tab icon"
          width={size}
          height={size}
          style={{ filter: isSelected ? undefined : "grayscale(100%)" }}
        />
      ) : (
        IconComponent && (
          <IconComponent
            sx={{
              fontSize: `${size}px`,
              color: isSelected ? palette.COLOR_PRIMARY : palette.COLOR_CONTRAST,
              cursor: "pointer",
            }}
          />
        )
      )}
    </Box>
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
        <StyledSubtitle variant="h3">Adaugă acum anunțul tău</StyledSubtitle>
        <StyledSubtitleAdvice variant="h4">
          Urmează pașii, e mai simplu ca niciodată!
        </StyledSubtitleAdvice>
        <IconContainer>
          <TabIcon
            isSelected={selectedTab === 0}
            imageSrc={PFIcon}
            onClick={() => setSelectedTab(0)}
          />
          <TabIcon
            isSelected={selectedTab === 1}
            imageSrc={DezvIcon}
            onClick={() => setSelectedTab(1)}
          />
          <TabIcon
            isSelected={selectedTab === 2}
            imageSrc={BrokerIcon}
            onClick={() => setSelectedTab(2)}
          />
        </IconContainer>
        <Box width="100%">
          {selectedTab === 0 && <AnnouncementForm item={ProviderType.OWNER} />}
          {selectedTab === 1 && <ResidentialAnnouncementForm />}
          {selectedTab === 2 && <AnnouncementForm item={ProviderType.AGENCY} />}
        </Box>
      </Box>
    </AuthLayout>
  );
}