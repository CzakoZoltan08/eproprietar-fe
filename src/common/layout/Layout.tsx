"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import CookieBanner from "../cookieBanner/CookieBanner";
import Footer from "@/common/footer/Footer";
import Header from "@/common/header/Header";
import React from "react";
import styled from "styled-components";

const OuterContainer = styled.div`
  background: ${palette.COLOR_LIGHT_GREY}; /* ✅ full page background */
  width: 100vw;
  min-height: 75vh;
`;

const InnerContainer = styled.div`
  max-width: 1200px;              /* ✅ responsive max width */
  margin: 0 auto;                 /* ✅ center horizontally */
  padding: 60px 24px;             /* ✅ default padding */

  @media only screen and (max-width: ${breakpoints.MAX_PHONE}) {
    padding: 24px 12px;           /* ✅ tighter on phones */
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
    <OuterContainer>
      {paddingContainer ? (
        <InnerContainer>{children}</InnerContainer>
      ) : (
        children
      )}
    </OuterContainer>
    <Footer />
    <CookieBanner /> {/* ✅ cookie popup will overlay all pages */}
  </>
);
