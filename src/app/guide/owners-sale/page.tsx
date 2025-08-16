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

export default function ProprietariVanzareGuidePage() {
  return (
    <PageWrap>
      <HeaderBlock>
        <Title as="h1">Ghid pentru proprietari – Vânzare imobil</Title>
        <Tag color="primary" label="www.eproprietar.ro" />
      </HeaderBlock>

      <Section>
        <Paragraph>
          www.eproprietar.ro  - Cel mai mare site de anunțuri imobiliare destinat
          clienților care doresc să Vândă direct la Client, fără comisioane; să
          Cumpere sau să Închirieze imobile DIRECT DE LA PROPRIETAR. Vă ajutăm să
          vindeți propria casă fără a utiliza un agent imobiliar tradițional și fără
          a plăti comisioane de mii de euro agentului sau agenției imobiliare.
        </Paragraph>
        <Paragraph>
          Economisiți mii de euro vânzându-vă direct casa la clienți  ... :)
        </Paragraph>
      </Section>

      <Section>
        <SubTitle>Scopul ghidului</SubTitle>
        <Paragraph>
          Dorim prin acest Ghid să vă oferim sfaturile și informația necesară în
          procesul de Vânzare.
        </Paragraph>

        <SubTitle>Stabilirea prețului</SubTitle>
        <Paragraph>
          Este important, când stabiliți prețul, să vă documentați asupra prețurilor
          pieței imobiliare. Pentru a stabili prețul, te poți folosi de ofertele deja
          listate pe www.eproprietar.ro căutând prin filtrare imobile aflate în zona
          sau pe strada ta, după număr de camere, suprafața etc. Este important ca
          prețul stabilit să fie în media de preț a zonei. Un preț stabilit corect vă
          aduce posibilitatea să vindeți mai repede!
        </Paragraph>
        <Paragraph>
          Dacă întâmpinați greutăți sau aveți dubii în stabilirea prețului, recomandăm
          să consultați un specialist în evaluări imobiliare membru ANEVAR!
        </Paragraph>

        <SubTitle>Timp de vânzare</SubTitle>
        <Paragraph>
          Conform statisticilor, pe piața imobiliară din România timpul mediu de
          vânzare pentru apartamente este de 2–3 luni, iar pentru case 4–5 luni.
        </Paragraph>
      </Section>

      <Section>
        <SubTitle>Promovare imobil</SubTitle>
        <Paragraph>
          www.eproprietar.ro este cel mai mare site din România cu anunțuri
          imobiliare <b>EXCLUSIV</b> de la Proprietari și Dezvoltatori Imobiliari,
          unde vă puteți promova direct către toți clienții existenți. Publicând
          anunțul de vânzare pe site, șansele dumneavoastră de vânzare cresc
          considerabil, iar timpul de vânzare se scurtează. Redarea anunțurilor se
          face în timeline (scroll continuu, nu pe mai multe pagini cum este pe alte
          site-uri) – astfel toți clienții vor vedea anunțul tău!
        </Paragraph>
        <Paragraph>
          Pe platforma www.eproprietar.ro Agențiile Imobiliare au accesul restricționat
          la publicarea de anunțuri. <b>Doar proprietarii</b> pot publica anunțuri!
        </Paragraph>

        <SubTitle>Promovare locală (flyere)</SubTitle>
        <Paragraph>
          Anunță vecinii din bloc sau de pe strada ta, prin flyere puse la avizier, la
          uși. Poate vei râde, dar posibili clienți pot fi chiar vecinii tăi – poate
          unii vor un apartament mai mare, poate vor să își mute familia mai aproape
          (părinți, frați, prieteni) sau cunosc pe cineva. Pe ei nu mai trebuie să-i
          convingi de nimic – doar locuiesc de mult timp acolo – că e zona bună, se
          trăiește bine, au piața aproape, magazine, școli, grădinițe ș.a.m.d.; doar la
          preț va trebui să te înțelegi cu clientul.
        </Paragraph>
      </Section>

      <Section>
        <SubTitle>Redactare anunț de vânzare</SubTitle>
        <Paragraph>
          Te sfătuim să redactezi un anunț cu informații cât mai complete și reale,
          care să cuprindă neapărat următoarele elemente:
        </Paragraph>
        <List dense>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Titlu anunț"
              secondary="Redactează un titlu atractiv în funcție de tipul imobilului."
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
              secondary={`Fotografiile sunt esențiale: clientul vede pozele înainte să citească descrierea. Pozează interiorul și/sau exteriorul, camerele, detaliile care scot în evidență imobilul. Înainte de fotografii, fă o rearanjare și o curățenie de întreținere pentru o prezentare mai bună.`}
            />
          </ListItem>
        </List>

        <SubTitle>Primirea clienților la vizionare</SubTitle>
        <Paragraph>
          Stabilește ore adecvate și, dacă vrei, un orar de vizite. Înainte de
          vizionare: curățenie de întreținere, hainele strânse, igienizarea băilor și
          bucătăriei, aerisește imobilul. La sosirea clientului, imobilul trebuie să fie
          curat și îngrijit – altfel riști să pierzi șansa de a vinde.
        </Paragraph>
        <Paragraph>
          Câteva sfaturi: nu îți cere scuze pentru dezordine (trebuie să fie deja
          ordine), pune hainele în dulap, nu găti înainte de vizionare, evită orele de
          masă, programează vizita în funcție de atuurile casei (ex.: vedere frumoasă –
          cheamă-l ziua). Pune fotografiile personale deoparte, ca atenția să rămână pe
          imobil. Dacă ai un câine, roagă pe cineva să-l scoată la plimbare pe durata
          vizitei. De obicei vizionările sunt scurte – cere datele de contact și
          revino ulterior cu o invitație pentru o a doua vizionare.
        </Paragraph>
      </Section>

      <Section>
        <SubTitle>Negocierea</SubTitle>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Analizează propunerile cu calm"
              secondary="Nu te grăbi să refuzi. Analizează informația, renegociază în termenii doriți, fii flexibil și ține cont de context."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Termen de eliberare"
              secondary={`Dacă vinzi și apoi cumperi, ține cont de termenul de eliberare în negociere. Derulează căutarea noului imobil în paralel (poți căuta direct la proprietari pe www.eproprietar.ro).`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Menține dialogul deschis"
              secondary="Analizează toate propunerile, evită refuzurile categorice și lasă loc de discuții."
            />
          </ListItem>
        </List>
      </Section>

      <Section>
        <SubTitle>Acte necesare vânzare imobil</SubTitle>
        <Paragraph>
          Documentele necesare pentru încheierea unui contract de vânzare sunt:
        </Paragraph>
        <List dense>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Acte de identitate părți"
              secondary="Vânzător și cumpărător; certificate de căsătorie (dacă este cazul); procură de reprezentare (dacă este cazul)."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Acte de proprietate"
              secondary={`Contract de vânzare, donație, proces-verbal de predare-primire, dovada achitării integrale a prețului, sentință/decizie civilă definitivă și irevocabilă, titlu de proprietate, certificat de moștenitor etc.`}
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
              primary="Certificat fiscal"
              secondary="Eliberat pe numele proprietarului de Direcția de impozite și taxe locale; atestă plata la zi."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Certificat de performanță energetică"
              secondary="Eliberat de un auditor energetic atestat."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Adeverință asociație (pentru apartamente)"
              secondary="Situația datoriilor către asociație (întreținere, reparații, cheltuieli comune etc.)."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Utilități la zi"
              secondary="Ultima factură și chitanță pentru utilitățile aferente imobilului."
            />
          </ListItem>
        </List>
      </Section>

      <Section>
        <SubTitle>Impozit și taxe notariale</SubTitle>
        <Paragraph sx={{ mb: 1 }}>
          <b>De plătit și cine plătește:</b>
        </Paragraph>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Onorariu contract vânzare"
              secondary="Se achită de către cumpărător."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Taxa ANCPI-OCPI (intabulare)"
              secondary="Se achită de către cumpărător."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Impozit către Stat"
              secondary="Se achită de către vânzător."
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Paragraph>
          <b>Calcul impozit (conform legislației în vigoare):</b>
        </Paragraph>
        <List dense>
          <ListItem>
            <ListItemText primary="Dacă prețul este sub 450.000 Lei → impozit 0 Lei" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Pentru ce depășește 450.000 Lei → 3% din diferență" />
          </ListItem>
        </List>

        <Stack spacing={1.2} sx={{ mt: 1 }}>
          <Paragraph sx={{ fontWeight: 700 }}>Exemplu (aprox. 100.000 €):</Paragraph>
          <Paragraph>Valoare vânzare – 477.880 lei</Paragraph>
          <Paragraph>Onorariu contract vânzare – 5.101 lei</Paragraph>
          <Paragraph>Taxa ANCPI-OCPI intabulare – 717 lei</Paragraph>
          <Paragraph>Impozit către Stat – 836 lei</Paragraph>
        </Stack>
      </Section>

      <Section>
        <Paragraph sx={{ fontWeight: 700 }}>Succes la vânzări!</Paragraph>
        <Paragraph>Echipa www.eproprietar.ro</Paragraph>
      </Section>
    </PageWrap>
  );
}
