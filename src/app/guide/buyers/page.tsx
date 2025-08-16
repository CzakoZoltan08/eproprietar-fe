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

export default function ProprietariCumparareGuidePage() {
  return (
    <PageWrap>
      <HeaderBlock>
        <Title as="h1">Ghid pentru proprietari – Cumpărare imobil</Title>
        <Tag color="primary" label="www.eproprietar.ro" />
      </HeaderBlock>

      <Section>
        <Paragraph>
          www.eproprietar.ro  - Cel mai mare site de anunțuri imobiliare destinat
          clienților care doresc să Vândă direct la Client, fără comisioane; să
          Cumpere sau să Închirieze imobile DIRECT DE LA PROPRIETAR. Vă ajutăm să
          cumpărați propria casă fără a utiliza un agent imobiliar tradițional și fără
          a plăti comisioane de mii de euro agentului sau agenției imobiliare.
        </Paragraph>
        <Paragraph>Economisiți mii de euro cumpărând Direct de la Proprietar  ... :)</Paragraph>
      </Section>

      <Section>
        <Paragraph sx={{ fontWeight: 700 }}>
          Intro: NU PLĂTI AVANS LA IMOBIL PÂNĂ NU VERIFICI ACTELE DE PROPRIETATE LA NOTAR!!!
        </Paragraph>
      </Section>

      <Section>
        <SubTitle as="h2">Stabilirea bugetului / Finanțare</SubTitle>
        <Paragraph>
          Totul începe cu „vreau să-mi iau apartament/casă”, „Am nevoie de mai mult spațiu”,
          „Urmează să avem un copil”, „Nu mai vreau chirie”.
        </Paragraph>
        <Paragraph>
          Pentru achiziționarea unui imobil setați bugetul de achiziție – fie în funcție
          de suma cash disponibilă, fie de suma ce poate fi contractată de la bancă.
          Înainte de vizionări, aflați clar pe ce sumă vă puteți baza. Comparați ofertele
          de credite la mai multe bănci sau brokeri (pot exista diferențe considerabile de dobândă).
        </Paragraph>
        <Paragraph>
          Creditele pentru achiziția de locuințe sunt: creditul Prima Casă și creditul ipotecar.
          Dacă dețineți banii cash, tranzacția se realizează prin virament bancar/cash, direct la notar.
        </Paragraph>
      </Section>

      <Section>
        <SubTitle as="h2">Stabilirea obiectivului / tipul de locuință</SubTitle>
        <Paragraph>
          Definește criteriile generale de achiziție: zonă, preț, număr de camere, etaj,
          configurație, grad de finisare, parcare/garaj, interese personale (școală,
          grădiniță, supermarket, piață, aproape de locul de muncă etc.).
        </Paragraph>

        <SubTitle as="h2">Alegerea zonei</SubTitle>
        <Paragraph>
          Cel mai important element în cumpărare: LOCAȚIA! LOCAȚIA! LOCAȚIA!
          Cartierul îți definește calitatea vieții. Accesul la punctele de interes îți
          poate ușura sau complica viața (școală, grădiniță, supermarket, piață, job,
          instituții publice, transport). E greu să le ai pe toate; bifează cât mai multe.
        </Paragraph>
      </Section>

      <Section>
        <SubTitle as="h2">Verificare calitate imobil</SubTitle>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Contextul vecinătății"
              secondary={`Parc (priveliște, liniște), școală/grădiniță (trafic la anumite ore, dar util dacă ai copii), teren liber (posibile construcții viitoare), vecinătatea unui stadion sau instituții publice etc.`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Parcare / garaj – recomandat să cumpărați"
              secondary={`Deși efort suplimentar la achiziție, parcarea sau garajul aduc plus valoare, economie de timp și lichiditate la revânzare. Chiar fără mașină, locul se poate închiria.`}
            />
          </ListItem>
        </List>
      </Section>

      <Section>
        <SubTitle as="h2">Vizionările</SubTitle>
        <Paragraph>
          Vezi cât mai multe imobile apropiate de cerințele tale: vei înțelege piața,
          vei avea repere de diferențiere, vei putea compara și negocia, și nu vei rămâne
          cu regretul că „poate erau și altele mai bune”. Nu uita: <b>cumperi o dată,
          trăiești mult timp în el!</b>
        </Paragraph>
      </Section>

      <Section>
        <SubTitle as="h2">Negocierea</SubTitle>
        <Paragraph>
          Procesul de negociere poate realiza sau anula tranzacția. Menține o atitudine
          pozitivă; nu reacționa imediat la o contraofertă nefavorabilă – poți reveni
          după câteva zile pentru o renegociere. Negocierile sunt deseori emoționale:
          proprietarul ține la preț, tu vrei cel mai bun preț posibil.
        </Paragraph>
        <Paragraph>
          Conform statisticilor, negocierile de preț pe piața imobiliară din România se
          situează la aproximativ 4–5% din preț. Dacă intervine o agenție imobiliară,
          negocierea poate fi mai dificilă, deoarece în preț se regăsește și comisionul agenției.
        </Paragraph>
      </Section>

      <Section>
        <SubTitle as="h2">Asociație – locatari</SubTitle>
        <Paragraph>
          După ce ai clar detaliile tehnice și prețul, înainte de semnare discută cu
          Administratorul de bloc: afli dacă există probleme în asociație. Verifică
          avizierul de cheltuieli (nu vrei restanțe mari). Observă vecinii de deasupra
          și dedesubt – vrei să eviți posibile neplăceri ulterioare.
        </Paragraph>
      </Section>

      <Section>
        <SubTitle as="h2">Acte necesare contract cumpărare</SubTitle>
        <Paragraph>
          Documentele necesare pentru încheierea unui contract de vânzare sunt:
        </Paragraph>
        <List dense>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Acte de identitate ale părților"
              secondary="Vânzător și cumpărător; certificate de căsătorie (dacă este cazul); procură de reprezentare (dacă este cazul)."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Acte de proprietate (Vânzător)"
              secondary={`Contract de vânzare, donație, proces-verbal de predare-primire, dovada achitării integrale a prețului, sentință/decizie civilă definitivă și irevocabilă, titlu de proprietate, certificat de moștenitor etc.`}
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Documentație cadastrală (Vânzător)"
              secondary="Fișa bunului imobil și planul de amplasament, planul releveu și încheierea de intabulare în cartea funciară."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Certificat fiscal (Vânzător)"
              secondary="Eliberat de Direcția de impozite și taxe locale, atestă plata la zi."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Certificat de performanță energetică (Vânzător)"
              secondary="Eliberat de un auditor energetic atestat."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Adeverință asociație (Vânzător, pentru apartamente)"
              secondary="Situația datoriilor către asociație (întreținere, reparații, cheltuieli comune etc.)."
            />
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primaryTypographyProps={{ sx: { fontWeight: 600, color: COLOR_TEXT } }}
              primary="Utilități la zi (Vânzător)"
              secondary="Ultima factură și chitanță pentru utilitățile aferente imobilului."
            />
          </ListItem>
        </List>
      </Section>

      <Section>
        <SubTitle as="h2">Impozit și taxe notariale</SubTitle>
        <Paragraph sx={{ mb: 1 }}>
          <b>De plătit și cine plătește:</b>
        </Paragraph>
        <List dense>
          <ListItem>
            <ListItemText primary="Onorariu contract vânzare" secondary="Se achită de către cumpărător." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Taxa ANCPI-OCPI (intabulare)" secondary="Se achită de către cumpărător." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Impozit către Stat" secondary="Se achită de către vânzător." />
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
          <Paragraph sx={{ fontStyle: "italic" }}>
            Notă: calculele sunt orientative și se pot modifica în funcție de schimbările legislative.
          </Paragraph>
        </Stack>
      </Section>

      <Section>
        <Paragraph sx={{ fontWeight: 700 }}>Succes la cumpărat!</Paragraph>
        <Paragraph>Echipa www.eproprietar.ro</Paragraph>
      </Section>
    </PageWrap>
  );
}
