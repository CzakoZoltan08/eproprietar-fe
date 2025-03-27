"use client";

import { Box, Button, Card, CardContent, Chip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { observer } from "mobx-react";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;
`;

const StyledCard = styled(Card)<{ selected: boolean }>`
  border: 2px solid ${({ selected }) => (selected ? "#007BFF" : "#e0e0e0")};
  transition: border-color 0.3s;
  cursor: pointer;
  position: relative;
  &:hover {
    border-color: #007BFF;
  }
`;

const Badge = styled(Chip)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const PriceWithDiscount = ({ item }: { item: any }) => (
  <>
    <Typography variant="h6">{item.label}</Typography>
    <Typography>
      {item.discountedPrice} {item.currency}
      {item.originalPrice !== item.discountedPrice && (
        <>
          <Typography
            component="span"
            ml={1}
            sx={{ textDecoration: "line-through", color: "gray", fontSize: "0.9rem" }}
          >
            {item.originalPrice} {item.currency}
          </Typography>
          <Typography
            component="span"
            variant="caption"
            ml={1}
            color="green"
            fontWeight="bold"
          >
            {item.discountCode && `(-${item.discountCode})`}
          </Typography>
        </>
      )}
    </Typography>
    {item.durationDays && (
      <Typography variant="body2" mt={1}>
        Duration: {item.durationDays} days
      </Typography>
    )}
    {item.discountValidTo && (
      <Typography variant="caption" color="text.secondary">
        Discount valid until: {new Date(item.discountValidTo).toLocaleDateString()}
      </Typography>
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

  const {
    userStore: { user, getCurrentUser },
    announcementStore: { createPaymentSession },
    pricingStore: { getAnnouncementPackages, getPromotionPackages },
  } = useStore();

  // 1. Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (!user?.id) {
        await getCurrentUser();
      }
    };
    loadUser();
  }, []);
  
  // This runs AFTER user is set
  useEffect(() => {
    const fetchPricingData = async () => {
      if (!user?.id) return;
  
      try {
        const [fetchedPackages, fetchedPromotions] = await Promise.all([
          getAnnouncementPackages(user.id),
          getPromotionPackages(user.id),
        ]);

        console.log("🎯 fetchedPackages", fetchedPackages);
        console.log("🎯 fetchedPromotions", fetchedPromotions);

        setPackages(fetchedPackages ?? []);
        setPromotions(fetchedPromotions ?? []);
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
  

  const handlePay = async () => {
    if (!selectedPackage || !announcementId) return;
    setLoading(true);

    try {
      const res = await createPaymentSession({
        orderId: announcementId,
        packageId: selectedPackage.id,
        promotionId: selectedPromotion?.id ?? null,
        amount: totalPrice,
        currency: selectedPackage.currency,
        originalAmount: originalTotalPrice,
        discountCode: selectedPackage.discountCode,
        promotionDiscountCode: selectedPromotion?.discountCode ?? undefined,
      });

      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err) {
      console.error("Payment init error", err);
    } finally {
      setLoading(false);
    }
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
      <Typography variant="h5" mb={2}>
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
                label={`-${Math.round(
                  ((pkg.originalPrice - pkg.discountedPrice) / pkg.originalPrice) * 100
                )}%`}
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
          <Typography variant="h5" mt={6} mb={2}>
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
                    label={`-${Math.round(
                      ((promo.originalPrice - promo.discountedPrice) / promo.originalPrice) * 100
                    )}%`}
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
              <Button variant="outlined" color="secondary" onClick={() => setSelectedPromotion(null)}>
                Remove Promotion
              </Button>
            </Box>
          )}
        </>
      )}

      <Box textAlign="center" mt={4}>
        <Typography variant="h6" mb={1}>
          Total: {totalPrice} {selectedPackage?.currency}
          {originalTotalPrice > totalPrice && (
            <Typography
              component="span"
              ml={1}
              sx={{ textDecoration: "line-through", color: "gray" }}
            >
              {originalTotalPrice} {selectedPackage?.currency}
            </Typography>
          )}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          disabled={!selectedPackage || loading}
          onClick={handlePay}
        >
          {loading ? "Processing..." : "Pay and Publish"}
        </Button>
      </Box>

    </Box>
  );
};

export default observer(SelectPackagePage);