// app/for-exclusive-agents/page.tsx
"use client";

import * as palette from "@/constants/colors";

import { CommonButton } from "@/common/button/CommonButton";
import { Flex } from "@/common/flex/Flex";
import { Layout } from "@/common/layout/Layout";
import React from "react";
import styled from "styled-components";

/* =========================
   Layout & Typography
   ========================= */

const Page = styled.main<{ $pad?: string }>`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${(p) => p.$pad ?? "26px 20px 40px"};
  color: #263238;
`;

const Hero = styled.section`
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
  border: 1px solid #eef3f8;
  border-radius: 12px;
  padding: 28px 22px;
  margin-bottom: 24px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  margin: 0 0 10px;
  font-size: 28px;
  line-height: 1.25;
  color: #0f172a;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e6eaf2;
  margin: 20px auto;
  width: 100%;
`;

const Section = styled.section`
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 18px;
`;

const SectionHeader = styled(Flex)`
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
  }
`;

const Lead = styled.p`
  margin: 0 0 10px;
  color: #475569;
  font-size: 15px;
  line-height: 1.6;
`;

const Line = styled.p`
  display: block;
  color: #334155;
  line-height: 1.6;
  margin: 6px 0;
  font-size: 15px;
`;

const Em = styled.span`
  color: ${palette.COLOR_PRIMARY};
  font-weight: 700;
`;

const CTAWrap = styled(Flex)`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
  align-items: center;
  justify-content: center;
`;

/* =========================
   Page Component
   ========================= */

export default function ForExclusiveAgentsPage() {
  return (
    <Layout>
      <Page>
        {/* HERO */}
        <Hero>
          <HeroTitle>
            🎯 eProprietar.ro – Platforma unde agenții imobiliari profesioniști sunt în centrul atenției!
          </HeroTitle>
          <Divider />
        </Hero>

        {/* Intro */}
        <Section>
          <Lead>
            Pe o piață aglomerată de anunțuri copiate, incomplete sau neautorizate,{" "}
            <Em>eProprietar.ro</Em> aduce un spațiu dedicat agenților care lucrează în regim de{" "}
            <Em>reprezentare exclusivă</Em> – adică exact cum ar trebui să funcționeze imobiliarele profesioniste. 
            Ne-am gândit mult dacă vom realiza această secțiune, dacă este nevoie de anunțurile agenților imobiliari și 
            am ajuns la concluzia clară că este nevoie ca clienții platformei să aibă acces la toată informația de pe 
            piața imobiliară și, fără echivoc, <Em>VOI</Em> sunteți parte din ea.
          </Lead>
        </Section>

        {/* Benefits */}
        <Section>
          <SectionHeader>
            <span>📍</span>
            <h2>De ce să-ți publici anunțurile pe eProprietar.ro?</h2>
          </SectionHeader>

          <Line>
            ✅ Acces direct la cumpărători reali, care știu că exclusivitatea înseamnă seriozitate, siguranță și transparență
          </Line>
          <Line>
            ✅ Promovare alături de anunțuri verificate ale proprietarilor, într-un mediu curat, fără spam și fără duplicări
          </Line>
          <Line>
            ✅ Imagine profesională: ești înconjurat doar de alți colegi care lucrează pe exclusivitate – fără compromisuri
          </Line>
          <Line>
            ✅ Platformă respectuoasă cu agenții, care înțelege valoarea muncii tale și nu-ți cere comisioane din tranzacție
          </Line>
          <Line>✅ Sprijin activ în promovare și expunere</Line>
        </Section>

        {/* Buyer trust */}
        <Section>
          <Line>
            💬 Cumpărătorii care accesează această secțiune știu că găsesc doar oferte reale, bine reprezentate, gestionate profesionist. 
            Iar asta înseamnă mai puține telefoane inutile și mai multe șanse reale de vânzare.
          </Line>

          <Divider />

          <Line>
            📢 Publică-ți acum anunțurile în secțiunea dedicată agenților de pe eProprietar.ro și te bonusăm cu listarea anunțului tău 
            și între anunțurile proprietarilor pentru vizibilitate maximă!
          </Line>

          <CTAWrap>
            <CommonButton href="/create-announcement" variant="contained" color="primary">
              Publică un anunț
            </CommonButton>
          </CTAWrap>
        </Section>

        {/* Closing */}
        <Section>
          <Line>Fă parte din generația nouă a reprezentării imobiliare în România!</Line>
          <Line>
            🔒 <Em>Exclusivitate</Em> înseamnă încredere. <Em>eProprietar.ro</Em> este platforma care o respectă.
          </Line>
        </Section>
      </Page>
    </Layout>
  );
}
