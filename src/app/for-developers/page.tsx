"use client";

import { Box, Chip, Container, Divider, Typography } from "@mui/material";
import {
  COLOR_BORDER_PRIMARY,
  COLOR_PRIMARY,
  COLOR_TEXT,
} from "@/constants/colors";

import React from "react";
import styled from "styled-components";

/* ---------- styled ---------- */

const PageWrap = styled(Container)`
  max-width: 960px !important;
  padding: 40px 16px;
`;

const Section = styled(Box)<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => (p.$gap ? `${p.$gap}px` : "12px")};
  margin: 28px 0;
`;

const Line = styled(Divider)`
  border-color: ${COLOR_BORDER_PRIMARY ?? "#e5e7eb"};
  opacity: 0.8;
`;

const Lead = styled(Typography)`
  color: ${COLOR_TEXT ?? "#0f172a"};
`;

const BadgeRow = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Highlight = styled.span`
  color: ${COLOR_PRIMARY ?? "#0ea5e9"};
  font-weight: 700;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 6px;
`;

const ListItem = styled.li`
  line-height: 1.6;
`;

/* ---------- page ---------- */

export default function ForDevelopersPage() {
  return (
    <PageWrap>
      {/* Header */}
      <Section $gap={8} style={{ marginTop: 0 }}>
        <Typography variant="h4" fontWeight={800}>
          🏗️ eProprietar.ro – Spațiul ideal pentru dezvoltatorii imobiliari
        </Typography>
        <Lead variant="subtitle1">
          Mai multe oferte pentru cumpărători. Mai mulți clienți pentru vânzători. Totul, fără comisioane.
        </Lead>
      </Section>

      <Line />

      {/* Mission */}
      <Section $gap={12}>
        <Typography variant="h5" fontWeight={800}>
          🎯 Misiunea noastră
        </Typography>
        <Lead>
          La eProprietar.ro, ne propunem să oferim cea mai variată selecție de <strong>LOCUINȚE NOI</strong> pentru cumpărători
          și să livrăm cea mai bună valoare pentru vânzători – fie că sunt dezvoltatori imobiliari, proprietari sau agenți cu exclusivitate.
        </Lead>

        <BadgeRow>
          <Chip label="✅ Mai multe opțiuni pentru cumpărători" color="primary" variant="outlined" />
          <Chip label="✅ Mai mulți clienți pentru vânzători" color="primary" variant="outlined" />
          <Chip label="🔁 Fără comisioane, fără intermediari, fără complicații" color="primary" variant="outlined" />
        </BadgeRow>
      </Section>

      <Line />

      {/* Ensembles */}
      <Section $gap={12}>
        <Typography variant="h5" fontWeight={800}>
          🏘️ Ansambluri rezidențiale – o secțiune dedicată proiectelor noi
        </Typography>
        <Lead>
          Am creat o secțiune specială – <strong>ANSAMBLURI REZIDENȚIALE</strong> – pentru a facilita accesul rapid și eficient la proiectele de locuințe noi.
        </Lead>

        <Typography variant="subtitle1" fontWeight={700}>
          ✔️ Avantajele dezvoltatorilor:
        </Typography>
        <List>
          <ListItem>📣 Promovare națională intensă</ListItem>
          <ListItem>🚀 Vizibilitate extinsă și brand awareness</ListItem>
          <ListItem>📩 Lead-uri directe, calificate</ListItem>
          <ListItem>📞 Contact direct cu potențialii cumpărători</ListItem>
          <ListItem>💸 Economisiți comisioane de la 2% până la 4% din cifra de afaceri</ListItem>
          <ListItem>🎯 Realizați mai rapid și mai ușor targetele de vânzări</ListItem>
          <ListItem>📊 Targeturi de vânzări atinse mai ușor și mai repede</ListItem>
        </List>
      </Section>

      <Line />

      {/* What projects */}
      <Section $gap={12}>
        <Typography variant="h5" fontWeight={800}>
          🔎 Ce tipuri de proiecte pot fi promovate?
        </Typography>
        <List>
          <ListItem>• Locuințe individuale sau colective</ListItem>
          <ListItem>• Ansambluri rezidențiale</ListItem>
          <ListItem>• Clădiri mixte</ListItem>
          <ListItem>• Proiecte logistice sau comerciale</ListItem>
          <ListItem>• Imobile aflate în diverse stadii de dezvoltare</ListItem>
        </List>
        <Lead>
          Dacă vinzi <strong>locuințe noi</strong> – locul tău este aici.
        </Lead>
      </Section>

      <Line />

      {/* Direct transactions */}
      <Section $gap={12}>
        <Typography variant="h5" fontWeight={800}>
          🤝 O platformă construită pentru tranzacții directe
        </Typography>
        <Lead>
          eProprietar.ro funcționează pe un model clar și cinstit: <strong>VÂNZARE DIRECTĂ</strong> între dezvoltator și client.
        </Lead>
        <BadgeRow>
          <Chip label="✔️ Fără comisioane de ambele părți" />
          <Chip label="✔️ Fără implicarea agențiilor imobiliare" />
          <Chip label="✔️ Fără pierderi de timp sau promisiuni goale" />
        </BadgeRow>
        <BadgeRow>
          <Chip label="💬 Discuți direct" variant="outlined" />
          <Chip label="🤝 Negociezi direct" variant="outlined" />
          <Chip label="🏡 Vinzi direct" variant="outlined" />
        </BadgeRow>
      </Section>

      <Line />

      {/* Experience */}
      <Section $gap={12}>
        <Typography variant="h5" fontWeight={800}>
          💡 O experiență modernă și interactivă pentru utilizatori
        </Typography>
        <Lead>
          Noua platformă <strong>www.eproprietar.ro</strong> va fi actualizată constant pentru a fi în permanență la înălțimea
          așteptărilor clienților, care se vor bucura de și mai multă interactivitate și de noi funcționalități care vor crea
          instant legături între utilizatori, transformând orice accesare într-o experiență ușoară și memorabilă.
        </Lead>
      </Section>

      <Line />

      {/* Promotion investment */}
      <Section $gap={12}>
        <Typography variant="h5" fontWeight={800}>
          📣 Investim constant în promovarea ta!
        </Typography>
        <Lead>
          Echipa eProprietar.ro pune accent pe:
        </Lead>
        <List>
          <ListItem>✅ Campanii de promovare la nivel național</ListItem>
          <ListItem>✅ Expunere individuală pentru proiectele tale, la nivel local</ListItem>
          <ListItem>✅ Strategii care reduc costurile tale de marketing și publicitate</ListItem>
          <ListItem>✅ Construirea brandului tău în rândul publicului țintă</ListItem>
        </List>
      </Section>

      <Line />

      {/* Contact */}
      <Section $gap={12}>
        <Typography variant="h5" fontWeight={800}>
          ✉️ Vrei o ofertă personalizată de promovare?
        </Typography>
        <Lead>
          📧 Scrie-ne la:{" "}
          <a
            href="mailto:marketing@eproprietar.ro"
            style={{ color: COLOR_PRIMARY ?? "#0ea5e9", fontWeight: 700, textDecoration: "none" }}
          >
            marketing@eproprietar.ro
          </a>
          <br />
          Îți vom trimite un pachet adaptat nevoilor și obiectivelor tale.
        </Lead>
      </Section>

      <Line />

      {/* Closing */}
      <Section $gap={6}>
        <Typography variant="h6" fontWeight={800}>
          Succes în vânzări!
        </Typography>
        <Lead>
          Cu respect,
          <br />
          Echipa <Highlight>www.eproprietar.ro</Highlight>
        </Lead>
      </Section>
    </PageWrap>
  );
}