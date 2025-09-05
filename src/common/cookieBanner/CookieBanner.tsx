"use client";

import React, { useEffect, useMemo, useState } from "react";

type Consent = {
  necessary: true;          // always true
  analytics: boolean;       // GA, Hotjar, etc.
  marketing: boolean;       // ads/remarketing
  date: string;
};

const STORAGE_KEY = "ep_cookie_consent_v1";

const baseBox: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  padding: "16px",
};

const card: React.CSSProperties = {
  width: "min(960px, 92vw)",
  background: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  border: "1px solid #e5e7eb",
  padding: 16,
  display: "flex",
  gap: 16,
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const text: React.CSSProperties = {
  color: "#111827",
  lineHeight: 1.5,
  fontSize: 14,
  flex: "1 1 420px",
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
};

const pillBtn: React.CSSProperties = {
  borderRadius: 999,
  padding: "10px 16px",
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const primaryBtn: React.CSSProperties = {
  ...pillBtn,
  background: "#1976d2",
  borderColor: "#1976d2",
  color: "#fff",
};

const linkBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#1976d2",
  textDecoration: "underline",
  cursor: "pointer",
  padding: 0,
};

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // category toggles for "Customize"
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  // Read saved consent once on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (!raw) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const consent: Consent = useMemo(
    () => ({
      necessary: true,
      analytics,
      marketing,
      date: new Date().toISOString(),
    }),
    [analytics, marketing]
  );

  const saveAndClose = (value: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // ignore storage errors
    }
    // Fire a small event so you can load GA/ads after consent
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: value }));
    setOpen(false);
  };

  const acceptAll = () => saveAndClose({ ...consent, analytics: true, marketing: true });
  const rejectNonEssential = () => saveAndClose({ ...consent, analytics: false, marketing: false });
  const saveCustom = () => saveAndClose(consent);

  if (!open) return null;

  return (
    <div style={baseBox} role="dialog" aria-live="polite" aria-label="Consimțământ cookies">
      <div style={card}>
        <div style={text}>
          <strong>Folosim cookies</strong> pentru a îmbunătăți experiența ta, a analiza traficul și,
          opțional, pentru personalizare/marketing. Poți accepta toate, respinge cele
          neesențiale sau alege preferințele.
          <div style={{ marginTop: 8, fontSize: 13, color: "#374151" }}>
            Citește{" "}
            <a href="/politica-cookie" style={{ color: "#1976d2" }}>
              Politica de Cookies
            </a>{" "}
            și{" "}
            <a href="/termeni-si-conditii" style={{ color: "#1976d2" }}>
              Termenii și condițiile
            </a>
            .
          </div>
          {showSettings && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                background: "#f9fafb",
              }}
            >
              <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <input type="checkbox" checked readOnly /> Necesare (mereu active)
              </label>

              <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
                Analitice (ex. Google Analytics)
              </label>

              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                />
                Marketing/remarketing
              </label>
            </div>
          )}
        </div>

        <div style={actions} aria-label="Acțiuni consimțământ cookies">
          <button style={primaryBtn} onClick={acceptAll}>Acceptă tot</button>
          <button style={pillBtn} onClick={rejectNonEssential}>Respinge neesențiale</button>
          <button style={pillBtn} onClick={saveCustom}>Salvează</button>
          <button style={linkBtn} onClick={() => setShowSettings((s) => !s)}>
            {showSettings ? "Ascunde preferințe" : "Personalizează"}
          </button>
        </div>
      </div>
    </div>
  );
}