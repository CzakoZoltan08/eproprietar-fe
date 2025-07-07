"use client";

import { Box, Divider, Typography } from "@mui/material";

import { format } from "date-fns";
import { ro } from "date-fns/locale/ro";
import styled from "styled-components";

interface HistoryStatsCardProps {
  createdAt: string; // ISO string
}

const CardBox = styled(Box)`
  padding: 16px;
  background: white;
  color: black;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', 'Inter Fallback';
  font-size: 18px;
  margin-bottom: 16px;
`;

const Row = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
`;

const StyledTypography = styled(Typography)`
  font-family: 'Inter', 'Inter Fallback';
  font-size: 16px;
  color: black;
`;


const HistoryStatsCard: React.FC<HistoryStatsCardProps> = ({ createdAt }) => {
  return (
    <CardBox>
      <StyledTypography variant="h6" gutterBottom>
        Istoric și statistici
      </StyledTypography>

      <Row>
        <StyledTypography variant="body2" fontWeight={500}>
          Dată
        </StyledTypography>
        <StyledTypography variant="body2" fontWeight={500}>
          Modificare
        </StyledTypography>
      </Row>
      <Divider />

      <Row>
        <StyledTypography variant="body2">
          {format(new Date(createdAt), "dd.MM.yyyy HH:mm", { locale: ro })}
        </StyledTypography>
        <StyledTypography variant="body2">Anunțul a fost publicat</StyledTypography>
      </Row>

      <Divider sx={{ marginTop: 2 }} />
    </CardBox>
  );
};

export default HistoryStatsCard;