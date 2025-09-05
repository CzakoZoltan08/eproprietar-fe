"use client";

import * as palette from "@/constants/colors";

import { Flex } from "@/common/flex/Flex";
import { Layout } from "@/common/layout/Layout";
import React from "react";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import styled from "styled-components";
import { useRouter } from "next/navigation";

/* =========================
   Layout & Typography
   ========================= */

const Page = styled.main<{ $pad: string }>`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${(p) => p.$pad};
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
`;

const Line = styled.p`
  margin: 6px 0;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 15px;
  color: #334155;
`;

const CTAWrap = styled(Flex)`
  justify-content: center;
  margin: 28px 0 8px;
`;

const CTAButton = styled.button`
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  border: 1px solid ${palette.COLOR_PRIMARY};
  background: ${palette.COLOR_PRIMARY};
  color: #fff;
  cursor: pointer;

  &:hover {
    filter: brightness(0.95);
  }
`;

const Closing = styled.div`
  margin-top: 24px;
  text-align: center;
  opacity: 0.9;
`;

/* =========================
   Page Component
   ========================= */

export default function ForBuyersPage() {
  const router = useRouter();
  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= SIZES_NUMBER_TINY_SMALL;

  return (
    <Layout>
      <Page $pad={isMobile ? "18px 16px 24px" : "26px 20px 40px"}>
        {/* HERO */}
        <Hero>
          <HeroTitle>
            🏠 eProprietar.ro – Imobiliare fără comisioane, fără intermedieri inutile
          </HeroTitle>
          <Divider />
        </Hero>

        {/* Scop */}
        <Section>
          <SectionHeader>
            <span>🎯</span>
            <h2>Scopul nostru este simplu:</h2>
          </SectionHeader>
          <Lead>
            Să oferim cumpărătorilor și celor care caută o chirie cea mai mare bază de date din România
            cu anunțuri imobiliare publicate direct de proprietari.
          </Lead>
        </Section>

        {/* Acces gratuit */}
        <Section>
          <SectionHeader>
            <span>🔓</span>
            <h2>Acces 100% GRATUIT și NELIMITAT</h2>
          </SectionHeader>
          <Lead>Pe eProprietar.ro ai acces liber la tot stocul de imobile disponibile:</Lead>
          <Line>🏢 Apartamente</Line>
          <Line>🏡 Case / Vile</Line>
          <Line>🌱 Terenuri</Line>
          <Line>🏬 Spații comerciale</Line>
          <Line>🌄 Case la țară</Line>
          <Line>🏕️ Cabane</Line>
          <Line>🏗️ Proiecte rezidențiale de la dezvoltatori</Line>
          <Line>📌 Anunțuri publicate de agenți imobiliari doar cu reprezentare exclusivă</Line>
          <Lead>
            Totul într-un singur loc. Fără platforme aglomerate. Fără haos.
          </Lead>
        </Section>

        {/* Avantaje */}
        <Section>
          <SectionHeader>
            <span>🚀</span>
            <h2>Avantajele tale:</h2>
          </SectionHeader>
          <Line>✅ Acces gratuit la toate imobilele de pe platformă</Line>
          <Line>📲 Vizualizare în timeline – nu ratezi nicio ofertă nouă</Line>
          <Line>📞 Suni direct proprietarul</Line>
          <Line>💬 Discuți direct</Line>
          <Line>🤝 Negociezi direct</Line>
          <Line>📝 Cumperi sau închiriezi direct</Line>
          <Line>💸 Fără comisioane, fără intermediari</Line>
        </Section>

        {/* Probleme */}
        <Section>
          <SectionHeader>
            <span>❗</span>
            <h2>De ce NOI? Pentru că știm prin ce ai trecut:</h2>
          </SectionHeader>
          <Line>🔴 Te-ai săturat de agenții imobiliare care răspund la anunțuri de persoane fizice?</Line>
          <Line>🔴 Te-ai săturat de prețuri greșite și adrese care nu corespund?</Line>
          <Line>🔴 Te-ai săturat de celebrul „s-a vândut, dar avem altceva mai bun”?</Line>
          <Line>🔴 Te-ai săturat să cauți apartamentul împreună cu agentul care nu știe unde e?</Line>
          <Line>🔴 Te-ai săturat să ajungi la vizionare și proprietarul să ceară alt preț decât era în anunț?</Line>
          <Lead>
            🗣️ Știm! TE-AI SĂTURAT!
          </Lead>
        </Section>

        {/* Concluzie */}
        <Section>
          <SectionHeader>
            <span>🎉</span>
            <h2>Aici e altfel. Aici e corect. Aici e simplu.</h2>
          </SectionHeader>
          <Line>📲 Intră acum pe eProprietar.ro</Line>
          <Line>🔎 Găsește.</Line>
          <Line>📞 Sună.</Line>
          <Line>💬 Discută.</Line>
          <Line>🤝 Negociază.</Line>
          <Line>💰 Salvează bani.</Line>
        </Section>

        {/* CTA */}
        <CTAWrap>
          <CTAButton onClick={() => router.push("/")}>
            Caută anunțuri acum
          </CTAButton>
        </CTAWrap>

        {/* Closing */}
        <Closing>
          <p>Succes la cumpărare și închiriere!</p>
          <p><strong>Cu respect,</strong></p>
          <p>Echipa eProprietar.ro</p>
        </Closing>
      </Page>
    </Layout>
  );
}
