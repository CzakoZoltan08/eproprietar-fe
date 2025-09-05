// app/ghid/chiriasi/page.tsx (or your current route)
"use client";

import * as palette from "@/constants/colors";

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

const SectionHeader = styled.div`
  display: flex;
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

export default function TenantsGuidePage() {
  return (
    <Layout>
      <Page>
        {/* HERO */}
        <Hero>
          <HeroTitle>Ghid pentru chiriași</HeroTitle>
          <Tag>www.eproprietar.ro</Tag>
          <Divider />
        </Hero>

        {/* Intro */}
        <Section>
          <Lead>
            www.eproprietar.ro – Cel mai mare site de anunțuri imobiliare destinat
            clienților care doresc să Vândă direct la Client, fără comisioane; să
            Cumpere sau să Închirieze imobile DIRECT DE LA PROPRIETAR. Vă ajutăm
            să închiriați propria locuință fără a utiliza un agent imobiliar
            tradițional și fără a plăti comisioane de sute de euro agentului sau
            agenției imobiliare.
          </Lead>
          <Lead>
            Economisiți sute de euro dacă închiriați Direct de la Proprietar ... :)
          </Lead>
        </Section>

        {/* Scop / Buget / Obiectiv / Zonă / Vizionări / Negociere */}
        <Section>
          <SectionHeader>
            <h2>Scopul ghidului</h2>
          </SectionHeader>
          <Lead>
            Dorim prin acest Ghid să vă oferim sfaturile și informația necesară în
            procesul de Închiriere.
          </Lead>

          <SectionHeader>
            <h2>Stabilirea bugetului</h2>
          </SectionHeader>
          <Lead>
            Atenție! Pentru stabilirea bugetului de închiriere trebuie să țineți cont și
            de viitoarele cheltuieli aferente imobilului (cheltuieli de întreținere,
            deplasare, eventuale reparații, îmbunătățiri). Întrebați și verificați
            nivelul cheltuielilor aferente imobilului (cereți ultimele facturi
            proprietarului, întrebați administratorul, consultați avizierul).
          </Lead>

          <SectionHeader>
            <h2>Stabilirea obiectivului / tipul de locuință</h2>
          </SectionHeader>
          <Lead>
            Definește criteriile generale de închiriere: zonă, preț, număr de camere,
            etaj, configurația, gradul de finisare, parcare/garaj, interese personale
            (școală, grădiniță, supermarket, piață, aproape de locul de muncă etc).
          </Lead>

          <SectionHeader>
            <h2>Alegerea zonei</h2>
          </SectionHeader>
          <Lead>
            Cel mai important element în închirierea unui imobil este: LOCAȚIA! LOCAȚIA!
            LOCAȚIA! Cartierul unde vei închiria îți va oferi serviciile și calitatea
            vieții. Accesul facil la punctele tale de interes îți va ușura sau complica
            viața de zi cu zi (școală, grădiniță, supermarket, piață, locul de muncă,
            instituții publice, mijloace de transport). De multe ori este greu să ai
            acces la toate beneficiile dorite datorită dezvoltării urbane; de aceea
            este bine să punctezi cât mai multe dintre ele.
          </Lead>

          <SectionHeader>
            <h2>Vizionările</h2>
          </SectionHeader>
          <Lead>
            Îți recomandăm să vezi cât mai multe imobile apropiate de cerințele tale.
            Vei vedea clar unde se situează piața imobiliară, vei avea repere clare de
            diferențiere a imobilelor, vei avea de unde să alegi și poți negocia mai
            multe imobile ca să vezi care îți este accesibil.
          </Lead>

          <SectionHeader>
            <h2>Negocierea</h2>
          </SectionHeader>
          <Lead>
            Procesul de negociere este momentul în care tranzacția se poate realiza sau
            se poate anula. Recomandăm să aveți o atitudine pozitivă, să nu reacționați
            imediat dacă propunerea vă este respinsă sau primiți o contraofertă care nu
            vă este pe plac; puteți reveni după câteva zile și încerca o renegociere.
            Țineți cont că negocierile sunt de cele mai multe ori emoționale – proprietarul
            ține la preț pentru că „e casa lui” și dorește să obțină un preț cât mai mare,
            iar dumneavoastră sunteți dispus să oferiți un preț cât mai mic sau unul pe
            care vi-l permiteți.
          </Lead>
          <Lead>
            Dacă tranzacția se realizează prin intermediul agenției imobiliare, țineți cont
            că negocierea prețului se va face mai greu, la mijloc fiind comisionul agenției
            imobiliare.
          </Lead>
        </Section>

        {/* Acte necesare */}
        <Section>
          <SectionHeader>
            <h2>Acte necesare pentru contractul de închiriere</h2>
          </SectionHeader>
          <List>
            <li>
              <strong>Acte de identitate părți</strong> — Proprietar și Chiriaș.
            </li>
            <li>
              <strong>Acte de proprietate asupra imobilului</strong> — Documente ale Proprietarului pentru imobilul ce face obiectul tranzacției (după caz: contract vânzare, contract de donație, proces-verbal de predare-primire, dovada de achitare integrală a prețului, sentință/decizie civilă definitivă și irevocabilă, titlu de proprietate, certificat de moștenitor etc.).
            </li>
            <li>
              <strong>Documentația cadastrală a bunului imobil</strong> — Fișa bunului imobil și planul de amplasament, planul releveu și încheierea de intabulare în cartea funciară.
            </li>
            <li>
              <strong>Certificatul de performanță energetică</strong> — Eliberat de un auditor energetic atestat (Proprietar).
            </li>
          </List>
        </Section>

        {/* Closing */}
        <Section>
          <Lead style={{ fontWeight: 700 }}>Succes la închiriat!</Lead>
          <Lead>Echipa www.eproprietar.ro</Lead>
        </Section>
      </Page>
    </Layout>
  );
}
