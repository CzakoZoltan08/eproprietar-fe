"use client";

import { Box, Typography } from "@mui/material";
import styled, { css } from "styled-components";

import Image from "next/image";
import React from "react";

interface DeveloperContactCardProps {
  name?: string;
  phone: string;
  logoUrl: string;
  compact?: boolean; // 🔹 toggles compact layout
}

const Card = styled(Box)<{ $compact?: boolean }>`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fafafa;
  text-align: center;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;

  ${({ $compact }) =>
    $compact
      ? css`
          padding: 10px;
          @media (min-width: 600px) {
            max-width: 300px;
          }
        `
      : css`
          padding: 16px;
          @media (min-width: 600px) {
            max-width: 320px;
          }
        `}
`;

const LogoWrapper = styled.div<{ $compact?: boolean }>`
  margin: 0 auto;
  width: 100%;
  position: relative;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  /* Smaller, non-square aspect for compact look */
  aspect-ratio: 4 / 3;

  ${({ $compact }) =>
    $compact
      ? css`
          max-width: 180px;
          margin-bottom: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        `
      : css`
          max-width: 240px;
          margin-bottom: 16px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        `}

  @media (max-width: 400px) {
    max-width: 160px;
  }
`;

const CompanyTag = styled.div<{ $compact?: boolean }>`
  display: inline-block;
  background-color: #f0f0f0;
  color: #555;
  border-radius: 4px;

  ${({ $compact }) =>
    $compact
      ? css`
          margin-top: 2px;
          font-size: 11px;
          padding: 1px 6px;
        `
      : css`
          margin-top: 4px;
          font-size: 12px;
          padding: 2px 8px;
        `}
`;

const PhoneButton = styled.a<{ $compact?: boolean }>`
  display: inline-block;
  text-decoration: none;
  color: white;
  background-color: #448aff;
  font-weight: 600;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  ${({ $compact }) =>
    $compact
      ? css`
          margin-top: 10px;
          font-size: 14px;
          padding: 8px 14px;
        `
      : css`
          margin-top: 16px;
          font-size: 16px;
          padding: 10px 20px;
        `}

  &:hover {
    background-color: #2979ff;
  }
`;

const NameText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const DeveloperContactCard: React.FC<DeveloperContactCardProps> = ({
  name,
  phone,
  logoUrl,
  compact = true,
}) => {
  return (
    <Card $compact={compact}>
      <LogoWrapper $compact={compact}>
        <Image
          src={logoUrl}
          alt={`${name || "Dezvoltator"} logo`}
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </LogoWrapper>

      {name && <NameText>{name}</NameText>} {/* ✅ SHOW CONTACT NAME */}

      <PhoneButton $compact={compact} href={`tel:${phone}`}>
        {phone}
      </PhoneButton>
    </Card>
  );
};