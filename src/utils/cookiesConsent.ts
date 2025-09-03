// utils/cookiesConsent.ts
export const COOKIE_CONSENT_KEY = "ep_cookie_consent_v1";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  date: string;
};

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    return raw ? (JSON.parse(raw) as CookieConsent) : null;
  } catch {
    return null;
  }
}
