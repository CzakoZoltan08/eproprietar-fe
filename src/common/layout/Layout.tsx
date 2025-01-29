"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import Footer from "@/common/footer/Footer";
import Header from "@/common/header/Header";
import { MAX_PHONE } from "@/constants/breakpoints";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background: ${palette.COLOR_LIGHT_GREY};
  width: 100vw;
  min-height: 100vh;
  color: ${palette.COLOR_WHITE};
`;

const PaddingContainer = styled.div`
  background: ${palette.COLOR_LIGHT_GREY};
  min-height: 100vh;
  color: ${palette.COLOR_WHITE};
  padding: 60px 120px;
  width: 100%;
  max-width: 100vw; /* Prevents horizontal overflow */

  @media only screen and (max-width: ${breakpoints.MAX_PHONE}) {
    padding: 24px 12px; /* Reduce side padding to keep it centered */
  }
`;


export const Layout = ({
  children,
  paddingContainer = false,
}: {
  children: React.ReactNode;
  paddingContainer?: boolean;
}) => (
  <>
    <Header />
    {paddingContainer ? (
      <PaddingContainer>{children}</PaddingContainer>
    ) : (
      <Container>{children}</Container>
    )}
    <Footer />
  </>
);
