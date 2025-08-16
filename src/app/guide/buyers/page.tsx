// app/ghid/proprietari-cumparare/page.tsx (or your current route)
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

export default function ProprietariCumparareGuidePage() {
  return (
    <Layout>
      <Page>
        {/* HERO */}
        <Hero>
          <HeroTitle>Ghid pentru proprietari – Cumpărare imobil</HeroTitle>
          <Tag>www.eproprietar.ro</Tag>
          <Divider />
        </Hero>

        {/* Intro */}
        <Section>
          <Lead>
            www.eproprietar.ro  - Cel mai mare site de anunțuri imobiliare destinat
            clienților care doresc să Vândă direct la Client, fără comisioane; să
            Cumpere sau să Închirieze imobile DIRECT DE LA PROPRIETAR. Vă ajutăm să
            cumpărați propria casă fără a utiliza un agent imobiliar tradițional și fără
            a plăti comisioane de mii de euro agentului sau agenției imobiliare.
          </Lead>
          <Lead>Economisiți mii de euro cumpărând Direct de la Proprietar  ... :)</Lead>
        </Section>

        {/* Warning */}
        <Section>
          <Lead style={{ fontWeight: 700 }}>
            Intro: NU PLĂTI AVANS LA IMOBIL PÂNĂ NU VERIFICI ACTELE DE PROPRIETATE LA NOTAR!!!
          </Lead>
        </Section>

        {/* Buget / Finanțare */}
        <Section>
          <SectionHeader>
            <h2>Stabilirea bugetului / Finanțare</h2>
          </SectionHeader>
          <P>
            Totul începe cu „vreau să-mi iau apartament/casă”, „Am nevoie de mai mult spațiu”,
            „Urmează să avem un copil”, „Nu mai vreau chirie”.
          </P>
          <P>
            Pentru achiziționarea unui imobil setați bugetul de achiziție – fie în funcție
            de suma cash disponibilă, fie de suma ce poate fi contractată de la bancă.
            Înainte de vizionări, aflați clar pe ce sumă vă puteți baza. Comparați ofertele
            de credite la mai multe bănci sau brokeri (pot exista diferențe considerabile de dobândă).
          </P>
          <P>
            Creditele pentru achiziția de locuințe sunt: creditul Prima Casă și creditul ipotecar.
            Dacă dețineți banii cash, tranzacția se realizează prin virament bancar/cash, direct la notar.
          </P>
        </Section>

        {/* Obiectiv / Zonă */}
        <Section>
          <SectionHeader>
            <h2>Stabilirea obiectivului / tipul de locuință</h2>
          </SectionHeader>
          <P>
            Definește criteriile generale de achiziție: zonă, preț, număr de camere, etaj,
            configurație, grad de finisare, parcare/garaj, interese personale (școală,
            grădiniță, supermarket, piață, aproape de locul de muncă etc.).
          </P>

          <SectionHeader>
            <h2>Alegerea zonei</h2>
          </SectionHeader>
          <P>
            Cel mai important element în cumpărare: LOCAȚIA! LOCAȚIA! LOCAȚIA!
            Cartierul îți definește calitatea vieții. Accesul la punctele de interes îți
            poate ușura sau complica viața (școală, grădiniță, supermarket, piață, job,
            instituții publice, transport). E greu să le ai pe toate; bifează cât mai multe.
          </P>
        </Section>

        {/* Verificare calitate imobil */}
        <Section>
          <SectionHeader>
            <h2>Verificare calitate imobil</h2>
          </SectionHeader>
          <List>
            <li>
              <strong>Contextul vecinătății</strong> — Parc (priveliște, liniște), școală/grădiniță (trafic la anumite ore, dar util dacă ai copii), teren liber (posibile construcții viitoare), vecinătatea unui stadion sau instituții publice etc.
            </li>
            <li>
              <strong>Parcare / garaj – recomandat să cumpărați</strong> — Deși efort suplimentar la achiziție, parcarea sau garajul aduc plus valoare, economie de timp și lichiditate la revânzare. Chiar fără mașină, locul se poate închiria.
            </li>
          </List>
        </Section>

        {/* Vizionările */}
        <Section>
          <SectionHeader>
            <h2>Vizionările</h2>
          </SectionHeader>
          <P>
            Vezi cât mai multe imobile apropiate de cerințele tale: vei înțelege piața,
            vei avea repere de diferențiere, vei putea compara și negocia, și nu vei rămâne
            cu regretul că „poate erau și altele mai bune”. Nu uita: <b>cumperi o dată,
            trăiești mult timp în el!</b>
          </P>
        </Section>

        {/* Negocierea */}
        <Section>
          <SectionHeader>
            <h2>Negocierea</h2>
          </SectionHeader>
          <P>
            Procesul de negociere poate realiza sau anula tranzacția. Menține o atitudine
            pozitivă; nu reacționa imediat la o contraofertă nefavorabilă – poți reveni
            după câteva zile pentru o renegociere. Negocierile sunt deseori emoționale:
            proprietarul ține la preț, tu vrei cel mai bun preț posibil.
          </P>
          <P>
            Conform statisticilor, negocierile de preț pe piața imobiliară din România se
            situează la aproximativ 4–5% din preț. Dacă intervine o agenție imobiliară,
            negocierea poate fi mai dificilă, deoarece în preț se regăsește și comisionul agenției.
          </P>
        </Section>

        {/* Asociație */}
        <Section>
          <SectionHeader>
            <h2>Asociație – locatari</h2>
          </SectionHeader>
          <P>
            După ce ai clar detaliile tehnice și prețul, înainte de semnare discută cu
            Administratorul de bloc: afli dacă există probleme în asociație. Verifică
            avizierul de cheltuieli (nu vrei restanțe mari). Observă vecinii de deasupra
            și dedesubt – vrei să eviți posibile neplăceri ulterioare.
          </P>
        </Section>

        {/* Acte necesare */}
        <Section>
          <SectionHeader>
            <h2>Acte necesare contract cumpărare</h2>
          </SectionHeader>
          <P>Documentele necesare pentru încheierea unui contract de vânzare sunt:</P>
          <List>
            <li>
              <strong>Acte de identitate ale părților</strong> — Vânzător și cumpărător; certificate de căsătorie (dacă este cazul); procură de reprezentare (dacă este cazul).
            </li>
            <li>
              <strong>Acte de proprietate (Vânzător)</strong> — Contract de vânzare, donație, proces-verbal de predare-primire, dovada achitării integrale a prețului, sentință/decizie civilă definitivă și irevocabilă, titlu de proprietate, certificat de moștenitor etc.
            </li>
            <li>
              <strong>Documentație cadastrală (Vânzător)</strong> — Fișa bunului imobil și planul de amplasament, planul releveu și încheierea de intabulare în cartea funciară.
            </li>
            <li>
              <strong>Certificat fiscal (Vânzător)</strong> — Eliberat de Direcția de impozite și taxe locale, atestă plata la zi.
            </li>
            <li>
              <strong>Certificat de performanță energetică (Vânzător)</strong> — Eliberat de un auditor energetic atestat.
            </li>
            <li>
              <strong>Adeverință asociație (Vânzător, pentru apartamente)</strong> — Situația datoriilor către asociație (întreținere, reparații, cheltuieli comune etc.).
            </li>
            <li>
              <strong>Utilități la zi (Vânzător)</strong> — Ultima factură și chitanță pentru utilitățile aferente imobilului.
            </li>
          </List>
        </Section>

        {/* Impozit și taxe notariale */}
        <Section>
          <SectionHeader>
            <h2>Impozit și taxe notariale</h2>
          </SectionHeader>
          <P style={{ marginBottom: 4 }}>
            <b>De plătit și cine plătește:</b>
          </P>
          <List>
            <li>Onorariu contract vânzare — Se achită de către cumpărător.</li>
            <li>Taxa ANCPI-OCPI (intabulare) — Se achită de către cumpărător.</li>
            <li>Impozit către Stat — Se achită de către vânzător.</li>
          </List>

          <Divider />

          <P style={{ marginTop: 10 }}>
            <b>Calcul impozit (conform legislației în vigoare):</b>
          </P>
          <List>
            <li>Dacă prețul este sub 450.000 Lei → impozit 0 Lei</li>
            <li>Pentru ce depășește 450.000 Lei → 3% din diferență</li>
          </List>

          <P style={{ fontWeight: 700, marginTop: 10 }}>Exemplu (aprox. 100.000 €):</P>
          <P>Valoare vânzare – 477.880 lei</P>
          <P>Onorariu contract vânzare – 5.101 lei</P>
          <P>Taxa ANCPI-OCPI intabulare – 717 lei</P>
          <P>Impozit către Stat – 836 lei</P>
          <P style={{ fontStyle: "italic" }}>
            Notă: calculele sunt orientative și se pot modifica în funcție de schimbările legislative.
          </P>
        </Section>

        {/* Closing */}
        <Section>
          <Lead style={{ fontWeight: 700 }}>Succes la cumpărat!</Lead>
          <Lead>Echipa www.eproprietar.ro</Lead>
        </Section>
      </Page>
    </Layout>
  );
}
