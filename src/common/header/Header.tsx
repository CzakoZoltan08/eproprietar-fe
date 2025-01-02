import * as breakpoints from "../../constants/breakpoints";
import * as colors from "../../constants/colors";

import AuthButton from "./AuthButton";
import Image from "next/image";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import React from "react";
import logo from "../../assets/logo-white.svg";
import styled from "styled-components";
import { useRouter } from "next/navigation";

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
  justify-content: flex-end;
  align-items: center;
  color: ${colors.COLOR_WHITE};
  height: 100%;
  padding: 0 120px;

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

const ButtonWrapper = styled.div`
  margin-top: -4px;
`;

const Header = () => {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <Wrapper>
      <PrincipalHeader>
        <Image
          onClick={goHome}
          src={logo}
          alt="eproprietar"
          width={152}
          style={{ cursor: "pointer" }} // Add pointer cursor for clickable logo
        />
        <AuthButton />
      </PrincipalHeader>
      <SecondaryHeader>
        <ButtonWrapper>
          <PrimaryButton
            icon="add"
            text="Adaugă anunț"
            onClick={() => router.push("/create-announcement")}
          />
        </ButtonWrapper>
      </SecondaryHeader>
    </Wrapper>
  );
};

export default Header;