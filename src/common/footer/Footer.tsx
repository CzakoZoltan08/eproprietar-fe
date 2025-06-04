import * as palette from "../../constants/colors";

import { Flex } from "../../common/flex/Flex";
import Image from "next/image";
import React from "react";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import bannerImage from "../../assets/BookCoverImage.jpg";
import facebookLogo from "../../assets/facebook-logo.svg";
import instagramLogo from "../../assets/instagram-logo.svg";
import linkedinIcon from "../../assets/linkedin-logo.svg";
import logo from "../../assets/footer-secure-logo.svg";
import styled from "styled-components";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useRouter } from "next/navigation";
import youTubeIcon from "../../assets/youtube-logo.svg";

const FooterContainer = styled.footer<{ $padding: string }>`
  background: #eee;
  box-shadow: 0 4px 10px #000;
  /* increase height slightly to accommodate book section */
  min-height: 320px;
  color: #575f7f;
  padding: ${(props) => props.$padding};
`;

const Link = styled.div`
  font-size: 13px;
  color: #575f7f;
  cursor: pointer;
  &:hover {
    color: ${palette.COLOR_PRIMARY};
  }
`;

const LinkIcon = styled.a`
  width: 42px;
  height: 42px;
  cursor: pointer;
  svg {
    width: 100%;
    height: 100%;
  }
`;

// New styled wrapper for the book section
const BookSection = styled(Flex)`
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  gap: 8px;
`;

const BookLink = styled.a`
  font-size: 14px;
  color: #575f7f;
  text-decoration: none;
  &:hover {
    color: ${palette.COLOR_PRIMARY};
  }
`;

const Subfooter = styled(Flex)`
  display: flex;
  font-size: 0.9rem;
  font-weight: 400;
  color: #8c8c8c;
  text-align: center;
  margin-top: 20px;
`;

const Title = styled.h5`
  margin: 0;
  color: #b9becf;
`;

const appPages = [
  { name: "Home", link: "/home" },
  { name: "Despre noi", link: "/about-us" },
  { name: "Contul meu", link: "/my-account" },
  { name: "Adaugă anunț", link: "/create-announcement" },
  { name: "Contact", link: "/contact" },
];

const infoPages = [
  { name: "Termeni și condiții", link: "/privacy-policy" },
  { name: "Politica de confidențialitate și GDPR", link: "/gdpr" },
  { name: "Politica cookie", link: "/" },
  { name: "ANPC", link: "https://www.anpc.ro/", external: true },
];

const Footer = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);
  const goTo = (item: { name: string; link: string; external?: boolean }) => {
    if (item.external) {
      return window.open(item.link, "_blank");
    }
    router.push(item.link);
  };
  const date = new Date();

  return (
    <FooterContainer $padding={isMobile ? "16px 24px" : "16px 120px"}>
      <Flex>
        <Flex $flexDirection={"column"} $alignItems={"flex-start"}>
          {appPages.map((item, index) => (
            <Link key={`link-${index}-${item.name}`} onClick={() => goTo(item)}>
              {item.name}
            </Link>
          ))}
        </Flex>
        <Flex $flexDirection={"column"} $alignItems={"flex-start"}>
          <h4>INFORMAȚII</h4>
          {infoPages.map((item, index) => (
            <Link
              key={`link-info-${index}-${item.name}`}
              onClick={() => goTo(item)}
            >
              {item.name}
            </Link>
          ))}
        </Flex>
      </Flex>

      <Title>Suntem prezenți și pe social media:</Title>
      <Flex $justifyContent={"space-between"}>
        <Flex $alignItems={"flex-start"} width={"unset"} $gap={"12px"}>
          <LinkIcon
            key={`link-facebook`}
            href={"https://www.facebook.com/www.eproprietar.ro"}
            target={"_blank"}
          >
            <Image src={facebookLogo} alt="eproprietar" width={55} />
          </LinkIcon>
          <LinkIcon
            key={`link-insta`}
            href={"https://www.instagram.com/eproprietar.ro/"}
            target={"_blank"}
          >
            <Image src={instagramLogo} alt="eproprietar" width={55} />
          </LinkIcon>
          <LinkIcon
            key={`link-youtube`}
            href={"https://www.youtube.com/channel/UCTaDzhfaUZoljhvKBdU1_5A"}
            target={"_blank"}
          >
            <Image src={youTubeIcon} alt="eproprietar" width={55} />
          </LinkIcon>
          <LinkIcon
            key={`link-linkedin`}
            href={"https://www.linkedin.com/company/eproprietar/"}
            target={"_blank"}
          >
            <Image src={linkedinIcon} alt="eproprietar" width={55} />
          </LinkIcon>
        </Flex>
        <Image src={logo} alt="eproprietar" width={100} />
      </Flex>

      {/* === Book Section === */}
      <BookSection $justifyContent={"center"}>
        <BookLink
          href="https://totuldespreimobiliare.ro/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={bannerImage.src}
            alt='"Totul" despre imobiliare'	
            width={240}
            height={180}
            style={{
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </BookLink>
        <BookLink
          href="https://totuldespreimobiliare.ro/"
          target="_blank"
          rel="noopener noreferrer"
        >
          "Totul" despre imobiliare
        </BookLink>
      </BookSection>

      <Subfooter $justifyContent={"flex-start"}>
        {`© ${date.getFullYear()}  eProprietar.ro - Imo Casa Solutions S.R.L., CIF: 36270153, REG. COM.: J12/2530/2016`}
      </Subfooter>
    </FooterContainer>
  );
};

export default Footer;