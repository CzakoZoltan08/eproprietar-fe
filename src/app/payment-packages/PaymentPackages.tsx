"use client";

import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  COLOR_BORDER_PRIMARY,
  COLOR_PRIMARY,
  COLOR_RED_BUTTON,
  COLOR_TEXT,
} from "@/constants/colors";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CommonButton } from "@/common/button/CommonButton";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

/* ---------------- layout ---------------- */

export enum PromotionPackageType {
  PROMOTE_7_DAYS = "promote_7_days",
  PROMOTE_15_DAYS = "promote_15_days",
  PROMOTE_30_DAYS = "promote_30_days",
}

const PageWrap = styled(Box)`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const HeaderBlock = styled(Box)`
  margin-bottom: 24px;
`;

const SectionTitle = (props: {
  children: React.ReactNode;
  mt?: number;
  mb?: number;
  style?: React.CSSProperties;
}) => (
  <Typography
    variant="h5"
    fontWeight={700}
    color="primary"
    mt={props.mt ?? 0}
    mb={props.mb ?? 0}
    style={props.style}
  >
    {props.children}
  </Typography>
);

const PackageGrid = styled.div<{ $single: boolean }>`
  display: grid;
  grid-template-columns: ${({ $single }) =>
    $single ? "minmax(280px, 360px)" : "repeat(auto-fit, minmax(280px, 1fr))"};
  gap: 24px;
  margin-top: 24px;
  justify-content: ${({ $single }) => ($single ? "center" : "initial")};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledCard = styled(Card)<{ selected: boolean }>`
  border: 2px solid
    ${({ selected }) => (selected ? COLOR_PRIMARY : COLOR_BORDER_PRIMARY)};
  box-shadow: ${({ selected }) =>
    selected ? `0 4px 12px rgba(25, 103, 210, 0.2)` : "none"};
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  border-radius: 16px;
  text-align: center;

  &:hover {
    border-color: ${COLOR_PRIMARY};
    box-shadow: 0 4px 20px rgba(25, 103, 210, 0.15);
  }
`;

const Badge = styled(Chip)`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
`;

const CardInner = styled(Box)<{ $hasBadge?: boolean }>`
  padding: ${({ $hasBadge }) => ($hasBadge ? "56px 24px 24px" : "24px")} !important;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ------- Promotion specific design ------- */

const PromotionGrid = styled.div<{ $single?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PromoCard = styled(Card)<{ selected: boolean }>`
  border: 2px solid
    ${({ selected }) => (selected ? COLOR_PRIMARY : COLOR_BORDER_PRIMARY)};
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    border-color: ${COLOR_PRIMARY};
    box-shadow: 0 4px 16px rgba(25, 103, 210, 0.15);
  }
`;

const PromoLabel = styled.div`
  font-weight: 600;
  color: ${COLOR_TEXT};
  opacity: 0.8;
  margin-bottom: 6px;
`;

const PromoValue = styled.div`
  font-size: 1rem;
  margin-bottom: 18px;
`;

const PromoPrice = styled.div`
  font-size: 1.3rem;
  font-weight: 900;
  color: ${COLOR_PRIMARY};
  margin-bottom: 18px;
`;

const PromoBenefit = styled(PromoValue)`
  font-weight: 700;
  color: ${COLOR_PRIMARY};
`;

const PromoDivider = styled.div`
  height: 1px;
  background: ${COLOR_BORDER_PRIMARY};
  margin: 16px 0;
  opacity: 0.6;
`;

const PromoRecommendation = styled(Box)`
  background: #f5f9ff;
  border: 1px dashed ${COLOR_PRIMARY};
  color: ${COLOR_PRIMARY};
  border-radius: 14px;
  padding: 14px 18px;
  margin-top: 24px;
  text-align: center;
  font-weight: 600;
`;

/* --- Why Promote block --- */
const PromoWhy = styled(Box)`
  margin-top: 32px;
  padding: 20px;
  background: #fff;
  border-left: 4px solid ${COLOR_PRIMARY};
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const PromoWhyTitle = styled(Typography)`
  font-weight: 700 !important;
  color: ${COLOR_PRIMARY};
  margin-bottom: 12px !important;
  text-align: center;
`;

const PromoWhyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;

  li {
    margin-bottom: 8px;
    font-size: 0.95rem;
    text-align: left;
  }
`;

/* --------------- helpers / mock features for other audiences --------------- */

const mockFeaturesMap: Record<string, string[]> = {
  ["free"]: ["Listare de bază", "Vizibil 3 zile", "Fără încărcare de imagini"],
  ["7_days"]: ["Până la 3 imagini", "Vizibil 7 zile", "Afișare standard în listări"],
  ["15_days"]: ["Până la 5 imagini", "Vizibil 15 zile", "Evidențiat în listări"],
  ["20_days"]: ["Până la 10 imagini", "Vizibil 20 zile", "Evidențiat în toate listările"],
  ["unlimited"]: [
    "Vizibilitate nelimitată",
    "Încărcare nelimitată de imagini",
    "Poziționare prioritară",
    "Insignă de promovare",
  ],
  "3_months": ["Vizibil 3 luni", "Până la 10 imagini", "Poziționare îmbunătățită"],
  "6_months": ["Vizibil 6 luni", "Până la 15 imagini", "Poziționare prioritară"],
  "12_months": ["Vizibil 12 luni", "Imagini nelimitate", "Poziționare top", "Insignă premium"],
};

/* ---------------- defaults (used for enhancement/fallback) ---------------- */

const getEnsemblePackages = () => [
  {
    id: "ens-3m",
    label: "Pachet listare 3 luni",
    durationDays: 90,
    features: [
      "Vizibil 3 luni",
      "Pagină de prezentare proiect",
      "Listare în secțiunea de Ansambluri Rezidențiale",
      "Poziționare îmbunătățită",
    ],
    price: 300,
    discountedPrice: 300,
    monthly: 100,
    currency: "EUR",
    packageType: "3_months",
  },
  {
    id: "ens-6m",
    label: "Pachet listare 6 luni",
    durationDays: 180,
    features: [
      "Vizibil 6 luni",
      "Pagină de prezentare proiect",
      "Listare în secțiunea de Ansambluri Rezidențiale",
      "Poziționare prioritară",
    ],
    price: 450,
    discountedPrice: 450,
    monthly: 75,
    currency: "EUR",
    packageType: "6_months",
  },
  {
    id: "ens-12m",
    label: "Pachet listare 12 luni",
    durationDays: 365,
    features: [
      "Vizibil 12 luni",
      "Pagină de prezentare proiect",
      "Listare în secțiunea de Ansambluri Rezidențiale",
      "Poziționare top",
      "Insignă premium",
    ],
    price: 600,
    discountedPrice: 600,
    monthly: 50,
    currency: "EUR",
    badge: "Pachet ideal",
    packageType: "12_months",
    note: "*oferta limitată – promoție 2025",
  },
];

/** Owner packages (defaults for enhancement) */
const getOwnerPackages = () => [
  {
    id: "own-7",
    label: "Pachet 7 Zile",
    subtitle: undefined as string | undefined,
    durationText: "7 zile",
    standardPriceText: "7 EURO",
    currentPriceText: "7 EURO",
    durationDays: 7,
    standardPrice: 7,
    price: 7,
    costPerDayText: "1 Euro / Zi",
    currency: "EUR",
    packageType: "7_days",
  },
  {
    id: "own-15",
    label: "Pachet 15 Zile",
    subtitle: undefined as string | undefined,
    durationText: "15 zile",
    standardPriceText: "15 EURO",
    currentPriceText: "15 EURO",
    durationDays: 15,
    standardPrice: 15,
    price: 15,
    costPerDayText: "1 Euro / Zi",
    currency: "EUR",
    packageType: "15_days",
  },
  {
    id: "own-unl",
    label: "💎 Pachet NELIMITAT",
    subtitle: "(Publicare pana la vanzare/inchiriere)",
    durationText: "NELIMITAT",
    standardPriceText: "30 EURO",
    currentPriceText: "20 EURO",
    durationDays: -1,
    standardPrice: 30,
    price: 20,
    currency: "EUR",
    badge: "Cel mai ales",
    highlights: [
      "🔥 Cea mai bună valoare",
      "💵 Economisești: 10 euro",
      "💰 Plătești o singură dată!",
      "🎯 Fără limită de timp",
    ],
    packageType: "unlimited",
  },
];

/* ---------- Fixed promotion options (defaults for enhancement) ---------- */

type FixedPromotion = {
  id: string;
  label: string;
  durationText: string;
  price: number;
  currency: "EUR";
  benefit: string;
  stars?: string;
};

const getFixedPromotions = (): FixedPromotion[] => [
  {
    id: "promo-basic",
    label: "⭐ Promovare BASIC",
    durationText: "7 zile",
    price: 5,
    currency: "EUR",
    benefit: "Mai multă expunere în listări",
    stars: "⭐",
  },
  {
    id: "promo-plus",
    label: "⭐⭐ Promovare PLUS",
    durationText: "15 zile",
    price: 8,
    currency: "EUR",
    benefit: "Vizibilitate dublă față de pachetul standard",
    stars: "⭐⭐",
  },
  {
    id: "promo-max",
    label: "⭐⭐⭐ Promovare MAX",
    durationText: "30 zile",
    price: 10,
    currency: "EUR",
    benefit: "Prezență susținută și constantă",
    stars: "⭐⭐⭐",
  },
];

const FIXED_BY_TYPE: Record<string, FixedPromotion> = {
  ["promote_7_days"]: getFixedPromotions()[0], // BASIC
  ["promote_15_days"]: getFixedPromotions()[1], // PLUS
  ["promote_30_days"]: getFixedPromotions()[2], // MAX
};

/* ---------------- Agency Exclusive package (default) ---------------- */

const getAgencyExclusivePackage = () => ({
  id: "ag-excl",
  label: "Listare anunț reprezentare exclusivă",
  currency: "EUR",
  originalPrice: 30,
  price: 20,
  durationText: "valabil nelimitat ca durată",
  details1: "Anunțuri evidențiate ca fiind cu reprezentare exclusivă",
  details2: "Publicare pana la vânzare/închiriere",
  packageType: "20_days",
});

/* ---------------- Agency card (single column, centered) ---------------- */

const AgencyCard = styled(Card)<{ selected: boolean }>`
  border: 2px solid
    ${({ selected }) => (selected ? COLOR_PRIMARY : COLOR_BORDER_PRIMARY)};
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: ${COLOR_PRIMARY};
    box-shadow: 0 4px 16px rgba(25, 103, 210, 0.15);
  }
`;

const AgencyCardInner = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AgencyBody = ({ pkg }: { pkg: any }) => {
  const base = getBasePrice(pkg);
  const eff = effectivePrice(pkg);
  const hasDiscount = eff < base;

  return (
    <AgencyCardInner>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        ✅ {pkg.label}
      </Typography>

      <Box mt={2} mb={2}>
        {hasDiscount && (
          <Typography
            variant="body2"
            color={COLOR_TEXT}
            sx={{ mb: 1, textDecoration: "line-through", opacity: 0.7 }}
          >
            {base} euro / anunț (valabil nelimitat ca durată)
          </Typography>
        )}

        <Typography fontSize="1.4rem" fontWeight={900} color="primary" sx={{ mb: 1 }}>
          {eff} euro / anunț (valabil nelimitat ca durată)
        </Typography>
      </Box>

      <Box mt={2} textAlign="left" sx={{ maxWidth: 340 }}>
        <Typography sx={{ mb: 1 }}>{pkg.details1}</Typography>
        <Typography>{pkg.details2}</Typography>
      </Box>
    </AgencyCardInner>
  );
};

const BonusBox = styled(Box)`
  padding: 14px 18px;
  border-radius: 12px;
  background: #fafafa;
  border: 1px dashed ${COLOR_BORDER_PRIMARY};
  font-weight: 600;
  text-align: center;
  margin-top: 18px;
`;

/* ---------------- Promotion renderer ---------------- */

const PromotionCards = ({
  promotions,
  selectedPromotion,
  onSelect,
}: {
  promotions: FixedPromotion[];
  selectedPromotion: FixedPromotion | null;
  onSelect: (p: FixedPromotion | null) => void;
}) => (
  <>
    <SectionTitle mt={6} mb={2} style={{ textAlign: "center" }}>
      Alege una dintre opțiunile de promovare pentru a atrage mai mulți vizitatori către
      anunțul tău:
    </SectionTitle>

    <PromotionGrid>
      {promotions.map((p) => {
        const isSelected = selectedPromotion?.id === p.id;
        const base = getBasePrice(p);
        const eff = effectivePrice(p);
        const hasDiscount = eff < base;

        return (
          <PromoCard
            key={p.id}
            selected={isSelected}
            onClick={() => onSelect(isSelected ? null : p)}
          >
            <Typography fontWeight={800} fontSize="1.1rem" mb={2}>
              {p.label}
            </Typography>

            <PromoDivider />

            <PromoLabel>Tip Promovare</PromoLabel>
            <PromoValue>{p.label.replace(/^[⭐\s]+/, "")}</PromoValue>

            <PromoLabel>Durată</PromoLabel>
            <PromoValue>{(p as any).durationText}</PromoValue>

            <PromoLabel>Preț</PromoLabel>
            {hasDiscount && (
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through", opacity: 0.7, mb: 0.5 }}
              >
                {base} {(p as any).currency ?? "EUR"}
              </Typography>
            )}
            <PromoPrice>
              {eff} {(p as any).currency ?? "EUR"}
            </PromoPrice>

            <PromoLabel>Beneficiu</PromoLabel>
            <PromoBenefit>{(p as any).benefit}</PromoBenefit>
          </PromoCard>
        );
      })}
    </PromotionGrid>

    <PromoRecommendation>
      💡 Recomandare: Combină promovarea cu <b>Pachetul Nelimitat</b> pentru rezultate maxime!
    </PromoRecommendation>

    <PromoWhy>
      <PromoWhyTitle variant="h6">🏆 De ce să alegi promovarea?</PromoWhyTitle>
      <PromoWhyList>
        <li>• Crește vizibilitatea anunțului de până la 5x mai mult</li>
        <li>• Ajungi atât la cumpărători direcți, cât și la alți agenți</li>
        <li>• Poziționare prioritară în rezultate</li>
      </PromoWhyList>
    </PromoWhy>
  </>
);

/* ---------------- merge helpers (enhance fetched with defaults) ---------------- */

type MaybeIdType = { id?: string; packageType?: string; [k: string]: any };

const byKey = (arr: MaybeIdType[], key: "id" | "packageType") =>
  new Map((arr ?? []).filter(Boolean).map((x) => [x?.[key], x]));

// Fetched promo shape is assumed; adjust keys (e.g., packageType, price, discountedPrice, currency) to your BE.
const enhancePromotionsFromFetched = (fetched: any[]): FixedPromotion[] => {
  if (!Array.isArray(fetched)) return [];

  return fetched
    .map((item) => {
      const type: PromotionPackageType | undefined =
        (item?.promotionType as PromotionPackageType | undefined);
      const fixed = type ? FIXED_BY_TYPE[type] : undefined;

      return {
        id: item.id, // keep fetched id
        label: fixed?.label ?? item.label ?? "Promovare",
        durationText: fixed?.durationText ?? item.durationText ?? "",
        price: Number(item.price ?? fixed?.price ?? 0),
        currency: (item.currency ?? fixed?.currency ?? "EUR").toUpperCase() as "EUR",
        benefit: fixed?.benefit ?? item.benefit ?? "",
        stars: fixed?.stars,
        // Optional discount fields may come from BE; we pass them through for effectivePrice()
        ...(item.discountedPrice != null ? { discountedPrice: item.discountedPrice } : {}),
        ...(item.discountAmount != null ? { discountAmount: item.discountAmount } : {}),
        ...(item.discountPercent != null ? { discountPercent: item.discountPercent } : {}),
      } as any;
    })
    .filter(Boolean);
};

const enhanceList = (fetched: MaybeIdType[], defaults: MaybeIdType[]) => {
  const byId = byKey(defaults, "id");
  const byType = byKey(defaults, "packageType");

  const merged = (fetched ?? []).map((item) => {
    const fallback =
      (item?.id && byId.get(item.id)) ||
      (item?.packageType && byType.get(item.packageType)) ||
      null;

    const base = fallback ? { ...fallback, ...item } : { ...item };

    if (!base.features || base.features.length === 0) {
      const t = (base.packageType || "").toLowerCase();
      const mf = mockFeaturesMap[t];
      if (mf) base.features = mf;
    }
    return base;
  });

  if (!merged.length) {
    return (defaults ?? []).map((d) => {
      const t = (d.packageType || "").toLowerCase();
      return {
        ...d,
        features: d.features?.length ? d.features : mockFeaturesMap[t] || [],
      };
    });
  }

  return merged;
};

/* ---------------- price helpers (DISCOUNT LOGIC) ---------------- */

/** Returns the base price (no discounts applied) from a mixed object shape. */
function getBasePrice(x: any): number {
  const base = Number(
    x?.price ??
      x?.currentPrice ??
      x?.standardPrice ??
      x?.originalPrice ??
      x?.standardPriceText?.toString().replace(/[^\d.,-]/g, "") ??
      0
  );
  return isFinite(base) ? round2(base) : 0;
}

/** Calculates the effective price with discounts applied (discountedPrice wins). */
function effectivePrice(x: any): number {
  const base = getBasePrice(x);
  if (!isFinite(base)) return 0;

  // Priority 1: explicit discountedPrice
  if (x?.discountedPrice != null && isFinite(Number(x.discountedPrice))) {
    return Math.max(0, round2(Number(x.discountedPrice)));
  }

  // Priority 2: discountAmount (subtract amount)
  if (x?.discountAmount != null && isFinite(Number(x.discountAmount))) {
    return Math.max(0, round2(base - Number(x.discountAmount)));
  }

  // Priority 3: discountPercent (apply percentage)
  if (x?.discountPercent != null && isFinite(Number(x.discountPercent))) {
    const percent = Number(x.discountPercent);
    return Math.max(0, round2(base * (1 - percent / 100)));
  }

  // No discount fields => base
  return base;
}

/** Human-ish rounding */
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/* ---------------- component ---------------- */

const SelectPackagePage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const announcementId = searchParams.get("announcementId");
  const audienceParam = (searchParams.get("providerType") || "normal").toLowerCase();

  const isEnsemble = audienceParam === "ensemble";
  const isOwner = audienceParam === "owner";
  const isAgency = audienceParam === "agency";

  const [userLoading, setUserLoading] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null);

  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    name: "",
    cif: "",
    regCom: "",
    address: "",
    city: "",
    country: "Romania",
    email: "",
    isTaxPayer: false,
  });
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [originalTotalPrice, setOriginalTotalPrice] = useState<number>(0);
  const [announcementLoading, setAnnouncementLoading] = useState(!announcementId);

  const {
    userStore: { user, getCurrentUser },
    pricingStore: { getAnnouncementPackages, getPromotionPackages },
    announcementStore: { createPaymentSession },
  } = useStore();

  /* Load user once */
  useEffect(() => {
    const checkUser = async () => {
      if (user === undefined) {
        await getCurrentUser();
      }
      setUserLoading(false);
    };
    checkUser();
  }, []);

  /* Redirect to login after user loads */
  useEffect(() => {
    if (!userLoading && user === null) {
      const currentUrl =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : `${pathname}?${searchParams.toString()}`;
      router.replace(`/login?returnTo=${encodeURIComponent(currentUrl)}`);
    }
  }, [user, userLoading]);

  /* Announcement loading flag */
  useEffect(() => {
    if (announcementId && announcementLoading) setAnnouncementLoading(false);
  }, [announcementId, announcementLoading]);

  /* Fetch pricing (always fetch, then enhance with defaults per audience) */
  useEffect(() => {
    const fetchPricingData = async () => {
      if (!user?.id) return;

      try {
        const [fetchedPackages, fetchedPromotions] = await Promise.all([
          getAnnouncementPackages(user.id, audienceParam === "owner" ? "normal" : audienceParam),
          getPromotionPackages(user.id),
        ]);

        const pkgDefaults = isEnsemble
          ? getEnsemblePackages()
          : isOwner
          ? getOwnerPackages()
          : isAgency
          ? [getAgencyExclusivePackage()]
          : [];

        const enhancedPackages = enhanceList(fetchedPackages ?? [], pkgDefaults);
        setPackages(enhancedPackages);

        if (!isEnsemble && (isOwner || isAgency)) {
          const enhancedPromos = enhancePromotionsFromFetched(fetchedPromotions ?? []);
          setPromotions(enhancedPromos);
        } else {
          setPromotions([]);
        }
      } catch (err) {
        console.error("Failed to load pricing options", err);
        const fallbackPkgs = isEnsemble
          ? getEnsemblePackages()
          : isOwner
          ? getOwnerPackages()
          : isAgency
          ? [getAgencyExclusivePackage()]
          : [];
        setPackages(fallbackPkgs);

        if (!isEnsemble && (isOwner || isAgency)) {
          setPromotions(getFixedPromotions());
        } else {
          setPromotions([]);
        }
      }
    };
    fetchPricingData();
  }, [
    user?.id,
    audienceParam,
    isEnsemble,
    isOwner,
    isAgency,
    getAnnouncementPackages,
    getPromotionPackages,
  ]);

  /* Auto-select when only one (non-owner & non-agency flows) */
  useEffect(() => {
    if (!isOwner && !isAgency && packages.length === 1) {
      setSelectedPackage(packages[0]);
    }
  }, [packages, isOwner, isAgency]);

  /* Totals (uses discount-aware helpers) */
  useEffect(() => {
    const pkgEff = selectedPackage ? effectivePrice(selectedPackage) : 0;
    const promoEff = selectedPromotion ? effectivePrice(selectedPromotion) : 0;

    const pkgBase = selectedPackage ? getBasePrice(selectedPackage) : 0;
    const promoBase = selectedPromotion ? getBasePrice(selectedPromotion) : 0;

    setTotalPrice(round2(pkgEff + promoEff));
    setOriginalTotalPrice(round2(pkgBase + promoBase));
  }, [selectedPackage, selectedPromotion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const currency = useMemo(
    () =>
      isEnsemble || isOwner || isAgency
        ? "EUR"
        : selectedPackage?.currency?.toUpperCase?.() ?? "RON",
    [isEnsemble, isOwner, isAgency, selectedPackage?.currency]
  );

  // ---------- sorting helpers (use effectivePrice) ----------
  const sortedPackages = useMemo(
    () => [...packages].sort((a, b) => effectivePrice(a) - effectivePrice(b)),
    [packages]
  );

  const sortedPromotions = useMemo(
    () => [...promotions].sort((a, b) => effectivePrice(a) - effectivePrice(b)),
    [promotions]
  );
  // ---------------------------------------------------------

  const handleSubmit = async () => {
    if (!selectedPackage || !announcementId) return;

    const invoiceDetails = {
      name: form.name,
      cif: tab === 1 ? form.cif : undefined,
      regCom: tab === 1 ? form.regCom : undefined,
      address: form.address,
      city: form.city,
      country: form.country,
      email: form.email,
      isTaxPayer: false,
    };

    const products = [
      {
        name: isEnsemble ? "Pachet listare ansamblu" : "Pachet afișare anunț",
        quantity: 1,
        unitOfMeasure: "buc",
        unitPrice: totalPrice,
        currency,
        isTaxIncluded: true,
        vatPercent: 0,
      },
    ];

    try {
      setLoading(true);
      const includePromotion = (isOwner || isAgency) && !isEnsemble;
      const res = await createPaymentSession({
        orderId: announcementId,
        packageId: selectedPackage.id,
        promotionId: includePromotion ? selectedPromotion?.id ?? undefined : undefined,
        amount: totalPrice, // already discount-aware
        originalAmount: originalTotalPrice, // sum of base prices (no discounts)
        currency,
        discountCode: selectedPackage.discountCode ?? undefined,
        promotionDiscountCode: includePromotion
          ? selectedPromotion?.discountCode ?? undefined
          : undefined,
        invoiceDetails,
        products,
      });

      if (res?.skipStripe) {
        router.push(`/payment-status?orderId=${announcementId}&success=true`);
      } else if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        console.error("Missing checkoutUrl or skipStripe flag");
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || announcementLoading) {
    return (
      <Box px={3} py={4} textAlign="center">
        <CircularProgress />
        <Typography variant="body2" mt={2}>
          Se finalizează anunțul în fundal...
        </Typography>
      </Box>
    );
  }

  const isFree = totalPrice === 0 && !selectedPromotion;

  // show promotions only for owner/agency AND only after choosing a base package
  const shouldShowPromotions =
    !isEnsemble && (isOwner || isAgency) && !!selectedPackage && promotions.length > 0;

  /* ---------------- card body renderers ---------------- */

  const OwnerCardBody = ({ pkg }: { pkg: any }) => {
    const base = getBasePrice(pkg);
    const eff = effectivePrice(pkg);
    const hasDiscount = eff < base;

    return (
      <>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {pkg.label}
        </Typography>
        {pkg.subtitle && (
          <Typography variant="body2" color="primary" gutterBottom>
            {pkg.subtitle}
          </Typography>
        )}

        <Box mt={2} mb={1.5}>
          <Typography variant="body2" color={COLOR_TEXT} sx={{ mb: 1 }}>
            Durată:{" "}
            <b>
              {pkg.durationText ??
                (pkg.durationDays > 0 ? `${pkg.durationDays} zile` : "NELIMITAT")}
            </b>
          </Typography>

          {hasDiscount && (
            <Typography
              variant="body2"
              color={COLOR_TEXT}
              sx={{ mb: 1, textDecoration: "line-through", opacity: 0.7 }}
            >
              Preț standard: {base} {pkg.currency ?? "EUR"}
            </Typography>
          )}

          <Typography fontSize="1.4rem" fontWeight={900} color="primary" sx={{ mb: 1 }}>
            Preț actual: {eff} {pkg.currency ?? "EUR"}
          </Typography>

          {pkg.costPerDayText && (
            <Typography fontWeight={700} color="primary" sx={{ mb: 1 }}>
              Cost pe zi: {pkg.costPerDayText}
            </Typography>
          )}
        </Box>

        {pkg.highlights && (
          <Box mt={2} textAlign="left" sx={{ maxWidth: 320, mx: "auto" }}>
            {pkg.highlights.map((h: string, i: number) => (
              <Typography key={i} color="primary" sx={{ mb: 0.5 }}>
                {h}
              </Typography>
            ))}
          </Box>
        )}
      </>
    );
  };

  const GenericCardBody = ({ item }: { item: any }) => {
    const base = getBasePrice(item);
    const eff = effectivePrice(item);
    const hasDiscount = eff < base;

    return (
      <>
        <Typography variant="h6" fontWeight={700} color="primary.dark" gutterBottom>
          {item.label}
        </Typography>

        {typeof item.durationDays === "number" && (
          <Typography variant="body2" color={COLOR_TEXT} gutterBottom>
            Durată: {item.durationDays > 0 ? `${item.durationDays} zile` : "NELIMITAT"}
          </Typography>
        )}

        {item.features?.length > 0 && (
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: "8px 0 16px" }}>
            {item.features.map((f: string, idx: number) => (
              <Box key={idx} component="li" sx={{ mb: 0.5 }}>
                • {f}
              </Box>
            ))}
          </Box>
        )}

        <Box>
          {hasDiscount && (
            <Typography
              variant="body2"
              sx={{ textDecoration: "line-through", opacity: 0.7 }}
            >
              {base} {item.currency ?? "EUR"}
            </Typography>
          )}
          <Typography fontSize="1.6rem" fontWeight={900} color="primary">
            {eff} {item.currency ?? "EUR"}
          </Typography>
          {item.monthly && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              ({item.monthly} {item.currency ?? "EUR"}/lună)
            </Typography>
          )}
          {item.note && (
            <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.8 }}>
              {item.note}
            </Typography>
          )}
        </Box>
      </>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <PageWrap>
      {isEnsemble ? (
        <>
          <HeaderBlock>
            <SectionTitle mt={1} mb={1.5}>
              Listare Ansambluri Rezidențiale
            </SectionTitle>
            <Typography color={COLOR_TEXT}>
              Din dorința de a facilita accesul clienților la oferta de Locuințe Noi, am
              implementat secțiunea <b>ANSAMBLURI REZIDENȚIALE</b> în cadrul platformei.
            </Typography>
            <SectionTitle mt={4} mb={1.5}>
              Puteți beneficia de listare accesând unul dintre pachete:
            </SectionTitle>
          </HeaderBlock>

          <PackageGrid $single={false}>
            {sortedPackages.map((pkg) => (
              <StyledCard
                key={pkg.id}
                selected={selectedPackage?.id === pkg.id}
                onClick={() => setSelectedPackage(pkg)}
              >
                {pkg.badge && <Badge label={pkg.badge} color="primary" size="small" />}
                <CardInner $hasBadge={!!pkg.badge}>
                  <GenericCardBody item={pkg} />
                </CardInner>
              </StyledCard>
            ))}
          </PackageGrid>
        </>
      ) : isOwner ? (
        <>
          <HeaderBlock>
            <SectionTitle>Puteți beneficia de listare accesând unul dintre pachete:</SectionTitle>
          </HeaderBlock>

          <PackageGrid $single={false}>
            {sortedPackages.map((pkg) => (
              <StyledCard
                key={pkg.id}
                selected={selectedPackage?.id === pkg.id}
                onClick={() => {
                  setSelectedPackage(pkg);
                  setSelectedPromotion(null);
                }}
              >
                {pkg.badge && <Badge label={pkg.badge} color="primary" size="small" />}
                <CardInner $hasBadge={!!pkg.badge}>
                  <OwnerCardBody pkg={pkg} />
                </CardInner>
              </StyledCard>
            ))}
          </PackageGrid>

          {shouldShowPromotions && (
            <PromotionCards
              promotions={sortedPromotions as FixedPromotion[]}
              selectedPromotion={selectedPromotion}
              onSelect={(p) => setSelectedPromotion(p)}
            />
          )}
        </>
      ) : isAgency ? (
        <>
          <SectionTitle mb={1} style={{ textAlign: "center" }}>
            🏢 Agenți Imobiliari – Reprezentare Exclusivă
          </SectionTitle>
          <Typography textAlign="center" sx={{ fontWeight: 600, mb: 0.5 }}>
            🎯 Pachet dedicat agențiilor imobiliare
          </Typography>

          <PackageGrid $single={true}>
            {sortedPackages.map((pkg) => (
              <AgencyCard
                key={pkg.id}
                selected={selectedPackage?.id === pkg.id}
                onClick={() => {
                  setSelectedPackage(pkg);
                  setSelectedPromotion(null);
                }}
              >
                <AgencyBody pkg={pkg} />
              </AgencyCard>
            ))}
          </PackageGrid>

          <BonusBox>
            ✅ <b>Bonus:</b> Anunțul tău va apărea și în zona de listări destinate
            <b> persoanelor fizice</b>, oferindu-i expunere maximă pe întreaga platformă!
          </BonusBox>

          {shouldShowPromotions && (
            <PromotionCards
              promotions={sortedPromotions as FixedPromotion[]}
              selectedPromotion={selectedPromotion}
              onSelect={(p) => setSelectedPromotion(p)}
            />
          )}
        </>
      ) : (
        <>
          <SectionTitle mb={2}>Alege pachetul pentru anunțul tău</SectionTitle>
          <PackageGrid $single={sortedPackages.length === 1}>
            {sortedPackages.map((pkg) => (
              <StyledCard
                key={pkg.id}
                selected={selectedPackage?.id === pkg.id}
                onClick={() => {
                  setSelectedPackage(pkg);
                  setSelectedPromotion(null);
                }}
              >
                {pkg.badge && <Badge label={pkg.badge} color="primary" size="small" />}
                <CardInner $hasBadge={!!pkg.badge}>
                  <GenericCardBody item={pkg} />
                </CardInner>
              </StyledCard>
            ))}
          </PackageGrid>

          {shouldShowPromotions && (
            <PromotionCards
              promotions={sortedPromotions as FixedPromotion[]}
              selectedPromotion={selectedPromotion}
              onSelect={(p) => setSelectedPromotion(p)}
            />
          )}
        </>
      )}

      {selectedPackage && (
        <>
          {!isFree && (
            <Box mt={6}>
              <SectionTitle mb={2}>Completează detaliile pentru facturare</SectionTitle>
              <Tabs
                value={tab}
                onChange={(_, newVal) => setTab(newVal)}
                indicatorColor="primary"
                textColor="primary"
                sx={{ mb: 3 }}
              >
                <Tab label="Persoană fizică" />
                <Tab label="Companie" />
              </Tabs>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nume complet"
                    name="name"
                    onChange={handleChange}
                    value={form.name}
                  />
                </Grid>
                {tab === 1 && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CIF"
                        name="cif"
                        onChange={handleChange}
                        value={form.cif}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nr. Reg. Comerțului"
                        name="regCom"
                        onChange={handleChange}
                        value={form.regCom}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adresă"
                    name="address"
                    onChange={handleChange}
                    value={form.address}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Oraș"
                    name="city"
                    onChange={handleChange}
                    value={form.city}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Țară"
                    name="country"
                    onChange={handleChange}
                    value={form.country}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    onChange={handleChange}
                    value={form.email}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          <Box textAlign="center" mt={4}>
            <CommonButton
              text={loading ? "Se procesează..." : "Continuă către plată"}
              onClick={handleSubmit}
              sx={{
                backgroundColor: COLOR_PRIMARY,
                color: "white",
                ":hover": { backgroundColor: COLOR_RED_BUTTON },
              }}
            />
          </Box>
        </>
      )}
    </PageWrap>
  );
};

export default observer(SelectPackagePage);
