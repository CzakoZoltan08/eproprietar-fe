"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import React, { useEffect, useState } from "react";

import Footer from "@/common/footer/Footer";
import Header from "@/common/header/Header";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
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
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await getCurrentUser(); // Fetch backend user
        } catch (error) {
          console.error("Failed to load current user:", error);
        }
      } else {
        await logout();
        router.push("/login");
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) return null; // Or show a spinner

  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};