"use client";

import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";

import LeftSide from "@/app/login/LeftSide";
import { RightSide } from "@/common/auth/RightSide";
import LoginLayout from "@/common/layout/LoginLayout";
import { useMediaQuery } from "@/hooks/useMediaquery";

export default function Page() {
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  if (isMobile) {
    return (
      <LoginLayout>
        <LeftSide />
      </LoginLayout>
    );
  }

  return (
    <LoginLayout>
      <LeftSide />
      <RightSide />
    </LoginLayout>
  );
}
