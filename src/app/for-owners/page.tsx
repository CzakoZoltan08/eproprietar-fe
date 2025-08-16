// app/for-owners/page.tsx
"use client";

import * as palette from "@/constants/colors";

import { Flex } from "@/common/flex/Flex";
import { Layout } from "@/common/layout/Layout";
import React from "react";
import styled from "styled-components";

/* =========================
   Unified Layout & Typography
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

const Row = styled.p`
  margin: 6px 0;
  color: #334155;
  font-size: 15px;
  line-height: 1.6;
`;

const Emphasis = styled.span`
  color: ${palette.COLOR_PRIMARY};
  font-weight: 700;
`;

const Danger = styled.span`
  color: ${palette.COLOR_RED_BUTTON};
  font-weight: 800;
`;

const ChipLike = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(25, 118, 210, 0.08);
  color: ${palette.COLOR_PRIMARY};
  font-weight: 700;
`;

/* =========================
   Page
   ========================= */

export default function ForOwnersPage() {
  return (
    <Layout>
      <Page>
        {/* HERO */}
        <Hero>
          <HeroTitle>🏡 eProprietar.ro – Platforma UNICĂ a proprietarilor reali</HeroTitle>
          <Divider />
        </Hero>

        {/* Concept */}
        <Section>
          <SectionHeader>
            <span>🤝</span>
            <h2>Direct de la PROPRIETAR, direct la CUMPĂRĂTOR sau CHIRIAȘ</h2>
          </SectionHeader>
          <Lead>
            Conceptul eProprietar.ro este simplu și clar: Facilităm vânzarea și închirierea imobilelor
            fără intermediari, fără comisioane, fără jocuri de culise.
          </Lead>
        </Section>

        {/* Mission */}
        <Section>
          <SectionHeader>
            <span>🎯</span>
            <h2>Ce ne propunem?</h2>
          </SectionHeader>
          <Lead>
            Să oferim persoanelor fizice, dezvoltatorilor imobiliari și agenților imobiliari cu
            reprezentare exclusivă (unică și transparentă) posibilitatea de a publica anunțuri într-un
            spațiu curat, organizat și eficient – unde tranzacțiile se fac direct între părți.
          </Lead>
          <Row>Tu vinzi. Tu închiriezi. Tu controlezi.</Row>
        </Section>

        {/* What you find */}
        <Section>
          <SectionHeader>
            <span>🗂️</span>
            <h2>Ce găsești pe platformă?</h2>
          </SectionHeader>

          <Row>📍 Cea mai mare bază de date din România cu anunțuri de la:</Row>
          <Row>• Proprietari persoane fizice</Row>
          <Row>• Dezvoltatori imobiliari</Row>
          <Row>• Agenți imobiliari care au contracte în exclusivitate</Row>

          <Row style={{ marginTop: 8 }}>Toate tipurile de imobile:</Row>
          <Row>• Apartamente</Row>
          <Row>• Case / Vile</Row>
          <Row>• Terenuri</Row>
          <Row>• Spații comerciale</Row>
          <Row>• Cabane, case la țară</Row>
          <Row>• Proiecte rezidențiale, clădiri, hale industriale</Row>
        </Section>

        {/* Why different */}
        <Section>
          <SectionHeader>
            <span>🔄</span>
            <h2>De ce este diferit eProprietar.ro?</h2>
          </SectionHeader>
          <Row>📌 Pentru că vrem o piață imobiliară corectă</Row>
          <Row>📌 Pentru că vrem să oferim mai multe opțiuni reale pentru cumpărători</Row>
          <Row>
            📌 Pentru că oferim acces <Emphasis>GRATUIT și NELIMITAT</Emphasis> tuturor utilizatorilor
          </Row>
          <Row>📌 Pentru că vrem ca vânzătorii să aibă parte de clienți reali și direcți</Row>
        </Section>

        {/* Benefits */}
        <Section>
          <SectionHeader>
            <span>🎁</span>
            <h2>Avantaje și beneficii pentru PROPRIETARI:</h2>
          </SectionHeader>
          <Row>💬 Discuți direct cu potențialii clienți</Row>
          <Row>🤝 Negociezi direct fără intermediari</Row>
          <Row>📞 Vinzi direct – tu ești în control</Row>
          <Row>💰 Salvezi comisioane</Row>
          <Row>
            🔹 Publici până la vânzare/închiriere! <ChipLike>Pachet Unic pe Piața Imobiliară din România</ChipLike>
          </Row>
          <Row>🔹 Vizibilitate egală pentru toți – nu plătești să urci în top</Row>
          <Row>🔹 Toate imobilele apar într-un timeline clar, ușor de navigat</Row>
          <Row>🔹 Poziționarea anunțurilor este aleatorie – șanse egale pentru toți</Row>
          <Row>🔹 Platformă simplă, fără haosul altor site-uri cu zeci de pagini</Row>

          <Lead style={{ marginTop: 12 }}>
            Aici nu ești o momeală. <Emphasis>Aici ești proprietarul.</Emphasis>
          </Lead>
        </Section>

        {/* Pain points */}
        <Section>
          <SectionHeader>
            <span>❗</span>
            <h2>De ce NOI? Pentru că...</h2>
          </SectionHeader>
          <Row>
            <Danger>🔴</Danger> Te-ai săturat să ți se spună: „Punem comision peste prețul tău”?
          </Row>
          <Row>
            <Danger>🔴</Danger> Te-ai săturat să vezi anunțul tău publicat în altă parte, fără acordul tău?
          </Row>
          <Row>
            <Danger>🔴</Danger> Te-ai săturat de promisiuni deșarte: „Cu noi vinzi mai repede”?
          </Row>
          <Row>
            <Danger>🔴</Danger> Te-ai săturat de comisioane de mii de euro pentru ceva ce poți face și singur?
          </Row>
          <Row>
            <Danger>🔴</Danger> Te-ai săturat să fii doar un „pretext” pentru alți clienți?
          </Row>
          <Row>
            🗣️ <Emphasis>ȘTIM! TE-AI SĂTURAT!</Emphasis>
          </Row>
        </Section>

        {/* CTA */}
        <Section>
          <SectionHeader>
            <span>📈</span>
            <h2>Hai să facem lucrurile altfel. Mai simplu. Mai cinstit. Mai direct.</h2>
          </SectionHeader>
          <Row>📲 Publică azi imobilul tău pe eProprietar.ro</Row>
          <Row>🎯 Ajungi în fața celor care caută exact ceea ce oferi</Row>
          <Row>💡 Fără taxe. Fără comisioane. Fără compromisuri</Row>
        </Section>

        {/* Closing */}
        <Section>
          <Lead>Succes la vânzare și închiriere!</Lead>
          <Lead>
            Cu respect, <br />
            <Emphasis>Echipa eProprietar.ro</Emphasis>
          </Lead>
        </Section>
      </Page>
    </Layout>
  );
}