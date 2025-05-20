import * as breakpoints from "../../constants/breakpoints";
import * as colors from "../../constants/colors";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import AuthButton from "./AuthButton";
import { Button } from "@mui/material";
import Image from "next/image";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import logo from "../../assets/logo-white.svg";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

const Wrapper = styled.div`
  height: 90px;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 18%);
  display: flex;
  flex-direction: column;
  background: ${colors.COLOR_SECONDARY};
  border-bottom-left-radius: 0 50%;
  position: sticky;
  top: 0;
  z-index: 5;

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    height: 140px;
  }
`;

const PrincipalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.COLOR_WHITE};
  height: 100px;
  background: ${colors.COLOR_PRIMARY};
  padding: 0 120px;
  border-bottom-right-radius: 50% 20%;
  width: inherit;

  @media only screen and (max-width: ${breakpoints.MAX_TABLET}) {
    margin: 0;
    padding: 0 64px;
  }

  @media only screen and (max-width: ${breakpoints.MAX_PHONE}) {
    padding: 0 16px;
  }
`;

const SecondaryHeader = styled.div`
  display: flex;
  justify-content: flex-start; /* Align menu points to the left */
  align-items: center;
  color: ${colors.COLOR_WHITE};
  height: 100%;
  padding: 0 120px;
  gap: 20px; /* Add spacing between items */

  @media only screen and (max-width: ${breakpoints.MAX_TABLET}) {
    margin: 0;
    padding: 0 64px;
  }

  @media only screen and (max-width: ${breakpoints.MAX_PHONE}) {
    padding: 0 16px;
    justify-content: center;
  }

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    padding: 6px;
    flex-direction: column;
  }
`;

const RightSection = styled.div`
  margin-left: auto; /* Pushes the button to the right */
  margin-top: -4px;
`;

const NavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 15px;
  cursor: pointer;
  color: white;

  &:hover > div {
    display: block;
  }
`;

const DropdownMenu = styled.div`
  display: none;
  position: absolute;
  background: white;
  color: black;
  min-width: 220px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  border-radius: 4px;
  overflow: hidden;
  left: 0;
  top: 35px; /* Ensure dropdown appears below */

  div {
    padding: 10px 15px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #f0f0f0;
    }
  }
`;

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Menu state
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  const handleMouseEnter = (menu: string) => setOpenMenu(menu);
  const handleMouseLeave = () => setOpenMenu(null);

  const navigateWithFilters = (transactionType: string, type: string, rooms?: number) => {
    let url = `/announcements?transactionType=${transactionType}&type=${type}`;
    url += `&price=9999999&minSurface=1&maxSurface=10000&status=active`;
    if (rooms) url += `&rooms=${rooms}`;
    router.push(url);
  };

  return (
    <Wrapper>
      <PrincipalHeader>
        <Image
          onClick={() => router.push("/")}
          src={logo}
          alt="eproprietar"
          width={152}
          style={{ cursor: "pointer" }}
        />
        <AuthButton />
      </PrincipalHeader>

      <SecondaryHeader>
        {/* Vânzare */}
        <NavItem onMouseEnter={() => handleMouseEnter("Vanzare")} onMouseLeave={handleMouseLeave}>
          Vânzare {openMenu === "Vanzare" ? <FaChevronUp /> : <FaChevronDown />}
          <DropdownMenu>
            <div onClick={() => navigateWithFilters("Vanzare", "apartament")}>Apartamente</div>
            <div onClick={() => navigateWithFilters("Vanzare", "apartament", 1)}>Apartamente 1 cameră</div>
            <div onClick={() => navigateWithFilters("Vanzare", "apartament", 2)}>Apartamente 2 camere</div>
            <div onClick={() => navigateWithFilters("Vanzare", "apartament", 3)}>Apartamente 3 camere</div>
            <div onClick={() => navigateWithFilters("Vanzare", "apartament", 4)}>Apartamente 4 camere</div>
            <div onClick={() => navigateWithFilters("Vanzare", "apartament", 5)}>Apartamente 5 camere</div>
            <div onClick={() => navigateWithFilters("Vanzare", "casa")}>Case</div>
            <div onClick={() => navigateWithFilters("Vanzare", "vila")}>Vile</div>
            <div onClick={() => navigateWithFilters("Vanzare", "teren")}>Terenuri</div>
          </DropdownMenu>
        </NavItem>

        {/* Închiriere */}
        <NavItem onMouseEnter={() => handleMouseEnter("Inchiriere")} onMouseLeave={handleMouseLeave}>
          Închiriere {openMenu === "Inchiriere" ? <FaChevronUp /> : <FaChevronDown />}
          <DropdownMenu>
            <div onClick={() => navigateWithFilters("Inchiriere", "apartament")}>Apartamente</div>
            <div onClick={() => navigateWithFilters("Inchiriere", "apartament", 1)}>Apartamente 1 cameră</div>
            <div onClick={() => navigateWithFilters("Inchiriere", "apartament", 2)}>Apartamente 2 camere</div>
            <div onClick={() => navigateWithFilters("Inchiriere", "apartament", 3)}>Apartamente 3 camere</div>
            <div onClick={() => navigateWithFilters("Inchiriere", "apartament", 4)}>Apartamente 4 camere</div>
            <div onClick={() => navigateWithFilters("Inchiriere", "apartament", 5)}>Apartamente 5 camere</div>
            <div onClick={() => navigateWithFilters("Inchiriere", "casa")}>Case</div>
            <div onClick={() => navigateWithFilters("Inchiriere", "teren")}>Terenuri</div>
          </DropdownMenu>
        </NavItem>

        {/* Ansambluri Rezidentiale (No submenu needed) */}
        <Button onClick={() => router.push("/announcements?providerType=ensemble&status=active&type=apartament")} color="inherit">
          Ansambluri Rezidențiale
        </Button>

        {/* "Adaugă anunț" button on the right */}
        <RightSection>
          <PrimaryButton
            icon="add"
            text="Adaugă anunț"
            onClick={() => router.push("/create-announcement")}
          />
        </RightSection>
      </SecondaryHeader>
    </Wrapper>
  );
};

export default Header;