// app/analytics/PageViewTracker.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');

    // Google Analytics page view
    if (GA_MEASUREMENT_ID) {
      // @ts-ignore
      window.gtag?.('event', 'page_view', { page_location: url });
    }

    // Meta Pixel page view (only if marketing consent granted)
    if (typeof window !== 'undefined' && (window as any).__ep_marketingGranted) {
      // @ts-ignore
      window.fbq?.('track', 'PageView', { page_location: url });
    }
  }, [pathname, searchParams]);

  return null;
}
