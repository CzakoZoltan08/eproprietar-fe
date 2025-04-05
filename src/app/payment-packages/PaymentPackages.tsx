"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
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
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

const Badge = styled(Chip)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const mockFeaturesMap: Record<string, string[]> = {
  ["free"]: [
    "Basic listing",
    "Visible for 3 days",
    "No image uploads",
  ],
  ["7_days"]: [
    "Up to 3 images",
    "Visible for 7 days",
    "Standard listing placement",
  ],
  ["15_days"]: [
    "Up to 5 images",
    "Visible for 15 days",
    "Highlighted in listings",
  ],
  ["unlimited"]: [
    "Unlimited visibility",
    "Unlimited image uploads",
    "Priority placement",
    "Featured badge",
  ],
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
        sx={{
          textDecoration: "line-through",
          color: COLOR_RED_BUTTON,
          fontWeight: 600,
        }}
      >
        {item.originalPrice} {item.currency}
      </Typography>
    )}
    {item.durationDays && (
      <Typography variant="body2" mt={1} color={COLOR_TEXT}>
        Duration: {item.durationDays} days
      </Typography>
    )}
    {item.discountValidTo && (
      <Typography
        variant="caption"
        sx={{
          color: COLOR_RED_BUTTON,
          fontWeight: 600,
        }}
      >
        Discount valid until: {new Date(item.discountValidTo).toLocaleDateString()}
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
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [originalTotalPrice, setOriginalTotalPrice] = useState<number>(0);

  const router = useRouter();

  const {
    userStore: { user, getCurrentUser },
    pricingStore: { getAnnouncementPackages, getPromotionPackages },
  } = useStore();

  useEffect(() => {
    if (!user?.id) getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPricingData = async () => {
      if (!user?.id) return;
      try {
        const [fetchedPackages, fetchedPromotions] = await Promise.all([
          getAnnouncementPackages(user.id),
          getPromotionPackages(user.id),
        ]);

        const withMockFeatures = (items: any[]) =>
          items.map((item) => ({
            ...item,
            features: item.features?.length  ? item.features : mockFeaturesMap[item.packageType?.toLowerCase?.()] || [],
          }));

        setPackages(withMockFeatures(fetchedPackages ?? []));
        setPromotions(withMockFeatures(fetchedPromotions ?? []));
      } catch (err) {
        console.error("Failed to load pricing options", err);
      }
    };
    fetchPricingData();
  }, [user?.id]);

  useEffect(() => {
    const pkgPrice = Number(selectedPackage?.discountedPrice) || 0;
    const promoPrice = Number(selectedPromotion?.discountedPrice) || 0;
    const originalPkg = Number(selectedPackage?.originalPrice) || 0;
    const originalPromo = Number(selectedPromotion?.originalPrice) || 0;
    setTotalPrice(pkgPrice + promoPrice);
    setOriginalTotalPrice(originalPkg + originalPromo);
  }, [selectedPackage, selectedPromotion]);

  const handleContinue = () => {
    if (!selectedPackage || !announcementId) return;
  
    const params = new URLSearchParams({
      packageId: selectedPackage.id,
      promotionId: selectedPromotion?.id ?? "",
      announcementId,
      discountCode: selectedPackage.discountCode ?? "",
      promotionDiscountCode: selectedPromotion?.discountCode ?? "",
      amount: totalPrice.toString(),
      originalAmount: originalTotalPrice.toString(),
      currency: selectedPackage.currency,
    });
  
    router.push(`/invoice-details?${params.toString()}`);
  };

  if (!user?.id) {
    return (
      <Box px={3} py={4}>
        <Typography>Loading user data...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="960px" mx="auto" px={3} py={4}>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary">
        Choose your listing package
      </Typography>

      <PackageGrid>
        {packages.map((pkg) => (
          <StyledCard
            key={pkg.id}
            selected={selectedPackage?.id === pkg.id}
            onClick={() => setSelectedPackage(pkg)}
          >
            {pkg.discountCode && (
              <Badge
                label={`-${Math.round(((pkg.originalPrice - pkg.discountedPrice) / pkg.originalPrice) * 100)}%`}
                color="success"
              />
            )}
            <CardContent>
              <PriceWithDiscount item={pkg} />
            </CardContent>
          </StyledCard>
        ))}
      </PackageGrid>

      {promotions.length > 0 && (
        <>
          <Typography variant="h5" fontWeight={700} mt={6} mb={2} color="primary">
            Add Promotion (Optional)
          </Typography>
          <PackageGrid>
            {promotions.map((promo) => (
              <StyledCard
                key={promo.id}
                selected={selectedPromotion?.id === promo.id}
                onClick={() => setSelectedPromotion(promo)}
              >
                {promo.discountCode && (
                  <Badge
                    label={`-${Math.round(((promo.originalPrice - promo.discountedPrice) / promo.originalPrice) * 100)}%`}
                    color="success"
                  />
                )}
                <CardContent>
                  <PriceWithDiscount item={promo} />
                </CardContent>
              </StyledCard>
            ))}
          </PackageGrid>

          {selectedPromotion && (
            <Box mt={2} textAlign="center">
              <CommonButton
                text="Remove Promotion"
                onClick={() => setSelectedPromotion(null)}
                sx={{
                  color: COLOR_RED_BUTTON,
                  backgroundColor: COLOR_WHITE,
                  border: `1px solid ${COLOR_RED_BUTTON}`,
                  ":hover": {
                    backgroundColor: COLOR_RED_BUTTON_HOVER,
                    color: COLOR_WHITE,
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      <Box textAlign="center" mt={6}>
        <Typography
          variant="h6"
          fontWeight={700}
          mb={1}
          sx={{ color: COLOR_PRIMARY, fontSize: "1.4rem" }}
        >
          Total: {totalPrice} {selectedPackage?.currency}
          {originalTotalPrice > totalPrice && (
            <Typography
              component="span"
              ml={1}
              sx={{ textDecoration: "line-through", color: COLOR_RED_BUTTON, fontWeight: 600 }}
            >
              {originalTotalPrice} {selectedPackage?.currency}
            </Typography>
          )}
        </Typography>

        <PrimaryButton
          text="Continue"
          onClick={handleContinue}
          size="large"
          fullWidth
        />

      </Box>
    </Box>
  );
};

export default observer(SelectPackagePage);
