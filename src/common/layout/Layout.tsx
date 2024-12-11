"use client";

import React from "react";
import styled from "styled-components";

import * as palette from "@/constants/colors";

import Footer from "@/common/footer/Footer";
import Header from "@/common/header/Header";
import * as breakpoints from "@/constants/breakpoints";
import { MAX_PHONE } from "@/constants/breakpoints";

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

  @media only screen and (max-width: ${breakpoints.MAX_PHONE}) {
    padding: 24px;
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
