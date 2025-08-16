"use client";

import * as palette from "@/constants/colors";

import { Flex } from "@/common/flex/Flex";
import React from "react";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import styled from "styled-components";
import { useRouter } from "next/navigation";

/* =========================
   Layout & Typography
   ========================= */

const Page = styled.main<{ $pad: string }>`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${(p) => p.$pad};
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
`;

/* Lists */
const BulletList = styled.ul`
  margin: 8px 0 0 18px;
  padding: 0;
  color: #334155;
  font-size: 14px;

  li {
    margin-bottom: 6px;
  }
`;

/* Two-column grid for the “Pentru vizitatori / Pentru cei care listează” block */
const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e9eef5;
  border-radius: 10px;
  padding: 16px;
`;

const Quote = styled.p`
  margin: 10px 0 0;
  padding-left: 10px;
  border-left: 3px solid ${palette.COLOR_PRIMARY};
  color: #475569;
  font-style: italic;
  font-size: 14px;
`;

/* Highlights / tags */
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

/* CTAs */
const CTAWrap = styled(Flex)`
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
`;

const CTAButton = styled.button`
  appearance: none;
  border: 1px solid ${palette.COLOR_PRIMARY};
  background: ${palette.COLOR_PRIMARY};
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${palette.COLOR_BORDER_PRIMARY};
    border-color: ${palette.COLOR_BORDER_PRIMARY};
  }
`;

const SecondaryButton = styled(CTAButton)`
  background: #ffffff;
  color: ${palette.COLOR_PRIMARY};

  &:hover {
    background: #f7fbff;
  }
`;

/* Small helper */
const SmallMuted = styled.p`
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
`;

/* =========================
   Page Component
   ========================= */

const AboutUsPage = () => {
  const router = useRouter();
  const isMobile = typeof window !== "undefined" && window.innerWidth <= SIZES_NUMBER_TINY_SMALL;

  const go = (href: string) => router.push(href);

  return (
    <Page $pad={isMobile ? "18px 16px 24px" : "26px 20px 40px"}>
      {/* HERO */}
      <Hero>
        <HeroTitle>
          Platforma unde <strong>PROPRIETARII reali</strong> întâlnesc{" "}
          <strong>CUMPĂRĂTORII reali</strong>.
        </HeroTitle>
        <HeroSubtitle>
          Fără comisioane. Fără stres. Fără „s-a dat, dar avem altceva”.
        </HeroSubtitle>
        <Divider />
      </Hero>

      {/* Cine suntem */}
      <Section>
        <SectionHeader>
          <span>👋</span>
          <h2>Cine suntem?</h2>
        </SectionHeader>
        <Lead>
          Suntem o platformă independentă și transparentă, creată din dorința de a curăța piața
          imobiliară din România.
        </Lead>
        <Lead>
          <strong>eProprietar.ro</strong> este locul unde:
        </Lead>
        <BulletList>
          <li>✅ Cumpărătorii și chiriașii găsesc anunțuri clare, publicate de oameni reali</li>
          <li>
            ✅ Proprietarii, dezvoltatorii și agenții în regim de exclusivitate își pot promova
            imobilele într-un mediu curat, profesionist și eficient
          </li>
        </BulletList>
      </Section>

      {/* Pentru vizitatori + Pentru cei care listează */}
      <ResponsiveGrid>
        <Card>
          <SectionHeader>
            <span>🔍</span>
            <h2>Pentru vizitatori – Vrei să cumperi sau să închiriezi?</h2>
          </SectionHeader>
          <Lead>💥 Uită de comisioane, telefoane inutile și anunțuri înșelătoare!</Lead>
          <BulletList>
            <li>✅ Acces gratuit și nelimitat la mii de anunțuri</li>
            <li>📞 Contact direct cu proprietarul – fără intermediari</li>
            <li>💬 Discuții reale, negocieri directe</li>
            <li>📲 Actualizări în timp real – vezi doar ce este disponibil</li>
            <li>💰 Fără comisioane, fără pierderi de timp</li>
          </BulletList>
          <Quote>
            „Vrei să cumperi, nu să fii plimbat cu vorba.” De aceea ești aici. Și noi știm asta.
          </Quote>
          <CTAWrap>
            <CTAButton onClick={() => go("/")}>Caută anunțuri</CTAButton>
            <SecondaryButton onClick={() => go("/ghid/cumparatori")}>
              Ghid pentru cumpărători
            </SecondaryButton>
          </CTAWrap>
        </Card>

        <Card>
          <SectionHeader>
            <span>🏡</span>
            <h2>Pentru cei care listează – Proprietari, dezvoltatori, agenți exclusivi</h2>
          </SectionHeader>
          <Lead>🔔 Vrei ca anunțul tău să ajungă în fața oamenilor potriviți?</Lead>
          <Lead>
            <strong>eProprietar.ro</strong> este locul ideal să-ți promovezi proprietatea!
          </Lead>
          <Lead><strong>Ce oferim:</strong></Lead>
          <BulletList>
            <li>🎯 Public țintă interesat să cumpere sau să închirieze direct</li>
            <li>📢 Promovare organizată, fără „zgomot” inutil</li>
            <li>🏢 Vizibilitate pentru ansambluri rezidențiale, clădiri, parcuri logistice</li>
            <li>🔐 Spațiu dedicat agenților cu reprezentare exclusivă – fără concurență neloială</li>
          </BulletList>
          <Quote>
            „Anunțul tău nu se pierde în mulțime. La noi, el iese în evidență.”
          </Quote>
          <CTAWrap>
            <CTAButton onClick={() => go("/create-announcement")}>Publică un anunț</CTAButton>
            <SecondaryButton onClick={() => go("/ghid/proprietari-vanzare")}>
              Ghid proprietari (vânzare)
            </SecondaryButton>
            <SecondaryButton onClick={() => go("/ghid/proprietari-inchiriere")}>
              Ghid proprietari (închiriere)
            </SecondaryButton>
          </CTAWrap>
        </Card>
      </ResponsiveGrid>

      {/* De ce eProprietar */}
      <Section>
        <SectionHeader>
          <span>⚡</span>
          <h2>De ce eProprietar.ro?</h2>
        </SectionHeader>
        <Lead>Pentru că...</Lead>
        <BulletList>
          <li>🔹 Știm că ai pierdut timp cu anunțuri false</li>
          <li>🔹 Știm că ai sunat la zeci de oferte care nu mai există</li>
          <li>🔹 Știm că ți s-a schimbat prețul pe drum</li>
          <li>🔹 Știm că te-ai săturat să fii păcălit</li>
        </BulletList>
        <Lead>Și exact din acest motiv existăm NOI.</Lead>
      </Section>

      {/* Valori */}
      <Section>
        <SectionHeader>
          <span>🎯</span>
          <h2>eProprietar.ro este:</h2>
        </SectionHeader>
        <TagRow>
          <Tag>✔️ Curat</Tag>
          <Tag>✔️ Eficient</Tag>
          <Tag>✔️ Corect</Tag>
          <Tag>✔️ Prietenos</Tag>
          <Tag>✔️ Gratuit pentru cumpărători</Tag>
        </TagRow>
      </Section>

      {/* CTA final */}
      <Section>
        <Lead>
          📲 Intră acum pe <strong>eProprietar.ro</strong> și descoperă imobiliarele fără filtre,
          fără comisioane, fără minciuni.
        </Lead>
        <CTAWrap>
          <CTAButton onClick={() => go("/")}>Începe să cauți</CTAButton>
          <SecondaryButton onClick={() => go("/create-announcement")}>
            Publică un anunț
          </SecondaryButton>
        </CTAWrap>
        <SmallMuted>Cu respect, Echipa eProprietar.ro</SmallMuted>
      </Section>
    </Page>
  );
};

export default AboutUsPage;
