// app/ghid/proprietari-inchiriere/page.tsx (or your current route)
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

const Tag = styled.span`
  display: inline-block;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #d8e7fb;
  background: #f3f8ff;
  color: ${palette.COLOR_PRIMARY};
  font-size: 12px;
  font-weight: 700;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e6eaf2;
  margin: 20px auto;
  width: 100%;
`;

/* Sections */
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
  line-height: 1.7;
  white-space: pre-line;
`;

const P = styled.p`
  margin: 8px 0;
  color: #334155;
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-line;
`;

const List = styled.ul`
  margin: 6px 0 0 18px;
  padding: 0;
  color: #334155;
  font-size: 15px;

  li {
    margin-bottom: 6px;
    line-height: 1.6;
  }
`;

/* =========================
   Page
   ========================= */

export default function ProprietariInchiriereGuidePage() {
  return (
    <Layout>
      <Page>
        {/* HERO */}
        <Hero>
          <HeroTitle>Ghid pentru proprietari – Închiriere imobil</HeroTitle>
          <Tag>www.eproprietar.ro</Tag>
          <Divider />
        </Hero>

        {/* Intro */}
        <Section>
          <Lead>
            www.eproprietar.ro  - Cel mai mare site de anunțuri imobiliare destinat
            clienților care doresc să Vândă direct la Client, fără comisioane; să
            Cumpere sau să Închirieze imobile DIRECT DE LA PROPRIETAR. Vă ajutăm să
            închiriați propria casă fără a utiliza un agent imobiliar tradițional și
            fără a plăti comisioane de mii de euro agentului sau agenției imobiliare.
          </Lead>
          <Lead>
            Economisiți mii de euro vânzându-vă direct casa la clienți  ... :)
          </Lead>
        </Section>

        {/* Scop / Preț / Timp */}
        <Section>
          <SectionHeader>
            <h2>Scopul ghidului</h2>
          </SectionHeader>
          <Lead>
            Dorim prin acest Ghid să vă oferim sfaturile și informația necesară în
            procesul de Închiriere.
          </Lead>

          <SectionHeader>
            <h2>Stabilirea prețului</h2>
          </SectionHeader>
          <Lead>
            Este important, când stabiliți prețul, să vă documentați asupra prețurilor
            pieței imobiliare. Pentru a stabili prețul, poți analiza ofertele de
            imobile de pe piață sau poți apela la agenți imobiliari care oferă
            servicii de consultanță și evaluare. Este important ca prețul stabilit să
            fie în media de preț a zonei. Un preț stabilit corect vă aduce
            posibilitatea să închiriați mai repede!
          </Lead>

          <SectionHeader>
            <h2>Timp de închiriere</h2>
          </SectionHeader>
          <Lead>
            Conform statisticilor din ultimele luni, pe piața imobiliară din România
            timpul mediu de închiriere pentru apartamente este de aproximativ 1–4
            săptămâni, iar pentru case 2–4 luni.
          </Lead>
        </Section>

        {/* Promovare */}
        <Section>
          <SectionHeader>
            <h2>Promovare imobil</h2>
          </SectionHeader>
          <Lead>
            www.eproprietar.ro este cel mai mare site din România cu anunțuri
            imobiliare <b>EXCLUSIV</b> de la Proprietari și Dezvoltatori Imobiliari,
            unde vă puteți promova direct către toți clienții existenți. Publicând
            anunțul de închiriere pe site, șansele dumneavoastră de închiriere cresc
            considerabil, iar timpul de închiriere se scurtează. Redarea anunțurilor se
            face în timeline (scroll continuu, nu pe mai multe pagini cum este pe alte
            site-uri) – astfel toți clienții vor vedea anunțul tău!
          </Lead>
          <Lead>
            Pe platforma www.eproprietar.ro Agențiile Imobiliare au accesul
            restricționat la publicarea de anunțuri. <b>Doar proprietarii</b> pot
            publica anunțuri!
          </Lead>
        </Section>

        {/* Redactare anunț */}
        <Section>
          <SectionHeader>
            <h2>Redactare anunț de închiriere</h2>
          </SectionHeader>
          <Lead>
            Te sfătuim să redactezi un anunț cu informații cât mai complete și reale,
            care să cuprindă neapărat următoarele elemente:
          </Lead>
          <List>
            <li>
              <strong>Titlu anunț</strong> — Redactează un titlu atractiv pentru tipul imobilului (apartament, casă, spațiu comercial, alte imobile).
            </li>
            <li>
              <strong>Descriere</strong> — Detaliază toate elementele descriptive: zona și strada, etajul, numărul de camere, suprafețele (utilă, construită, teren, front stradal), compartimentare, confort, număr bucătării/băi, utilități, finisaje, dotări, servicii, parcări, vedere/priveliște, avantaje ale zonei (școli, grădinițe, parcuri, transport, magazine/mall/supermarket, pădure, lac, instituții, centru de afaceri etc.).
            </li>
            <li>
              <strong>Fotografii</strong> — Fotografiile sunt esențiale: clientul vede pozele înainte să citească descrierea. Pozează interiorul și/sau exteriorul, camerele și detaliile care scot în evidență imobilul. Înainte de fotografii, fă o rearanjare și o curățenie de întreținere pentru o prezentare mai bună.
            </li>
            <li>
              <strong>Specificații / criterii pentru chiriași</strong> — Dacă nu doriți un anumit tip de chiriași, specificați în anunț (ex.: nu studenți, nefumători, fără animale). Dacă aveți un target preferat, menționați-l. Triage-ul din anunț economisește timp pentru ambele părți.
            </li>
          </List>
        </Section>

        {/* Primirea clienților */}
        <Section>
          <SectionHeader>
            <h2>Primirea clienților la vizionare</h2>
          </SectionHeader>
          <Lead>
            Clientul trebuie primit la ore adecvate; puteți stabili chiar și un orar de
            vizite. Înainte de vizionare: curățenie de întreținere, hainele strânse,
            igienizarea băilor și a bucătăriei, aerisiți imobilul. De obicei
            vizionările sunt rapide – cereți datele de contact, reveniți ulterior cu o
            invitație la o nouă vizionare pentru discuții detaliate și finalizarea
            închirierii.
          </Lead>
        </Section>

        {/* Negocierea */}
        <Section>
          <SectionHeader>
            <h2>Negocierea</h2>
          </SectionHeader>
          <List>
            <li>
              <strong>Analizează propunerile cu calm</strong> — Nu te grăbi să refuzi. Analizează informația, renegociază în termenii doriți, fii flexibil și ține cont de contextul procesului de închiriere.
            </li>
            <li>
              <strong>Menține dialogul deschis</strong> — Analizează toate propunerile, evită refuzurile categorice și lasă loc de discuții cu fiecare ofertant.
            </li>
            <li>
              <strong>Bate palma</strong> — Alege oferta cea mai convenabilă pentru tine și pentru client și încheiați înțelegerea.
            </li>
          </List>
        </Section>

        {/* Acte necesare */}
        <Section>
          <SectionHeader>
            <h2>Acte necesare pentru contractul de închiriere</h2>
          </SectionHeader>
          <Lead>
            Documentele necesare pentru încheierea unui contract de închiriere sunt:
          </Lead>
          <List>
            <li>
              <strong>Acte de identitate ale părților</strong> — Proprietar și chiriaș.
            </li>
            <li>
              <strong>Acte de proprietate</strong> — Documente privind dreptul de proprietate (după caz: contract, proces-verbal de predare-primire, sentință/decizie civilă definitivă și irevocabilă, titlu de proprietate, certificat de moștenitor etc.).
            </li>
            <li>
              <strong>Documentație cadastrală</strong> — Fișa bunului imobil și planul de amplasament, planul releveu și încheierea de intabulare în cartea funciară.
            </li>
            <li>
              <strong>Certificat de performanță energetică</strong> — Eliberat de un auditor energetic atestat.
            </li>
          </List>
        </Section>

        {/* Closing */}
        <Section>
          <Lead style={{ fontWeight: 700 }}>Succes la închirieri!</Lead>
          <Lead>Echipa www.eproprietar.ro</Lead>
        </Section>
      </Page>
    </Layout>
  );
}
