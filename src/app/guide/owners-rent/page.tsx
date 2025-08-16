"use client";

import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
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

export default function ProprietariInchiriereGuidePage() {
  return (
    <PageWrap>
      <HeaderBlock>
        <Title as="h1">Ghid pentru proprietari – Închiriere imobil</Title>
        <Tag color="primary" label="www.eproprietar.ro" />
      </HeaderBlock>

      <Section>
        <Paragraph>
          www.eproprietar.ro  - Cel mai mare site de anunțuri imobiliare destinat
          clienților care doresc să Vândă direct la Client, fără comisioane; să
          Cumpere sau să Închirieze imobile DIRECT DE LA PROPRIETAR. Vă ajutăm să
          închiriați propria casă fără a utiliza un agent imobiliar tradițional și
          fără a plăti comisioane de mii de euro agentului sau agenției imobiliare.
        </Paragraph>
        <Paragraph>
          Economisiți mii de euro vânzându-vă direct casa la clienți  ... :)
        </Paragraph>
      </Section>

      <Section>
        <SubTitle>Scopul ghidului</SubTitle>
        <Paragraph>
          Dorim prin acest Ghid să vă oferim sfaturile și informația necesară în
          procesul de Închiriere.
        </Paragraph>

        <SubTitle>Stabilirea prețului</SubTitle>
        <Paragraph>
          Este important, când stabiliți prețul, să vă documentați asupra prețurilor
          pieței imobiliare. Pentru a stabili prețul, poți analiza ofertele de
          imobile de pe piață sau poți apela la agenți imobiliari care oferă
          servicii de consultanță și evaluare. Este important ca prețul stabilit să
          fie în media de preț a zonei. Un preț stabilit corect vă aduce
          posibilitatea să închiriați mai repede!
        </Paragraph>

        <SubTitle>Timp de închiriere</SubTitle>
        <Paragraph>
          Conform statisticilor din ultimele luni, pe piața imobiliară din România
          timpul mediu de închiriere pentru apartamente este de aproximativ 1–4
          săptămâni, iar pentru case 2–4 luni.
        </Paragraph>
      </Section>

      <Section>
        <SubTitle>Promovare imobil</SubTitle>
        <Paragraph>
          www.eproprietar.ro este cel mai mare site din România cu anunțuri
          imobiliare <b>EXCLUSIV</b> de la Proprietari și Dezvoltatori Imobiliari,
          unde vă puteți promova direct către toți clienții existenți. Publicând
          anunțul de închiriere pe site, șansele dumneavoastră de închiriere cresc
          considerabil, iar timpul de închiriere se scurtează. Redarea anunțurilor se
          face în timeline (scroll continuu, nu pe mai multe pagini cum este pe alte
          site-uri) – astfel toți clienții vor vedea anunțul tău!
        </Paragraph>
        <Paragraph>
          Pe platforma www.eproprietar.ro Agențiile Imobiliare au accesul
          restricționat la publicarea de anunțuri. <b>Doar proprietarii</b> pot
          publica anunțuri!
        </Paragraph>
      </Section>

      <Section>
        <SubTitle>Redactare anunț de închiriere</SubTitle>
        <Paragraph>
          Te sfătuim să redactezi un anunț cu informații cât mai complete și reale,
          care să cuprindă neapărat următoarele elemente:
        </Paragraph>
        <List dense>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Titlu anunț"
              secondary="Redactează un titlu atractiv pentru tipul imobilului (apartament, casă, spațiu comercial, alte imobile)."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Descriere"
              secondary={`Detaliază toate elementele descriptive: zona și strada, etajul, numărul de camere, suprafețele (utilă, construită, teren, front stradal), compartimentare, confort, număr bucătării/băi, utilități, finisaje, dotări, servicii, parcări, vedere/priveliște, avantaje ale zonei (școli, grădinițe, parcuri, transport, magazine/mall/supermarket, pădure, lac, instituții, centru de afaceri etc.).`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Fotografii"
              secondary={`Fotografiile sunt esențiale: clientul vede pozele înainte să citească descrierea. Pozează interiorul și/sau exteriorul, camerele și detaliile care scot în evidență imobilul. Înainte de fotografii, fă o rearanjare și o curățenie de întreținere pentru o prezentare mai bună.`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Specificații / criterii pentru chiriași"
              secondary={`Dacă nu doriți un anumit tip de chiriași, specificați în anunț (ex.: nu studenți, nefumători, fără animale). Dacă aveți un target preferat, menționați-l. Triage-ul din anunț economisește timp pentru ambele părți.`}
            />
          </ListItem>
        </List>
      </Section>

      <Section>
        <SubTitle>Primirea clienților la vizionare</SubTitle>
        <Paragraph>
          Clientul trebuie primit la ore adecvate; puteți stabili chiar și un orar de
          vizite. Înainte de vizionare: curățenie de întreținere, hainele strânse,
          igienizarea băilor și a bucătăriei, aerisiți imobilul. De obicei
          vizionările sunt rapide – cereți datele de contact, reveniți ulterior cu o
          invitație la o nouă vizionare pentru discuții detaliate și finalizarea
          închirierii.
        </Paragraph>
      </Section>

      <Section>
        <SubTitle>Negocierea</SubTitle>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Analizează propunerile cu calm"
              secondary="Nu te grăbi să refuzi. Analizează informația, renegociază în termenii doriți, fii flexibil și ține cont de contextul procesului de închiriere."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Menține dialogul deschis"
              secondary="Analizează toate propunerile, evită refuzurile categorice și lasă loc de discuții cu fiecare ofertant."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Bate palma"
              secondary="Alege oferta cea mai convenabilă pentru tine și pentru client și încheiați înțelegerea."
            />
          </ListItem>
        </List>
      </Section>

      <Section>
        <SubTitle>Acte necesare pentru contractul de închiriere</SubTitle>
        <Paragraph>
          Documentele necesare pentru încheierea unui contract de închiriere sunt:
        </Paragraph>
        <List dense>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Acte de identitate ale părților"
              secondary="Proprietar și chiriaș."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Acte de proprietate"
              secondary={`Documente privind dreptul de proprietate (după caz: contract, proces-verbal de predare-primire, sentință/decizie civilă definitivă și irevocabilă, titlu de proprietate, certificat de moștenitor etc.).`}
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Documentație cadastrală"
              secondary="Fișa bunului imobil și planul de amplasament, planul releveu și încheierea de intabulare în cartea funciară."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Certificat de performanță energetică"
              secondary="Eliberat de un auditor energetic atestat."
            />
          </ListItem>
        </List>
      </Section>

      <Section>
        <Paragraph sx={{ fontWeight: 700 }}>Succes la închirieri!</Paragraph>
        <Paragraph>Echipa www.eproprietar.ro</Paragraph>
      </Section>
    </PageWrap>
  );
}
