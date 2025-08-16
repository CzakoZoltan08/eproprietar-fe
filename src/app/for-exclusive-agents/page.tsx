"use client";

import { Box, Divider, Typography } from "@mui/material";
import {
  COLOR_BORDER_PRIMARY,
  COLOR_PRIMARY,
  COLOR_TEXT,
} from "@/constants/colors";

import { CommonButton } from "@/common/button/CommonButton";
import React from "react";
import styled from "styled-components";

const PageWrap = styled(Box)`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const HeaderBlock = styled(Box)`
  margin-bottom: 24px;
`;

const AccentBar = styled.div`
  height: 4px;
  width: 80px;
  background: ${COLOR_PRIMARY};
  border-radius: 8px;
  margin: 8px 0 0;
`;

const Section = styled(Box)`
  background: #fff;
  border: 1px solid ${COLOR_BORDER_PRIMARY};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
`;

const Lead = styled(Typography)`
  color: ${COLOR_TEXT};
`;

const Line = styled(Typography)`
  display: block;
  color: ${COLOR_TEXT};
  line-height: 1.6;
  margin: 6px 0;
`;

const Em = styled.span`
  color: ${COLOR_PRIMARY};
  font-weight: 700;
`;

const CtaRow = styled(Box)`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
  align-items: center;
`;

export default function ForExclusiveAgentsPage() {
  return (
    <PageWrap>
      <HeaderBlock>
        <Typography variant="h4" fontWeight={800} color={COLOR_TEXT}>
          🎯 eProprietar.ro – Platforma unde agenții imobiliari profesioniști sunt în centrul atenției!
        </Typography>
        <AccentBar />
      </HeaderBlock>

      <Section>
        <Lead variant="body1">
          Pe o piață aglomerată de anunțuri copiate, incomplete sau neautorizate,
          <Em> eProprietar.ro</Em> aduce un spațiu dedicat agenților care lucrează
          în regim de <Em>reprezentare exclusivă</Em> – adică exact cum ar trebui să
          funcționeze imobiliarele profesioniste. Ne-am gândit mult dacă vom realiza
          această secțiune, dacă este nevoie de anunțurile agenților imobiliari și am
          ajuns la concluzia clară că este nevoie ca clienții platformei să aibă acces
          la toată informația de pe piața imobiliară și, fără echivoc, <Em>VOI</Em> sunteți
          parte din ea.
        </Lead>
      </Section>

      <Section>
        <Typography variant="h6" fontWeight={800} color={COLOR_TEXT} gutterBottom>
          📍 De ce să-ți publici anunțurile pe eProprietar.ro?
        </Typography>

        <Line>✅ Acces direct la cumpărători reali, care știu că exclusivitatea înseamnă seriozitate, siguranță și transparență</Line>
        <Line>✅ Promovare alături de anunțuri verificate ale proprietarilor, într-un mediu curat, fără spam și fără duplicări</Line>
        <Line>✅ Imagine profesională: ești înconjurat doar de alți colegi care lucrează pe exclusivitate – fără compromisuri</Line>
        <Line>✅ Platformă respectuoasă cu agenții, care înțelege valoarea muncii tale și nu-ți cere comisioane din tranzacție</Line>
        <Line>✅ Sprijin activ în promovare și expunere</Line>
      </Section>

      <Section>
        <Line>
          💬 Cumpărătorii care accesează această secțiune știu că găsesc doar oferte reale, bine
          reprezentate, gestionate profesionist. Iar asta înseamnă mai puține telefoane inutile și
          mai multe șanse reale de vânzare.
        </Line>

        <Divider sx={{ my: 2 }} />

        <Line>
          📢 Publică-ți acum anunțurile în secțiunea dedicată agenților de pe eProprietar.ro și te
          bonusăm cu listarea anunțului tău și între anunțurile proprietarilor pentru vizibilitate maximă!
        </Line>

        <CtaRow>
          <CommonButton
            href="/create-announcement"
            variant="contained"
            color="primary"
          >
            Publică un anunț
          </CommonButton>
        </CtaRow>
      </Section>

      <Section>
        <Line>Fă parte din generația nouă a reprezentării imobiliare în România!</Line>
        <Line>
          🔒 <Em>Exclusivitate</Em> înseamnă încredere. <Em>eProprietar.ro</Em> este platforma care o respectă.
        </Line>
      </Section>
    </PageWrap>
  );
}