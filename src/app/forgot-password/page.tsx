"use client";

import LeftSide from "@/app/forgot-password/LeftSide";
import LoginLayout from "@/common/layout/LoginLayout";
import { RightSide } from "@/common/auth/RightSide";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
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
