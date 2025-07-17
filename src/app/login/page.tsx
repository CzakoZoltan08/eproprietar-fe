"use client";

import LeftSide from "@/app/login/LeftSide";
import LoginLayout from "@/common/layout/LoginLayout";
import { RightSide } from "@/common/auth/RightSide";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import { Suspense } from "react";
import { useMediaQuery } from "@/hooks/useMediaquery";

export default function Page() {
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);


  return (
    <LoginLayout>
      <Suspense fallback={<div>Se încarcă...</div>}>
        <LeftSide />
        {!isMobile && <RightSide />} {/* Only render RightSide on larger screens */}
      </Suspense>
    </LoginLayout>
  );
}