// app/for-developers/page.tsx
"use client";

import * as palette from "@/constants/colors";

import { Flex } from "@/common/flex/Flex";
import { Layout } from "@/common/layout/Layout";
import React from "react";
import styled from "styled-components";

/* =========================
   Layout & Typography (shared style system)
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

const HeroSubtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: #475569;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e6eaf2;
  margin: 20px auto;
  width: 100%;
`;

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
`;

const List = styled.ul`
  margin: 4px 0 0 18px;
  padding: 0;
  color: #334155;
  font-size: 15px;

  li {
    margin-bottom: 6px;
    line-height: 1.6;
  }
`;

/* Tags / badges */
const TagRow = styled(Flex)`
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 999px;
  background: #f3f8ff;
  color: ${palette.COLOR_PRIMARY};
  border: 1px solid #d8e7fb;
`;

/* Link highlight */
const LinkHighlight = styled.a`
  color: ${palette.COLOR_PRIMARY ?? "#0ea5e9"};
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

/* Inline highlight */
const Highlight = styled.span`
  color: ${palette.COLOR_PRIMARY ?? "#0ea5e9"};
  font-weight: 700;
`;

/* =========================
   Page
   ========================= */

export default function ForDevelopersPage() {
  return (
    <Layout>
      <Page>
        {/* HERO */}
        <Hero>
          <HeroTitle>🏗️ eProprietar.ro – Spațiul ideal pentru dezvoltatorii imobiliari</HeroTitle>
          <HeroSubtitle>
            Mai multe oferte pentru cumpărători. Mai mulți clienți pentru vânzători. Totul, fără comisioane.
          </HeroSubtitle>
          <Divider />
        </Hero>

        {/* Misiune */}
        <Section>
          <SectionHeader>
            <span>🎯</span>
            <h2>Misiunea noastră</h2>
          </SectionHeader>
          <Lead>
            La eProprietar.ro, ne propunem să oferim cea mai variată selecție de <strong>LOCUINȚE NOI</strong> pentru cumpărători
            și să livrăm cea mai bună valoare pentru vânzători – fie că sunt dezvoltatori imobiliari, proprietari sau agenți cu exclusivitate.
          </Lead>

          {/* keep original chip texts as tags */}
          <TagRow>
            <Tag>✅ Mai multe opțiuni pentru cumpărători</Tag>
            <Tag>✅ Mai mulți clienți pentru vânzători</Tag>
            <Tag>🔁 Fără comisioane, fără intermediari, fără complicații</Tag>
          </TagRow>
        </Section>

        {/* Ansambluri rezidențiale */}
        <Section>
          <SectionHeader>
            <span>🏘️</span>
            <h2>Ansambluri rezidențiale – o secțiune dedicată proiectelor noi</h2>
          </SectionHeader>
          <Lead>
            Am creat o secțiune specială – <strong>ANSAMBLURI REZIDENȚIALE</strong> – pentru a facilita
            accesul rapid și eficient la proiectele de locuințe noi.
          </Lead>

          <Lead style={{ fontWeight: 700 }}>✔️ Avantajele dezvoltatorilor:</Lead>
          <List>
            <li>📣 Promovare națională intensă</li>
            <li>🚀 Vizibilitate extinsă și brand awareness</li>
            <li>📩 Lead-uri directe, calificate</li>
            <li>📞 Contact direct cu potențialii cumpărători</li>
            <li>💸 Economisiți comisioane de la 2% până la 4% din cifra de afaceri</li>
            <li>🎯 Realizați mai rapid și mai ușor targetele de vânzări</li>
            <li>📊 Targeturi de vânzări atinse mai ușor și mai repede</li>
          </List>
        </Section>

        {/* Tipuri proiecte */}
        <Section>
          <SectionHeader>
            <span>🔎</span>
            <h2>Ce tipuri de proiecte pot fi promovate?</h2>
          </SectionHeader>
          <List>
            <li>• Locuințe individuale sau colective</li>
            <li>• Ansambluri rezidențiale</li>
            <li>• Clădiri mixte</li>
            <li>• Proiecte logistice sau comerciale</li>
            <li>• Imobile aflate în diverse stadii de dezvoltare</li>
          </List>
          <Lead>
            Dacă vinzi <strong>locuințe noi</strong> – locul tău este aici.
          </Lead>
        </Section>

        {/* Tranzacții directe */}
        <Section>
          <SectionHeader>
            <span>🤝</span>
            <h2>O platformă construită pentru tranzacții directe</h2>
          </SectionHeader>
          <Lead>
            eProprietar.ro funcționează pe un model clar și cinstit: <strong>VÂNZARE DIRECTĂ</strong> între dezvoltator și client.
          </Lead>

          <TagRow>
            <Tag>✔️ Fără comisioane de ambele părți</Tag>
            <Tag>✔️ Fără implicarea agențiilor imobiliare</Tag>
            <Tag>✔️ Fără pierderi de timp sau promisiuni goale</Tag>
          </TagRow>
          <TagRow>
            <Tag>💬 Discuți direct</Tag>
            <Tag>🤝 Negociezi direct</Tag>
            <Tag>🏡 Vinzi direct</Tag>
          </TagRow>
        </Section>

        {/* Experiență modernă */}
        <Section>
          <SectionHeader>
            <span>💡</span>
            <h2>O experiență modernă și interactivă pentru utilizatori</h2>
          </SectionHeader>
          <Lead>
            Noua platformă <strong>www.eproprietar.ro</strong> va fi actualizată
            constant pentru a fi în permanență la înălțimea așteptărilor
            clienților, care se vor bucura de și mai multă interactivitate și de
            noi funcționalități care vor crea instant legături între utilizatori,
            transformând orice accesare într-o experiență ușoară și memorabilă.
          </Lead>
        </Section>

        {/* Investim în promovare */}
        <Section>
          <SectionHeader>
            <span>📣</span>
            <h2>Investim constant în promovarea ta!</h2>
          </SectionHeader>
          <Lead>Echipa eProprietar.ro pune accent pe:</Lead>
          <List>
            <li>✅ Campanii de promovare la nivel național</li>
            <li>✅ Expunere individuală pentru proiectele tale, la nivel local</li>
            <li>✅ Strategii care reduc costurile tale de marketing și publicitate</li>
            <li>✅ Construirea brandului tău în rândul publicului țintă</li>
          </List>
        </Section>

        {/* Contact */}
        <Section>
          <SectionHeader>
            <span>✉️</span>
            <h2>Vrei o ofertă personalizată de promovare?</h2>
          </SectionHeader>
          <Lead>
            📧 Scrie-ne la:{" "}
            <LinkHighlight href="mailto:marketing@eproprietar.ro">
              marketing@eproprietar.ro
            </LinkHighlight>
            <br />
            Îți vom trimite un pachet adaptat nevoilor și obiectivelor tale.
          </Lead>
        </Section>

        {/* Închidere */}
        <Section>
          <Lead style={{ fontWeight: 800, fontSize: 16 }}>Succes în vânzări!</Lead>
          <Lead>
            Cu respect,
            <br />
            Echipa <Highlight>www.eproprietar.ro</Highlight>
          </Lead>
        </Section>
      </Page>
    </Layout>
  );
}
