// Import necessary modules and constants
"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import { Box, Typography } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import React, { useCallback, useEffect, useId, useMemo, useState } from "react";

import AnnouncementForm from "@/app/create-announcement/AnnouncementForm";
import { AuthLayout } from "@/common/layout/AuthLayout";
import BrokerIcon from "@/assets/Broker_eproprietar.png";
import DezvIcon from "@/assets/Dezvoltator_eproprietar.png";
import PFIcon from "@/assets/PF_eproprietar.png";
import { ProviderType } from "@/constants/provider-types.enum";
import ResidentialAnnouncementForm from "@/app/create-announcement/ResidentialAnnouncementForm";
import styled from "styled-components";

// ──────────────────────────────────────────────────────────────────────────────
// Styled components
// ──────────────────────────────────────────────────────────────────────────────
const StyledSubtitle = styled(Typography)`
  font-weight: 600;
  font-size: 30px;
  color: ${palette.COLOR_TEXT};
  text-align: center;

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    font-size: 24px;
  }
`;

const StyledSubtitleAdvice = styled(Typography)`
  font-weight: 300;
  font-size: 18px;
  color: ${palette.COLOR_TEXT};
  text-align: center;

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    font-size: 12px;
  }
`;

const CardsRow = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 900px;

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    grid-template-columns: 1fr;
  }
`;

const SelectCard = styled.button<{ $selected?: boolean }>`
  all: unset;
  cursor: pointer;
  border-radius: 16px;
  border: 2px solid
    ${(p) => (p.$selected ? palette.COLOR_PRIMARY : "rgba(0,0,0,0.12)")};
  background: ${(p) => (p.$selected ? "#f7fbff" : "white")};
  box-shadow: ${(p) => (p.$selected ? "0 4px 14px rgba(0,0,0,0.08)" : "none")};
  transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  gap: 14px;

  &:hover {
    border-color: ${palette.COLOR_PRIMARY};
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }

  &:focus-visible {
    outline: 3px solid ${palette.COLOR_PRIMARY};
    outline-offset: 2px;
  }
`;

const LogoWrap = styled(Box)`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: #f5f7fa;
`;

const CardTexts = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardTitle = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  color: ${palette.COLOR_TEXT};
`;

const CardSubtitle = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  color: ${palette.COLOR_CONTRAST};
`;

const Badge = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${palette.COLOR_PRIMARY};
  color: white;
  line-height: 1;
`;

// ──────────────────────────────────────────────────────────────────────────────
// Reusable Card component
// ──────────────────────────────────────────────────────────────────────────────
interface PublisherOption {
  key: string;
  title: string;
  subtitle?: string;
  imageSrc: string | StaticImageData;
}

interface PublisherCardProps extends PublisherOption {
  selected: boolean;
  onSelect: () => void;
  badgeText?: string;
}

const PublisherCard: React.FC<PublisherCardProps> = ({
  title,
  subtitle,
  imageSrc,
  selected,
  onSelect,
  badgeText,
}) => {
  return (
    <SelectCard
      role="radio"
      aria-checked={selected}
      $selected={selected}
      onClick={onSelect}
    >
      <LogoWrap>
        <Image src={imageSrc} alt="publisher" width={48} height={48} />
      </LogoWrap>
      <CardTexts>
        <CardTitle>{title}</CardTitle>
        <Box display="flex" alignItems="center" gap={8}>
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
          {badgeText && <Badge>{badgeText}</Badge>}
        </Box>
      </CardTexts>
    </SelectCard>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────────
export default function CreateAnnounce() {
  const [selectedTab, setSelectedTab] = useState(0);

  // Accessibility: arrow key navigation within the radio group
  const groupId = useId();
  const options = useMemo<PublisherOption[]>(
    () => [
      {
        key: "owner",
        title: "Proprietar / Persoane fizice",
        imageSrc: PFIcon,
      },
      {
        key: "residential",
        title: "Bloc nou / Ansambluri rezidențiale",
        imageSrc: DezvIcon,
      },
      {
        key: "agency",
        title: "Anunțuri agenții cu exclusivitate",
        imageSrc: BrokerIcon,
      },
    ],
    []
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      setSelectedTab((prev) => {
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = (prev + dir + options.length) % options.length;
        return next;
      });
    },
    [options.length]
  );

  // Keep focus on selected card when navigating via keyboard
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(
      `#${groupId}-card-${selectedTab}`
    );
    el?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  return (
    <AuthLayout>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <StyledSubtitle variant="h3">Adaugă acum anunțul tău</StyledSubtitle>
        <StyledSubtitleAdvice variant="h4">
          Urmează pașii, e mai simplu ca niciodată!
        </StyledSubtitleAdvice>

        {/* Cine publică anunțul */}
        <Box width="100%" maxWidth={900}>
          <Typography
            variant="h6"
            sx={{ mb: 1, fontWeight: 600, color: palette.COLOR_TEXT }}
            id={`${groupId}-label`}
          >
            Cine publică anunțul?
          </Typography>

          <CardsRow
            role="radiogroup"
            aria-labelledby={`${groupId}-label`}
            onKeyDown={onKeyDown}
          >
            {options.map((opt, index) => (
              <PublisherCard
                key={opt.key}
                selected={selectedTab === index}
                onSelect={() => setSelectedTab(index)}
                title={opt.title}
                subtitle={opt.subtitle}
                imageSrc={opt.imageSrc}
                badgeText={opt.key === "agency" ? "0% comision pentru cumpărător!" : undefined}
              />
            ))}
          </CardsRow>
        </Box>

        {/* Forms */}
        <Box width="100%">
          {selectedTab === 0 && <AnnouncementForm item={ProviderType.OWNER} />}
          {selectedTab === 1 && <ResidentialAnnouncementForm />}
          {selectedTab === 2 && <AnnouncementForm item={ProviderType.AGENCY} />}
        </Box>
      </Box>
    </AuthLayout>
  );
}
