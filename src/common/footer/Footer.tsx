"use client";

import * as palette from "../../constants/colors";

import { BookPromoSection } from "../bookPromotionSection/BookPromoSection";
import { Flex } from "../../common/flex/Flex";
import Image from "next/image";
import React from "react";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import facebookLogo from "../../assets/facebook-logo.svg";
import instagramLogo from "../../assets/instagram-logo.svg";
import linkedinIcon from "../../assets/linkedin-logo.svg";
import logo from "../../assets/footer-secure-logo.svg";
import styled from "styled-components";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import youTubeIcon from "../../assets/youtube-logo.svg";

const FooterContainer = styled.footer<{ $padding: string }>`
  background: #f9f9f9;
  box-shadow: 0 -2px 6px rgba(0,0,0,0.1);
  color: #575f7f;
  padding: ${(props) => props.$padding};
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 32px;
  margin-top: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0; /* prevents grid overflow/push */
  box-sizing: border-box;
`;

const SectionTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  color: #333;
`;

const Link = styled.div`
  font-size: 13px;
  color: #575f7f;
  cursor: pointer;
  &:hover {
    color: ${palette.COLOR_PRIMARY};
  }
`;

/* Ghid buttons: stable 2x2, stack to 1 on mobile */
const GuideButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 12px;
  row-gap: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const GuideButton = styled.div`
  width: 100%;
  padding: 10px 12px;
  background: ${palette.COLOR_PRIMARY};
  color: white;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;

  display: -webkit-box;
  -webkit-line-clamp: 2;     /* keep height consistent if text longer */
  -webkit-box-orient: vertical;
  overflow: hidden;

  min-height: 44px;          /* consistent visual height */
  line-height: 1.2;
  word-break: break-word;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &:hover {
    background: ${palette.COLOR_BORDER_PRIMARY};
  }
`;

const SocialTitle = styled.h5`
  margin: 32px 0 12px;
  color: #666;
  text-align: center;  /* center horizontally */
  width: 100%;
`;

const SocialRow = styled(Flex)`
  gap: 12px;
  margin-bottom: 16px;
  justify-content: center; /* center icons under title */
`;

const LinkIcon = styled.a`
  width: 42px;
  height: 42px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Subfooter = styled(Flex)`
  font-size: 0.85rem;
  font-weight: 400;
  color: #8c8c8c;
  text-align: center;
  margin-top: 12px;
`;

const Footer = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);
  const date = new Date();

  const goTo = (item: { link: string; external?: boolean }) => {
    if (item.external) return window.open(item.link, "_blank");
    router.push(item.link);
  };

  return (
    <FooterContainer $padding={isMobile ? "24px" : "40px 80px"}>
      {/* Promo carte deasupra footer-ului */}
      <BookPromoSection />

      <FooterGrid>
        {/* Navigare principală */}
        <Section>
          <SectionTitle>Navigare</SectionTitle>
          <Link onClick={() => goTo({ link: "/about-us" })}>Despre noi</Link>
          <Link onClick={() => goTo({ link: "/my-account" })}>Contul meu</Link>
          <Link onClick={() => goTo({ link: "/create-announcement" })}>Adaugă anunț</Link>
          <Link onClick={() => goTo({ link: "/contact" })}>Contact</Link>
        </Section>

        {/* Pentru cine */}
        <Section>
          <SectionTitle>Servicii dedicate</SectionTitle>
          <Link onClick={() => goTo({ link: "/for-buyers" })}>Pentru cumpărători</Link>
          <Link onClick={() => goTo({ link: "/for-owners" })}>Pentru proprietari</Link>
          <Link onClick={() => goTo({ link: "/for-developers" })}>Pentru dezvoltatori imobiliari</Link>
          <Link onClick={() => goTo({ link: "/for-exclusive-agents" })}>
            Pentru agenți imobiliari în regim de exclusivitate
          </Link>

        </Section>

        {/* Ghid imobiliar – 4 butoane în 2 coloane */}
        <Section>
          <SectionTitle>Ghid imobiliar</SectionTitle>
          <GuideButtonsGrid>
            <GuideButton onClick={() => goTo({ link: "/guide/tenants" })}>
              Ghid pentru chiriași
            </GuideButton>
            <GuideButton onClick={() => goTo({ link: "/guide/owners-sale" })}>
              Ghid pentru proprietari (vânzare)
            </GuideButton>
            <GuideButton onClick={() => goTo({ link: "/guide/owners-rent" })}>
              Ghid pentru proprietari (închiriere)
            </GuideButton>
            <GuideButton onClick={() => goTo({ link: "/guide/buyers" })}>
              Ghid pentru cumpărători
            </GuideButton>
          </GuideButtonsGrid>
        </Section>

        {/* Informații legale */}
        <Section>
          <SectionTitle>Informații</SectionTitle>
          <Link onClick={() => goTo({ link: "/privacy-policy" })}>
            Termeni și condiții
          </Link>
          <Link onClick={() => goTo({ link: "/gdpr" })}>
            Politica de confidențialitate și GDPR
          </Link>
          <Link onClick={() => goTo({ link: "/cookies" })}>
            Politica cookie
          </Link>
          <Link onClick={() => goTo({ link: "https://www.anpc.ro/", external: true })}>
            ANPC
          </Link>
        </Section>
      </FooterGrid>

      {/* Social media */}
      <SocialTitle>Suntem prezenți și pe social media:</SocialTitle>
      <SocialRow>
        <LinkIcon href="https://www.facebook.com/www.eproprietar.ro" target="_blank">
          <Image src={facebookLogo} alt="Facebook" width={42} height={42} />
        </LinkIcon>
        <LinkIcon href="https://www.instagram.com/eproprietar.ro/" target="_blank">
          <Image src={instagramLogo} alt="Instagram" width={42} height={42} />
        </LinkIcon>
        <LinkIcon href="https://www.youtube.com/channel/UCTaDzhfaUZoljhvKBdU1_5A" target="_blank">
          <Image src={youTubeIcon} alt="YouTube" width={42} height={42} />
        </LinkIcon>
        <LinkIcon href="https://www.linkedin.com/company/eproprietar/" target="_blank">
          <Image src={linkedinIcon} alt="LinkedIn" width={42} height={42} />
        </LinkIcon>
      </SocialRow>
      
      {/* Subfooter */}
      <Subfooter $justifyContent={"center"}>
        © {date.getFullYear()} eProprietar.ro - Imo Casa Solutions S.R.L., CIF: 36270153, REG. COM.: J12/2530/2016
      </Subfooter>
    </FooterContainer>
  );
};

export default Footer;