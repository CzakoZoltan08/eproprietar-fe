// app/analytics/MetaPageViewTracker.tsx
'use client';

import { usePathname, useSearchParams } from "next/navigation";

import { useEffect } from "react";

export default function MetaPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    // @ts-ignore
    window.fbq?.('track', 'PageView', { page_location: url });
  }, [pathname, searchParams]);

  return null;
}
