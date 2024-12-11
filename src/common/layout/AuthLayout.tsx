"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import React, { useEffect } from "react";

import Footer from "@/common/footer/Footer";
import Header from "@/common/header/Header";
import { StorageKeys } from "@/constants/storageKeys";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const Container = styled.div`
  background: ${palette.COLOR_LIGHT_GREY};
  min-height: 100vh;
  color: ${palette.COLOR_WHITE};
  padding: 60px 120px;

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    padding: 24px;
  }
`;

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    authStore: { logout },
    userStore: { getCurrentUser, user },
  } = useStore();
  const router = useRouter();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const onLogout = async () => {
    await logout();
    router.push("/login");
  };
  
  if (typeof window !== "undefined") {
    if (!localStorage.getItem(StorageKeys.token)) {
      onLogout();
    }
  }

  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};
