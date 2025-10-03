import "./style.css";

import AppInitializer from "@/common/initializer/AppInitializer";
import GA from "./analytics/GA";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import PageViewTracker from "./analytics/PageViewTracker";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eproprietar",
  description: "Platformă pentru gestionarea anunțurilor imobiliare",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        {/* 1) Consent Mode boot: define gtag, set default denied, restore user's choice */}
        <Script id="consent-boot" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // Default: everything denied until we know user's choice
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            });

            // We'll use this flag to trigger Meta PageView once fbq is ready
            window.__ep_marketingGranted = false;

            // Restore stored choice ASAP (sync) from your banner's storage key
            try {
              var raw = localStorage.getItem('ep_cookie_consent_v1');
              if (raw) {
                var c = JSON.parse(raw);
                var analyticsGranted = !!c.analytics;
                var marketingGranted = !!c.marketing;

                // Remember marketing for Meta Pixel first PageView after init
                window.__ep_marketingGranted = marketingGranted;

                gtag('consent', 'update', {
                  analytics_storage: analyticsGranted ? 'granted' : 'denied',
                  ad_storage: marketingGranted ? 'granted' : 'denied',
                  ad_user_data: marketingGranted ? 'granted' : 'denied',
                  ad_personalization: marketingGranted ? 'granted' : 'denied'
                });
              }
            } catch (_) {}
          `}
        </Script>

        {/* 2) Meta Pixel bootstrap (init only; no PageView until consent granted) */}
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            (function() {
              var PID = '${process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ""}';
              if (!PID) return;

              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', PID);

              // If user had already granted marketing before load, send first PageView now
              if (window.__ep_marketingGranted) {
                try { fbq('track', 'PageView'); } catch(e) {}
              }
            })();
          `}
        </Script>

        {/* 3) Bridge: listen for your CookieBanner's event and update GA consent + trigger Meta PV when allowed */}
        <Script id="consent-bridge" strategy="afterInteractive">
          {`
            window.addEventListener('cookie-consent-updated', function (e) {
              var v = e.detail || {};
              var analyticsGranted = !!v.analytics;
              var marketingGranted = !!v.marketing;

              // GA Consent Mode update
              gtag('consent', 'update', {
                analytics_storage: analyticsGranted ? 'granted' : 'denied',
                ad_storage: marketingGranted ? 'granted' : 'denied',
                ad_user_data: marketingGranted ? 'granted' : 'denied',
                ad_personalization: marketingGranted ? 'granted' : 'denied'
              });

              // Remember current marketing state for later navigations
              window.__ep_marketingGranted = marketingGranted;

              // Meta Pixel: fire first PageView when user grants marketing
              if (marketingGranted && typeof fbq !== 'undefined') {
                try { fbq('track', 'PageView'); } catch(e) {}
              }
            });
          `}
        </Script>

        <AppInitializer>
          {/* GA loads after consent defaults are set; GA.tsx should keep send_page_view: false */}
          <GA />
          {/* Your GA SPA pageview tracker. 
              (Optional) If you want Meta to track SPA navigations too, 
              call fbq('track','PageView') inside that tracker as well when window.__ep_marketingGranted is true. */}
          <PageViewTracker />
          {children}
        </AppInitializer>

        {/* (Optional) Noscript fallback for Meta Pixel (won't run in most SPA flows, but standard snippet) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ""}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}