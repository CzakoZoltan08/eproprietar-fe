"use client";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";

import { RightSide } from "@/common/auth/RightSide";
import LoginLayout from "@/common/layout/LoginLayout";
import LeftSide from "@/app/register/LeftSide";
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
