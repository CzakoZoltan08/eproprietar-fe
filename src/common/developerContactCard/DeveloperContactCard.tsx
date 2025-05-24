"use client";

import { Box, Typography } from "@mui/material";

import Image from "next/image";
import React from "react";
import styled from "styled-components";

interface DeveloperContactCardProps {
  name: string;
  phone: string;
  logoUrl: string;
}

const Card = styled(Box)`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  background-color: #fafafa;
  width: 100%;
  max-width: 100%; /* Removed fixed max-width */
  box-sizing: border-box;

  @media (min-width: 600px) {
    max-width: 320px; /* Apply max width on tablet+ */
  }
`;

const LogoWrapper = styled.div`
  margin: 0 auto 16px;
  width: 100%;
  max-width: 240px;
  aspect-ratio: 1;
  position: relative;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 400px) {
    max-width: 180px;
  }
`;

const CompanyTag = styled.div`
  background-color: #f0f0f0;
  color: #555;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 4px;
`;

const PhoneButton = styled.a`
  display: inline-block;
  margin-top: 16px;
  background-color: #448aff;
  color: white;
  font-weight: bold;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2979ff;
  }

  @media (max-width: 400px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`;

export const DeveloperContactCard: React.FC<DeveloperContactCardProps> = ({
  name,
  phone,
  logoUrl,
}) => {
  return (
    <Card>
      <LogoWrapper>
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          layout="fill"
          objectFit="contain"
          priority
        />
      </LogoWrapper>

      <Typography variant="h6" fontWeight={600}>
        {name}
      </Typography>

      <CompanyTag>COMPANIE</CompanyTag>

      <PhoneButton href={`tel:${phone}`}>{phone}</PhoneButton>
    </Card>
  );
};