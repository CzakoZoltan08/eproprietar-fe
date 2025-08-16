// app/for-buyers/page.tsx
"use client";

import { Box, Button, Typography } from "@mui/material";
import { COLOR_BORDER_PRIMARY, COLOR_PRIMARY, COLOR_TEXT } from "@/constants/colors";

import styled from "styled-components";
import { useRouter } from "next/navigation";

/* ---------- styled ---------- */
const PageWrap = styled(Box)`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px 64px;
  color: ${() => (typeof COLOR_TEXT !== "undefined" ? COLOR_TEXT : "#1a1a1a")};
`;

const Hero = styled(Box)`
  text-align: center;
  margin-bottom: 28px;

  h1 {
    font-size: clamp(24px, 4.5vw, 36px);
    line-height: 1.15;
    font-weight: 800;
  }
`;

const Divider = styled.hr`
  border: 0;
  border-top: 2px solid
    ${() =>
      typeof COLOR_BORDER_PRIMARY !== "undefined"
        ? COLOR_BORDER_PRIMARY
        : "rgba(0,0,0,0.1)"};
  margin: 24px 0;
`;

const Section = styled(Box)`
  margin: 18px 0 8px;
`;

const Line = styled(Typography)`
  margin: 6px 0;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 6px;
`;

const CTAWrap = styled(Box)`
  display: flex;
  justify-content: center;
  margin: 28px 0 8px;
`;

const CTAButton = styled(Button)`
  padding: 12px 20px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 700;
  font-size: 16px;
  background: ${() =>
    typeof COLOR_PRIMARY !== "undefined" ? COLOR_PRIMARY : "#1e88e5"};
  &:hover {
    filter: brightness(0.95);
    background: ${() =>
      typeof COLOR_PRIMARY !== "undefined" ? COLOR_PRIMARY : "#1e88e5"};
  }
`;

const Closing = styled(Box)`
  margin-top: 24px;
  text-align: center;
  opacity: 0.9;
`;

/* ---------- page ---------- */
export default function ForBuyersPage() {
  const router = useRouter();

  return (
    <PageWrap component="section" aria-label="Informații pentru cumpărători și chiriași">
      <Hero>
        <Typography variant="h1" component="h1" gutterBottom>
          🏠 eProprietar.ro – Imobiliare fără comisioane, fără intermedieri inutile
        </Typography>
      </Hero>

      <Divider />

      <Section>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          🎯 Scopul nostru este simplu:
        </Typography>
        <Typography>
          Să oferim cumpărătorilor și celor care caută o chirie cea mai mare bază de date din România
          cu anunțuri imobiliare publicate direct de proprietari.
        </Typography>
      </Section>

      <Divider />

      <Section>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          🔓 Acces 100% GRATUIT și NELIMITAT
        </Typography>
        <Typography gutterBottom>
          Pe eProprietar.ro ai acces liber la tot stocul de imobile disponibile:
        </Typography>
        <Line>🏢 Apartamente</Line>
        <Line>🏡 Case / Vile</Line>
        <Line>🌱 Terenuri</Line>
        <Line>🏬 Spații comerciale</Line>
        <Line>🌄 Case la țară</Line>
        <Line>🏕️ Cabane</Line>
        <Line>🏗️ Proiecte rezidențiale de la dezvoltatori</Line>
        <Line>📌 Anunțuri publicate de agenți imobiliari doar cu reprezentare exclusivă</Line>
        <Typography sx={{ marginTop: "10px" }}>
          Totul într-un singur loc. Fără platforme aglomerate. Fără haos.
        </Typography>
      </Section>

      <Divider />

      <Section>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          🚀 Avantajele tale:
        </Typography>
        <Line>✅ Acces gratuit la toate imobilele de pe platformă</Line>
        <Line>📲 Vizualizare în timeline – nu ratezi nicio ofertă nouă</Line>
        <Line>📞 Suni direct proprietarul</Line>
        <Line>💬 Discuți direct</Line>
        <Line>🤝 Negociezi direct</Line>
        <Line>📝 Cumperi sau închiriezi direct</Line>
        <Line>💸 Fără comisioane, fără intermediari</Line>
      </Section>

      <Divider />

      <Section>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          ❗ De ce NOI? Pentru că știm prin ce ai trecut:
        </Typography>
        <Line>🔴 Te-ai săturat de agenții imobiliare care răspund la anunțuri de persoane fizice?</Line>
        <Line>🔴 Te-ai săturat de prețuri greșite și adrese care nu corespund?</Line>
        <Line>🔴 Te-ai săturat de celebrul „s-a vândut, dar avem altceva mai bun”?</Line>
        <Line>🔴 Te-ai săturat să cauți apartamentul împreună cu agentul care nu știe unde e?</Line>
        <Line>🔴 Te-ai săturat să ajungi la vizionare și proprietarul să ceară alt preț decât era în anunț?</Line>
        <Typography sx={{ marginTop: "10px", fontWeight: 700 }}>
          🗣️ Știm! TE-AI SĂTURAT!
        </Typography>
      </Section>

      <Divider />

      <Section>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          🎉 Aici e altfel. Aici e corect. Aici e simplu.
        </Typography>
        <Line>📲 Intră acum pe eProprietar.ro</Line>
        <Line>🔎 Găsește.</Line>
        <Line>📞 Sună.</Line>
        <Line>💬 Discută.</Line>
        <Line>🤝 Negociază.</Line>
        <Line>💰 Salvează bani.</Line>
      </Section>

      <CTAWrap>
        <CTAButton
          variant="contained"
          onClick={() => router.push("/")}
          aria-label="Caută anunțuri pe eProprietar.ro"
        >
          Caută anunțuri acum
        </CTAButton>
      </CTAWrap>

      <Divider />

      <Closing>
        <Typography gutterBottom>Succes la cumpărare și închiriere!</Typography>
        <Typography fontWeight={700}>Cu respect,</Typography>
        <Typography>Echipa eProprietar.ro</Typography>
      </Closing>
    </PageWrap>
  );
}
