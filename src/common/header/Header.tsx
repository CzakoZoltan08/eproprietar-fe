import React, { RefObject } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";

import * as colors from "../../constants/colors";
import * as breakpoints from "../../constants/breakpoints";

import logo from "../../assets/logo-white.svg";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import AuthButton from "./AuthButton";

const Wrapper = styled.div`
  height: 90px !important;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 18%);
  display: flex;
  flex-direction: column;
  background: ${colors.COLOR_SECONDARY};
  border-bottom-left-radius: 0 50%;
  position: sticky;
  top: 0;
  z-index: 5;

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    height: 140px !important;
  }
`;

const PrincipalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.COLOR_WHITE};
  height: 100px !important;
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

const SecoundarHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${colors.COLOR_WHITE};
  height: 100% !important;
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
    padding: 6px 6px;
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
        <Image onClick={goHome} src={logo} alt="eproprietar" width={152} />
        <AuthButton />
      </PrincipalHeader>
      <SecoundarHeader>
        <ButtonWrapper>
          <PrimaryButton
            icon={"add"}
            text={"Adaugă anunț"}
            onClick={() => router.push("/create-announcement")}
          />
        </ButtonWrapper>
      </SecoundarHeader>
    </Wrapper>
  );
};

export default Header;
