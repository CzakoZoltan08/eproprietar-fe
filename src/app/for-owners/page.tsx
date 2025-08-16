"use client";

import { Box, Divider, Typography } from "@mui/material";
import {
  COLOR_BORDER_PRIMARY,
  COLOR_PRIMARY,
  COLOR_RED_BUTTON,
  COLOR_TEXT,
} from "@/constants/colors";

import React from "react";
import styled from "styled-components";

/* ---------------- layout ---------------- */

const PageWrap = styled(Box)`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;

  @media (min-width: 768px) {
    padding: 48px 32px;
  }
`;

const Section = styled(Box)`
  margin-bottom: 32px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Title = styled(Typography)`
  font-weight: 800 !important;
  color: ${COLOR_TEXT};
  line-height: 1.2;
`;

const SubTitle = styled(Typography)`
  font-weight: 700 !important;
  color: ${COLOR_TEXT};
`;

const Line = styled(Divider)`
  margin: 16px 0 24px;
  border-color: ${COLOR_BORDER_PRIMARY};
  opacity: 0.5;
`;

const Lead = styled(Typography)`
  color: ${COLOR_TEXT};
  opacity: 0.9;
`;

const Row = styled(Typography)`
  display: block;
  color: ${COLOR_TEXT};
  margin: 6px 0;
`;

const Emphasis = styled.span`
  color: ${COLOR_PRIMARY};
  font-weight: 700;
`;

const Danger = styled.span`
  color: ${COLOR_RED_BUTTON};
  font-weight: 800;
`;

const ChipLike = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(25, 118, 210, 0.08);
  color: ${COLOR_PRIMARY};
  font-weight: 700;
`;

/* ---------------- page ---------------- */

export default function ForOwnersPage() {
  return (
    <PageWrap>
      {/* Hero */}
      <Section>
        <Title variant="h4" gutterBottom>
          🏡 eProprietar.ro – Platforma UNICĂ a proprietarilor reali
        </Title>
        <Line />
      </Section>

      {/* Concept */}
      <Section>
        <SubTitle variant="h5" gutterBottom>
          🤝 Direct de la PROPRIETAR, direct la CUMPĂRĂTOR sau CHIRIAȘ
        </SubTitle>
        <Lead variant="body1">
          Conceptul eProprietar.ro este simplu și clar: Facilităm vânzarea și
          închirierea imobilelor fără intermediari, fără comisioane, fără jocuri
          de culise.
        </Lead>
        <Line />
      </Section>

      {/* Mission */}
      <Section>
        <SubTitle variant="h5" gutterBottom>
          🎯 Ce ne propunem?
        </SubTitle>
        <Lead variant="body1" paragraph>
          Să oferim persoanelor fizice, dezvoltatorilor imobiliari și agenților
          imobiliari cu reprezentare exclusivă (unică și transparentă)
          posibilitatea de a publica anunțuri într-un spațiu curat, organizat și
          eficient – unde tranzacțiile se fac direct între părți.
        </Lead>
        <Row>Tu vinzi. Tu închiriezi. Tu controlezi.</Row>
        <Line />
      </Section>

      {/* What you find */}
      <Section>
        <SubTitle variant="h5" gutterBottom>
          🗂️ Ce găsești pe platformă?
        </SubTitle>

        <Row>📍 Cea mai mare bază de date din România cu anunțuri de la:</Row>
        <Row>• Proprietari persoane fizice</Row>
        <Row>• Dezvoltatori imobiliari</Row>
        <Row>• Agenți imobiliari care au contracte în exclusivitate</Row>

        <Box height={8} />
        <Row>Toate tipurile de imobile:</Row>
        <Row>• Apartamente</Row>
        <Row>• Case / Vile</Row>
        <Row>• Terenuri</Row>
        <Row>• Spații comerciale</Row>
        <Row>• Cabane, case la țară</Row>
        <Row>• Proiecte rezidențiale, clădiri, hale industriale</Row>
        <Line />
      </Section>

      {/* Why different */}
      <Section>
        <SubTitle variant="h5" gutterBottom>
          🔄 De ce este diferit eProprietar.ro?
        </SubTitle>
        <Row>📌 Pentru că vrem o piață imobiliară corectă</Row>
        <Row>📌 Pentru că vrem să oferim mai multe opțiuni reale pentru cumpărători</Row>
        <Row>📌 Pentru că oferim acces <Emphasis>GRATUIT și NELIMITAT</Emphasis> tuturor utilizatorilor</Row>
        <Row>📌 Pentru că vrem ca vânzătorii să aibă parte de clienți reali și direcți</Row>
        <Line />
      </Section>

      {/* Benefits */}
      <Section>
        <SubTitle variant="h5" gutterBottom>
          🎁 Avantaje și beneficii pentru PROPRIETARI:
        </SubTitle>
        <Row>💬 Discuți direct cu potențialii clienți</Row>
        <Row>🤝 Negociezi direct fără intermediari</Row>
        <Row>📞 Vinzi direct – tu ești în control</Row>
        <Row>💰 Salvezi comisioane</Row>
        <Row>
          🔹 Publici până la vânzare/închiriere!{" "}
          <ChipLike>Pachet Unic pe Piața Imobiliară din România</ChipLike>
        </Row>
        <Row>🔹 Vizibilitate egală pentru toți – nu plătești să urci în top</Row>
        <Row>🔹 Toate imobilele apar într-un timeline clar, ușor de navigat</Row>
        <Row>🔹 Poziționarea anunțurilor este aleatorie – șanse egale pentru toți</Row>
        <Row>🔹 Platformă simplă, fără haosul altor site-uri cu zeci de pagini</Row>

        <Box height={12} />
        <Lead variant="body1">
          Aici nu ești o momeală. <Emphasis>Aici ești proprietarul.</Emphasis>
        </Lead>
        <Line />
      </Section>

      {/* Pain points */}
      <Section>
        <SubTitle variant="h5" gutterBottom>
          De ce NOI? Pentru că...
        </SubTitle>
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
        <Line />
      </Section>

      {/* CTA */}
      <Section>
        <SubTitle variant="h5" gutterBottom>
          📈 Hai să facem lucrurile altfel. Mai simplu. Mai cinstit. Mai direct.
        </SubTitle>
        <Row>📲 Publică azi imobilul tău pe eProprietar.ro</Row>
        <Row>🎯 Ajungi în fața celor care caută exact ceea ce oferi</Row>
        <Row>💡 Fără taxe. Fără comisioane. Fără compromisuri</Row>
        <Line />
      </Section>

      {/* Closing */}
      <Section>
        <Lead variant="body1" paragraph>
          Succes la vânzare și închiriere!
        </Lead>
        <Lead variant="body1">
          Cu respect, <br />
          <Emphasis>Echipa eProprietar.ro</Emphasis>
        </Lead>
      </Section>
    </PageWrap>
  );
}