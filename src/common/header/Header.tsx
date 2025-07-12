import * as breakpoints from "../../constants/breakpoints";
import * as colors from "../../constants/colors";

import { Button, Drawer, IconButton } from "@mui/material";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import AuthButton from "./AuthButton";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import logo from "../../assets/logo-white.svg";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

const MENU_STRUCTURE = [
  {
    label: "Vânzări",
    transactionType: "Vanzare",
    filters: [
      { label: "Apartamente", type: "apartament" },
      { label: "1 cameră", type: "apartament", rooms: 1 },
      { label: "2 camere", type: "apartament", rooms: 2 },
      { label: "3 camere", type: "apartament", rooms: 3 },
      { label: "4 camere", type: "apartament", rooms: 4 },
      { label: "5 camere", type: "apartament", rooms: 5 },
      { label: "Case/Vile", type: "casa" },
      { label: "Terenuri", type: "teren" },
      { label: "Cabane/Case la țară", type: "case_la_tara" },
    ],
  },
  {
    label: "Închiriere",
    transactionType: "Inchirieri",
    filters: [
      { label: "Apartamente", type: "apartament" },
      { label: "1 cameră", type: "apartament", rooms: 1 },
      { label: "2 camere", type: "apartament", rooms: 2 },
      { label: "3 camere", type: "apartament", rooms: 3 },
      { label: "4 camere", type: "apartament", rooms: 4 },
      { label: "5 camere", type: "apartament", rooms: 5 },
      { label: "Case/Vile", type: "casa" },
      { label: "Terenuri", type: "teren" },
      { label: "Cabane/Case la țară", type: "case_la_tara" },
    ],
  },
];

const Wrapper = styled.div`
  background: ${colors.COLOR_SECONDARY};
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 18%);
`;

const PrincipalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${colors.COLOR_PRIMARY};
  height: 64px;
  padding: 0 40px;
  position: relative;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const CenterSection = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;

  @media only screen and (min-width: ${breakpoints.MAX_PHONE}) {
    position: static;
    transform: none;
    pointer-events: auto;
  }

  img {
    pointer-events: auto;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  max-width: 200px;
`;

const SecondaryHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${colors.COLOR_WHITE};
  padding: 0 24px;
  gap: 24px;

  @media only screen and (max-width: ${breakpoints.MAX_PHONE}) {
    display: none;
  }
`;

const NavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  cursor: pointer;

  &:hover > div {
    display: block;
  }
`;

const DropdownMenu = styled.div`
  display: none;
  position: absolute;
  background: white;
  color: black;
  min-width: 240px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  border-radius: 4px;
  overflow: hidden;
  left: 0;
  top: 40px;

  div {
    padding: 14px 20px;
    cursor: pointer;
    font-size: 15px;

    &:hover {
      background: #f0f0f0;
    }
  }
`;

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: ${colors.COLOR_PRIMARY};
  color: ${colors.COLOR_WHITE};
  height: 100%;

  div {
    cursor: pointer;
    padding: 14px 0;
    font-size: 16px;
  }

  div + div {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userStore: { getCurrentUser, user } } = useStore();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileMenu = () => setMobileOpen(prev => !prev);

  useEffect(() => setOpenMenu(null), [pathname]);
  useEffect(() => { if (!user?.id) getCurrentUser(); }, [user]);

  const handleMouseEnter = (menu: string) => setOpenMenu(menu);
  const handleMouseLeave = () => setOpenMenu(null);

  const navigateWithFilters = (transactionType: string, type: string, rooms?: number) => {
    let url = `/announcements?transactionType=${transactionType}&type=${type}`;
    url += `&price=9999999&minSurface=1&maxSurface=10000&status=active`;
    if (rooms) url += `&rooms=${rooms}`;
    router.push(url);
    setMobileOpen(false);
  };

  const handleAddAnnouncementClick = () => {
    if (!user) router.push("/login");
    else router.push("/create-announcement");
    setMobileOpen(false);
  };

  return (
    <Wrapper>
      <PrincipalHeader>
        <LeftSection>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleMobileMenu}
            sx={{
              display: { xs: "block", md: "none" },
              padding: "12px",
              fontSize: "32px",
            }}
          >
            <MenuIcon sx={{ fontSize: "32px" }} />
          </IconButton>
        </LeftSection>

        <CenterSection>
          <Image
            onClick={() => router.push("/")}
            src={logo}
            alt="eproprietar"
            width={152}
            style={{ cursor: "pointer" }}
          />
        </CenterSection>

        <RightSection>
          <AuthButton />
        </RightSection>
      </PrincipalHeader>

      <SecondaryHeader>
        {MENU_STRUCTURE.map(menu => (
          <NavItem
            key={menu.label}
            onMouseEnter={() => handleMouseEnter(menu.label)}
            onMouseLeave={handleMouseLeave}
          >
            {menu.label} {openMenu === menu.label ? <FaChevronUp /> : <FaChevronDown />}
            <DropdownMenu>
              {menu.filters.map(item => (
                <div
                  key={item.label}
                  onClick={() => navigateWithFilters(menu.transactionType, item.type, item.rooms)}
                >
                  {item.label}
                </div>
              ))}
            </DropdownMenu>
          </NavItem>
        ))}

        <Button
          onClick={() => router.push("/announcements?providerType=ensemble&status=active&type=apartament")}
          color="inherit"
        >
          {"Bloc nou/"}<br />
          {"Ansambluri Rezidențiale"}
        </Button>

        <Button
          onClick={() => router.push("/announcements?providerType=agency&status=active")}
          color="inherit"
        >
          {"Anunțuri agenții cu exclusivitate"}<br />
          {"0% comision pentru cumpărător!!!"}
        </Button>

        <RightSection>
          <PrimaryButton icon="add" text="Adaugă anunț" onClick={handleAddAnnouncementClick} />
        </RightSection>
      </SecondaryHeader>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleMobileMenu}
        PaperProps={{ sx: { background: colors.COLOR_PRIMARY } }}
      >
        <DrawerContent>
            <PrimaryButton
              icon="add"
              text="Adaugă anunț"
              onClick={handleAddAnnouncementClick}
            />

          {MENU_STRUCTURE.map(menu => (
            <div key={menu.label}>
              <div style={{ fontWeight: "bold", marginBottom: "6px" }}>{menu.label}</div>
              {menu.filters.map(item => (
                <div
                  key={item.label}
                  onClick={() => navigateWithFilters(menu.transactionType, item.type, item.rooms)}
                >
                  {item.label}
                </div>
              ))}
            </div>
          ))}

          <div style={{ fontWeight: "bold", marginBottom: "6px" }} onClick={() => router.push("/announcements?providerType=ensemble&status=active&type=apartament")}>
            {"Bloc nou/"}<br />
            {"Ansambluri Rezidențiale"}
          </div>

          <div style={{ fontWeight: "bold", marginBottom: "6px" }} onClick={() => router.push("/announcements?providerType=agency&status=active")}>
            {"Anunțuri agenții cu exclusivitate"}<br />
            {"0% comision pentru cumpărător!!!"}
          </div>
        </DrawerContent>
      </Drawer>
    </Wrapper>
  );
};

export default Header;