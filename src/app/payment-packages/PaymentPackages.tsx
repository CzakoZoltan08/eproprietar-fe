"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
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

import CheckIcon from "@mui/icons-material/Check";
import { CommonButton } from "@/common/button/CommonButton";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

const PageWrap = styled(Box)`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const HeaderBlock = styled(Box)`
  margin-bottom: 24px;
`;

const PackageGrid = styled.div<{ $single: boolean }>`
  display: grid;
  grid-template-columns: ${({ $single }) =>
    $single ? "minmax(280px, 280px)" : "repeat(auto-fit, minmax(280px, 1fr))"};
  gap: 24px;
  margin-top: 24px;
  justify-content: ${({ $single }) => ($single ? "center" : "initial")};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-content: initial;
  }
`;

const StyledCard = styled(Card)<{ selected: boolean }>`
  border: 2px solid ${({ selected }) => (selected ? COLOR_PRIMARY : COLOR_BORDER_PRIMARY)};
  box-shadow: ${({ selected }) => (selected ? `0 4px 12px rgba(25, 103, 210, 0.2)` : "none")};
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: center; /* ✅ center contents horizontally */
  &:hover {
    border-color: ${COLOR_PRIMARY};
    box-shadow: 0 4px 20px rgba(25, 103, 210, 0.15);
  }
`;

const Badge = styled(Chip)<{ $topOffset?: number }>`
  position: absolute;
  top: ${({ $topOffset }) => $topOffset ?? 10}px;
  right: 10px;
`;

const SectionTitle = (props: { children: React.ReactNode; mt?: number; mb?: number }) => (
  <Typography variant="h5" fontWeight={700} color="primary" mt={props.mt ?? 0} mb={props.mb ?? 0}>
    {props.children}
  </Typography>
);

/** Mock features fallback (kept for non-ensemble flows) */
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

/** ✅ Price centered horizontally, still after features */
const PriceWithDiscount = ({ item }: { item: any }) => (
  <>
    <Typography variant="h6" fontWeight={700} color="primary.dark" gutterBottom>
      {item.label}
    </Typography>

    {item.durationDays && (
      <Typography variant="body2" color={COLOR_TEXT} gutterBottom>
        Durată: {item.durationDays} zile
      </Typography>
    )}

    {item.features && item.features.length > 0 && (
      <List dense sx={{ mt: 1, mb: 2 }}>
        {item.features.map((feature: string, idx: number) => (
          <ListItem
            key={idx}
            disablePadding
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <CheckIcon fontSize="small" sx={{ color: COLOR_PRIMARY, mr: 1 }} />
            <ListItemText primary={feature} />
          </ListItem>
        ))}
      </List>
    )}

    {/* 🔽 Price block stays after features, centered horizontally by parent text-align */}
    <Box>
      <Typography fontSize="1.6rem" fontWeight={900} color="primary">
        {item.discountedPrice ?? item.price} {item.currency ?? "EUR"}
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

/** ✅ Fixed ENSEMBLE packages in EUR; badge moved to 12 months (600 EUR) */
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
    badge: undefined as string | undefined,
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
    badge: undefined as string | undefined, // no badge here
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
    badge: "Pachet ideal", // ✅ moved here
    packageType: "12_months",
    note: "*oferta limitată – promoție 2025",
  },
];

const SelectPackagePage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const announcementId = searchParams.get("announcementId");

  // Detect audience and if it's an ensemble
  const audience = (searchParams.get("providerType") || "normal").toLowerCase();
  const isEnsemble = audience === "ensemble";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    announcementStore: { createPaymentSession },
  } = useStore();

  // Load user (run once)
  useEffect(() => {
    const checkUser = async () => {
      if (user === undefined) {
        await getCurrentUser();
      }
      setUserLoading(false);
    };
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect to login after user loads (keep deps stable)
  useEffect(() => {
    if (!userLoading && user === null) {
      const currentUrl =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : `${pathname}?${searchParams.toString()}`;
      const encoded = encodeURIComponent(currentUrl);
      router.replace(`/login?returnTo=${encoded}`);
    }
    // deps kept constant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading]);

  // Ensure announcement loading flag is cleared
  useEffect(() => {
    if (announcementId && announcementLoading) {
      setAnnouncementLoading(false);
    }
  }, [announcementId, announcementLoading]);

  // Fetch data: for ENSEMBLE use fixed packages & no promotions; otherwise use stores.
  useEffect(() => {
    const fetchPricingData = async () => {
      if (!user?.id) return;

      if (isEnsemble) {
        const ens = getEnsemblePackages();
        setPackages(ens);
        setPromotions([]); // never show promotions for ensemble
        return;
      }

      try {
        const audienceForPackages = audience === "owner" ? "normal" : audience;

        const [fetchedPackages, fetchedPromotions] = await Promise.all([
          getAnnouncementPackages(user.id, audienceForPackages),
          getPromotionPackages(user.id),
        ]);

        const withMockFeatures = (items: any[]) =>
          (items ?? []).map((item) => {
            const features =
              item.features?.length
                ? item.features
                : mockFeaturesMap[item.packageType?.toLowerCase?.()] || [];
            return { ...item, features };
          });

        setPackages(withMockFeatures(fetchedPackages));
        setPromotions(withMockFeatures(fetchedPromotions));
      } catch (err) {
        console.error("Failed to load pricing options", err);
      }
    };
    fetchPricingData();
  }, [user?.id, audience, isEnsemble, getAnnouncementPackages, getPromotionPackages]);

  // Auto-select when only one package
  useEffect(() => {
    if (packages.length === 1) {
      setSelectedPackage(packages[0]);
    }
  }, [packages]);

  // Recompute totals
  useEffect(() => {
    const pkgPrice = Number(selectedPackage?.discountedPrice ?? selectedPackage?.price) || 0;
    const promoPrice = Number(selectedPromotion?.discountedPrice ?? selectedPromotion?.price) || 0;
    const originalPkg = Number(selectedPackage?.originalPrice ?? selectedPackage?.price) || 0;
    const originalPromo = Number(selectedPromotion?.originalPrice ?? selectedPromotion?.price) || 0;
    setTotalPrice(pkgPrice + promoPrice);
    setOriginalTotalPrice(originalPkg + originalPromo);
  }, [selectedPackage, selectedPromotion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const currency = useMemo(
    () => (isEnsemble ? "EUR" : selectedPackage?.currency?.toUpperCase?.() ?? "RON"),
    [isEnsemble, selectedPackage?.currency]
  );

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
      // NOTE: Use your store call. Kept here for context; implementation unchanged.
      const res = await createPaymentSession({
        orderId: announcementId,
        packageId: selectedPackage.id,
        promotionId: isEnsemble ? undefined : selectedPromotion?.id ?? undefined,
        amount: totalPrice,
        originalAmount: originalTotalPrice,
        currency,
        discountCode: selectedPackage.discountCode ?? undefined,
        promotionDiscountCode: isEnsemble ? undefined : selectedPromotion?.discountCode ?? undefined,
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

  return (
    <PageWrap>
      {isEnsemble ? (
        <>
          <HeaderBlock>
            <Typography variant="overline" sx={{ letterSpacing: 1.2 }}>
              Preț dezvoltator
            </Typography>
            <SectionTitle mt={1} mb={1.5}>Listare Ansambluri Rezidențiale</SectionTitle>
            <Typography color={COLOR_TEXT}>
              Din dorința de a facilita accesul clienților la oferta de Locuințe Noi, am implementat
              secțiunea <b>ANSAMBLURI REZIDENȚIALE</b> în cadrul platformei.
            </Typography>
            <Typography mt={2} color={COLOR_TEXT}>
              Puteți beneficia de listare accesând unul dintre pachete:
            </Typography>
          </HeaderBlock>

          <PackageGrid $single={false}>
            {packages.map((pkg) => (
              <StyledCard
                key={pkg.id}
                selected={selectedPackage?.id === pkg.id}
                onClick={() => setSelectedPackage(pkg)}
              >
                <CardContent>
                  {pkg.badge && <Badge label={pkg.badge} color="primary" size="small" />}
                  <PriceWithDiscount item={pkg} />
                </CardContent>
              </StyledCard>
            ))}
          </PackageGrid>
        </>
      ) : (
        <>
          <SectionTitle mb={2}>Alege pachetul pentru anunțul tău</SectionTitle>
          <PackageGrid $single={packages.length === 1}>
            {packages.map((pkg) => (
              <StyledCard
                key={pkg.id}
                selected={selectedPackage?.id === pkg.id}
                onClick={() => setSelectedPackage(pkg)}
              >
                <CardContent>
                  {pkg.badge && <Badge label={pkg.badge} color="primary" size="small" />}
                  <PriceWithDiscount item={pkg} />
                </CardContent>
              </StyledCard>
            ))}
          </PackageGrid>

          {promotions.length > 0 && (
            <>
              <SectionTitle mt={6} mb={2}>Adaugă promovare (opțional)</SectionTitle>
              <PackageGrid $single={promotions.length === 1}>
                {promotions.map((promo) => (
                  <StyledCard
                    key={promo.id}
                    selected={selectedPromotion?.id === promo.id}
                    onClick={() =>
                      selectedPromotion?.id === promo.id
                        ? setSelectedPromotion(null)
                        : setSelectedPromotion(promo)
                    }
                  >
                    <CardContent>
                      {promo.badge && <Badge label={promo.badge} color="primary" size="small" />}
                      <PriceWithDiscount item={promo} />
                    </CardContent>
                  </StyledCard>
                ))}
              </PackageGrid>
            </>
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
                  <TextField fullWidth label="Oraș" name="city" onChange={handleChange} value={form.city} />
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
                  <TextField fullWidth label="Email" name="email" onChange={handleChange} value={form.email} />
                </Grid>
              </Grid>
            </Box>
          )}

          <Box textAlign="center" mt={4}>
            <CommonButton
              text={loading ? "Se procesează..." : isFree ? "Publică gratuit" : "Continuă către plată"}
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
