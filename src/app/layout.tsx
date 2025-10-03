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

            // Restore stored choice ASAP (sync) from your banner's storage key
            try {
              var raw = localStorage.getItem('ep_cookie_consent_v1');
              if (raw) {
                var c = JSON.parse(raw);
                var analyticsGranted = !!c.analytics;
                var marketingGranted = !!c.marketing;

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

        {/* 2) Bridge: listen for your CookieBanner's "cookie-consent-updated" and update Consent Mode */}
        <Script id="consent-bridge" strategy="afterInteractive">
          {`
            window.addEventListener('cookie-consent-updated', function (e) {
              var v = e.detail || {};
              var analyticsGranted = !!v.analytics;
              var marketingGranted = !!v.marketing;

              gtag('consent', 'update', {
                analytics_storage: analyticsGranted ? 'granted' : 'denied',
                ad_storage: marketingGranted ? 'granted' : 'denied',
                ad_user_data: marketingGranted ? 'granted' : 'denied',
                ad_personalization: marketingGranted ? 'granted' : 'denied'
              });
            });
          `}
        </Script>

        <AppInitializer>
          {/* GA loads after consent defaults are set; your GA component should keep send_page_view: false */}
          <GA />
          <PageViewTracker />
          {children}
        </AppInitializer>
      </body>
    </html>
  );
}
