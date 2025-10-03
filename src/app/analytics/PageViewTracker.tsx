// app/analytics/PageViewTracker.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
    // @ts-ignore
    window.gtag?.('event', 'page_view', { page_location: url });
  }, [pathname, searchParams]);

  return null;
}