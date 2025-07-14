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
  COLOR_RED_BUTTON_HOVER,
  COLOR_TEXT,
  COLOR_WHITE,
} from "@/constants/colors";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CheckIcon from "@mui/icons-material/Check";
import { CommonButton } from "@/common/button/CommonButton";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

const PackageGrid = styled.div<{ $single: boolean }>`
  display: grid;
  /* If there's exactly one package, force a single 280px-wide column and center it.
     Otherwise use the original auto-fit, minmax(280px,1fr) behavior. */
  grid-template-columns: ${({ $single }) =>
    $single ? "minmax(280px, 280px)" : "repeat(auto-fit, minmax(280px, 1fr))"};
  gap: 24px;
  margin-top: 32px;

  /* When $single is true, center the only card horizontally */
  justify-content: ${({ $single }) => ($single ? "center" : "initial")};

  @media (max-width: 768px) {
    /* On small screens, always use a single column */
    grid-template-columns: 1fr;
    justify-content: initial;
  }
`;

const StyledCard = styled(Card)<{ selected: boolean }>`
  border: 2px solid ${({ selected }) => (selected ? COLOR_PRIMARY : COLOR_BORDER_PRIMARY)};
  box-shadow: ${({ selected }) => (selected ? `0 4px 12px rgba(25, 103, 210, 0.2)` : "none")};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
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

const mockFeaturesMap: Record<string, string[]> = {
  ["free"]: ["Listare de bază", "Vizibil 3 zile", "Fără încărcare de imagini"],
  ["7_days"]: ["Până la 3 imagini", "Vizibil 7 zile", "Afișare standard în listări"],
  ["15_days"]: ["Până la 5 imagini", "Vizibil 15 zile", "Evidențiat în listări"],
  ["20_days"]: ["Până la 10 imagini", "Vizibil 20 zile", "Evidențiat în toate listările"],
  ["unlimited"]: ["Vizibilitate nelimitată", "Încărcare nelimitată de imagini", "Poziționare prioritară", "Insignă de promovare"],
  "3_months": ["Vizibil 3 luni", "Până la 10 imagini", "Poziționare îmbunătățită"],
  "6_months": ["Vizibil 6 luni", "Până la 15 imagini", "Poziționare prioritară"],
  "12_months": ["Vizibil 12 luni", "Imagini nelimitate", "Poziționare top", "Insignă premium"],
};

const PriceWithDiscount = ({ item }: { item: any }) => (
  <>
    <Typography variant="h6" fontWeight={600} color="primary.dark">
      {item.label}
    </Typography>
    <Typography fontSize="1.2rem" fontWeight={700} mt={1} color="primary">
      {item.discountedPrice} {item.currency}
    </Typography>
    {item.originalPrice !== item.discountedPrice && (
      <Typography
        fontSize="0.9rem"
        sx={{ textDecoration: "line-through", color: COLOR_RED_BUTTON, fontWeight: 600 }}
      >
        {item.originalPrice} {item.currency}
      </Typography>
    )}
    {item.durationDays && (
      <Typography variant="body2" mt={1} color={COLOR_TEXT}>
        Durată: {item.durationDays} zile
      </Typography>
    )}
    {item.discountValidTo && (
      <Typography variant="caption" sx={{ color: COLOR_RED_BUTTON, fontWeight: 600 }}>
        Reducere valabilă până la: {new Date(item.discountValidTo).toLocaleDateString()}
      </Typography>
    )}
    {item.description && (
      <Typography variant="body2" mt={1} color={COLOR_TEXT}>
        {item.description}
      </Typography>
    )}
    {item.features && item.features.length > 0 && (
      <List dense sx={{ mt: 1 }}>
        {item.features.map((feature: string, idx: number) => (
          <ListItem key={idx} disablePadding sx={{ display: "flex", alignItems: "center" }}>
            <CheckIcon fontSize="small" sx={{ color: COLOR_PRIMARY, mr: 1 }} />
            <ListItemText primary={feature} />
          </ListItem>
        ))}
      </List>
    )}
  </>
);

const SelectPackagePage = () => {
  const searchParams = useSearchParams();
  const announcementId = searchParams.get("announcementId");

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

  const router = useRouter();

  const {
    userStore: { user, getCurrentUser },
    pricingStore: { getAnnouncementPackages, getPromotionPackages },
    announcementStore: { createPaymentSession },
  } = useStore();

  useEffect(() => {
    if (!user?.id) getCurrentUser();
  }, [user?.id]);

  // Fetch packages & promotions…
  useEffect(() => {
    const fetchPricingData = async () => {
      if (!user?.id) return;
      try {
        const audience = searchParams.get("providerType") || "normal";
        const [fetchedPackages, fetchedPromotions] = await Promise.all([
          getAnnouncementPackages(user.id, audience === "owner" ? "normal" : audience),
          getPromotionPackages(user.id),
        ]);

        const withMockFeatures = (items: any[]) =>
          items.map((item) => {
            const features =
              item.features?.length
                ? item.features
                : mockFeaturesMap[item.packageType?.toLowerCase?.()] || [];
            return { ...item, features };
          });

        setPackages(withMockFeatures(fetchedPackages ?? []));
        setPromotions(withMockFeatures(fetchedPromotions ?? []));
      } catch (err) {
        console.error("Failed to load pricing options", err);
      }
    };
    fetchPricingData();
  }, [user?.id, searchParams]);

  // **New useEffect**: If there is exactly one package, auto‐select it
  useEffect(() => {
    if (packages.length === 1) {
      setSelectedPackage(packages[0]);
    }
  }, [packages]);

  useEffect(() => {
    const pkgPrice = Number(selectedPackage?.discountedPrice) || 0;
    const promoPrice = Number(selectedPromotion?.discountedPrice) || 0;
    const originalPkg = Number(selectedPackage?.originalPrice) || 0;
    const originalPromo = Number(selectedPromotion?.originalPrice) || 0;
    setTotalPrice(pkgPrice + promoPrice);
    setOriginalTotalPrice(originalPkg + originalPromo);
  }, [selectedPackage, selectedPromotion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
        name: "Pachet afisare anunt",
        quantity: 1,
        unitOfMeasure: "buc",
        unitPrice: totalPrice,
        currency: selectedPackage.currency?.toUpperCase() ?? "RON",
        isTaxIncluded: true,
        vatPercent: 0,
      },
    ];

    try {
      setLoading(true);
      const res = await createPaymentSession({
        orderId: announcementId,
        packageId: selectedPackage.id,
        promotionId: selectedPromotion?.id ?? undefined,
        amount: totalPrice,
        originalAmount: originalTotalPrice,
        currency: selectedPackage.currency?.toUpperCase() ?? "RON",
        discountCode: selectedPackage.discountCode ?? undefined,
        promotionDiscountCode: selectedPromotion?.discountCode ?? undefined,
        invoiceDetails,
        products,
      });

      if (res?.skipStripe) {
        // no payment → go directly to status page
        router.push(`/payment-status?orderId=${announcementId}&success=true`);
      } else if (res?.checkoutUrl) {
        // normal Stripe flow
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

  if (!announcementId) {
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
    <Box maxWidth="960px" mx="auto" px={3} py={4}>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary">
        Alege pachetul pentru anunțul tău
      </Typography>

      <PackageGrid $single={packages.length === 1}>
        {packages.map((pkg) => (
          <StyledCard
            key={pkg.id}
            selected={selectedPackage?.id === pkg.id}
            onClick={() => setSelectedPackage(pkg)}
          >
            <CardContent>
              <PriceWithDiscount item={pkg} />
            </CardContent>
          </StyledCard>
        ))}
      </PackageGrid>

      {promotions.length > 0 && (
        <>
          <Typography variant="h5" fontWeight={700} mt={6} mb={2} color="primary">
            Adaugă promovare (opțional)
          </Typography>
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
                  <PriceWithDiscount item={promo} />
                </CardContent>
              </StyledCard>
            ))}
          </PackageGrid>
        </>
      )}

      {selectedPackage && (
        <>
          {!isFree && (
            <Box mt={6}>
              <Typography variant="h5" fontWeight={700} mb={2} color="primary">
                Completează detaliile pentru facturare
              </Typography>
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
          <Box>
            <Box textAlign="center" mt={4}>
              <CommonButton
                text={
                  loading
                    ? "Se procesează..."
                    : isFree
                    ? "Publică gratuit"
                    : "Continuă către plată"
                }
                onClick={handleSubmit}
                sx={{
                  backgroundColor: COLOR_PRIMARY,
                  color: "white",
                  ":hover": { backgroundColor: COLOR_RED_BUTTON },
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default observer(SelectPackagePage);