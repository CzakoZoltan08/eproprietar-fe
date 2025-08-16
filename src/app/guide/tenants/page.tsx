"use client";

import { Box, Chip, List, ListItem, ListItemText, Typography } from "@mui/material";
import {
  COLOR_BORDER_PRIMARY,
  COLOR_PRIMARY,
  COLOR_TEXT,
} from "@/constants/colors";

import React from "react";
import styled from "styled-components";

/* ---------------- layout ---------------- */

const PageWrap = styled(Box)`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const HeaderBlock = styled(Box)`
  margin-bottom: 24px;
`;

const Section = styled(Box)`
  border: 1px solid ${COLOR_BORDER_PRIMARY};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  background: #fff;
`;

const Title = styled(Typography).attrs({ variant: "h3" })`
  font-weight: 800 !important;
  line-height: 1.1 !important;
  color: ${COLOR_PRIMARY};
  margin-bottom: 12px !important;
  font-size: clamp(26px, 4vw, 36px) !important;
`;

const Tag = styled(Chip)`
  margin-top: 8px;
`;

const SubTitle = styled(Typography).attrs({ variant: "h5" })`
  font-weight: 700 !important;
  color: ${COLOR_TEXT};
  margin: 16px 0 8px !important;
`;

const Paragraph = styled(Typography).attrs({ variant: "body1" })`
  color: ${COLOR_TEXT};
  line-height: 1.7 !important;
  margin: 8px 0 !important;
  white-space: pre-line;
`;

/* ---------------- page ---------------- */

export default function ForExclusiveAgentsPage() {
  return (
    <PageWrap>
      <HeaderBlock>
        <Title as="h1">Ghid pentru chiriași</Title>
        <Tag color="primary" label="www.eproprietar.ro" />
      </HeaderBlock>

      <Section>
        <Paragraph>
          www.eproprietar.ro  - Cel mai mare site de anunțuri imobiliare destinat
          clienților care doresc să Vândă direct la Client, fără comisioane; să
          Cumpere sau să  Închirieze imobile DIRECT DE LA PROPRIETAR. Vă ajutăm
          să cumpărați propria casă fără a utiliza un agent imobiliar tradițional
          și fără a plăti comisioane de mii de euro agentului sau agenției
          imobiliare.
        </Paragraph>
        <Paragraph>
          Economisiți sute de euro dacă închiriezi Direct de la Proprietar  ... :)
        </Paragraph>
      </Section>

      <Section>
        <SubTitle as="h2">Scopul ghidului</SubTitle>
        <Paragraph>
          Dorim prin acest Ghid să vă oferim sfaturile și informația necesară în
          procesul de Închiriere.
        </Paragraph>

        <SubTitle as="h2">Stabilirea bugetului</SubTitle>
        <Paragraph>
          Atenție! Pentru stabilirea bugetului de închiriere trebuie să țineți cont și
          de viitoarele cheltuieli aferente imobilului (cheltuieli de întreținere,
          deplasare, eventuale reparații, îmbunătățiri), întrebați și verificați
          nivelul cheltuielilor aferente imobilului (cereți ultimele facturi
          proprietarului, întrebați administratorul, consultați avizierul).
        </Paragraph>

        <SubTitle as="h2">Stabilirea obiectivului / tipul de locuință</SubTitle>
        <Paragraph>
          Definește criteriile generale de închiriere: zonă, preț, număr de camere,
          etaj, configurația, gradul de finisare, parcare/garaj, interese personale
          (școală, grădiniță, supermarket, piață, aproape de locul de muncă, etc).
        </Paragraph>

        <SubTitle as="h2">Alegerea zonei</SubTitle>
        <Paragraph>
          Cel mai important element în închirierea unui imobil este: LOCAȚIA! LOCAȚIA!
          LOCAȚIA! Cartierul unde vei închiria îți va oferi serviciile și calitatea
          vieții. Accesul facil la punctele tale de interes îți va ușura sau complica
          viața de zi cu zi (școală, grădiniță, supermarket, piață, locul de muncă,
          instituții publice, mijloace de transport). De multe ori este greu să ai
          acces la toate beneficiile dorite, datorită dezvoltării urbane; de aceea
          este bine să punctezi cât mai multe dintre ele.
        </Paragraph>

        <SubTitle as="h2">Vizionările</SubTitle>
        <Paragraph>
          Îți recomandăm să vezi cât mai multe imobile apropiate de cerințele tale.
          Vei vedea clar unde se situează piața imobiliară, vei avea repere clare de
          diferențiere a imobilelor, vei avea de unde să alegi și poți negocia mai
          multe imobile ca să vezi care îți este accesibil.
        </Paragraph>

        <SubTitle as="h2">Negocierea</SubTitle>
        <Paragraph>
          Procesul de negociere este momentul în care tranzacția se poate realiza sau
          se poate anula. Recomandăm să aveți o atitudine pozitivă, să nu reacționați
          imediat dacă propunerea vă este respinsă sau primiți o contraofertă care nu
          vă este pe plac; puteți reveni după câteva zile și încerca o renegociere.
          Țineți cont că negocierile sunt de cele mai multe ori emoționale – proprietarul
          ține la preț pentru că „e casa lui” și dorește să obțină un preț cât mai mare,
          iar dumneavoastră sunteți dispus să oferiți un preț cât mai mic sau un preț pe
          care vi-l permiteți.
        </Paragraph>
        <Paragraph>
          Dacă tranzacția se realizează prin intermediul agenției imobiliare, țineți cont
          că negocierea prețului se va face mai greu, la mijloc fiind comisionul agenției
          imobiliare.
        </Paragraph>
      </Section>

      <Section>
        <SubTitle as="h2">Acte necesare pentru contractul de închiriere</SubTitle>
        <List dense>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Acte de identitate părți"
              secondary="Proprietar și Chiriaș."
            />
          </ListItem>

          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Acte de proprietate asupra imobilului"
              secondary={`Documente ale Proprietarului pentru imobilul ce face obiectul tranzacției (după caz: contract vânzare, contract de donație, proces-verbal de predare-primire, dovada de achitare integrală a prețului, sentință/decizie civilă definitivă și irevocabilă, titlu de proprietate, certificat de moștenitor, etc.).`}
            />
          </ListItem>

          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Documentația cadastrală a bunului imobil"
              secondary="Fișa bunului imobil și planul de amplasament, planul releveu și încheierea de intabulare în cartea funciară."
            />
          </ListItem>

          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Certificatul de performanță energetică"
              secondary="Eliberat de un auditor energetic atestat (Proprietar)."
            />
          </ListItem>
        </List>
      </Section>

      <Section>
        <Paragraph sx={{ fontWeight: 700 }}>
          Succes la închiriat!
        </Paragraph>
        <Paragraph>Echipa www.eproprietar.ro</Paragraph>
      </Section>
    </PageWrap>
  );
}