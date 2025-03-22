"use client";

import { Box, Button, Card, CardContent, Chip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

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

const SelectPackagePage = () => {
  const searchParams = useSearchParams();
  const announcementId = searchParams.get("announcementId");

  const [packages, setPackages] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    userStore: { user, getCurrentUser },
    announcementStore: { createPaymentSession },
    pricingStore: { getPricingOptions },
  } = useStore();

  useEffect(() => {
      if (!user?.id) {
        getCurrentUser();
      }
    }, [user]);

  useEffect(() => {
    const loadOptions = async () => {
        if (!user?.id) return;
        try {
            const { packages, promotions } = await getPricingOptions(user.id);
            setPackages(packages);
            setPromotions(promotions);
        } catch (err) {
            console.error("Failed to fetch pricing options", err);
        }
    };

    loadOptions();
  }, []);

  const handlePay = async () => {
    if (!selectedPackage || !announcementId) return;
    setLoading(true);

    try {
      const res = await createPaymentSession({
        orderId: announcementId,
        packageId: selectedPackage.id,
        amount: selectedPackage.discountedPrice,
        currency: selectedPackage.currency,
        originalAmount: selectedPackage.originalPrice,
        discountCode: selectedPackage.discountCode,
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
              <Badge label={`-${Math.round(((pkg.originalPrice - pkg.discountedPrice) / pkg.originalPrice) * 100)}%`} color="success" />
            )}
            <CardContent>
              <Typography variant="h6">{pkg.label}</Typography>
              <Typography>
                {pkg.discountedPrice} {pkg.currency}
                {pkg.originalPrice !== pkg.discountedPrice && (
                  <>
                    <Typography component="span" ml={1} sx={{ textDecoration: "line-through", color: "gray" }}>
                      {pkg.originalPrice} {pkg.currency}
                    </Typography>
                    <Typography variant="caption" ml={1} color="green">
                      ({pkg.discountCode})
                    </Typography>
                  </>
                )}
              </Typography>
              {pkg.durationDays && (
                <Typography variant="body2" mt={1}>
                  Duration: {pkg.durationDays} days
                </Typography>
              )}
              {pkg.discountValidTo && (
                <Typography variant="caption" color="text.secondary">
                  Discount valid until: {new Date(pkg.discountValidTo).toLocaleDateString()}
                </Typography>
              )}
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
                  <Badge label={`-${Math.round(((promo.originalPrice - promo.discountedPrice) / promo.originalPrice) * 100)}%`} color="success" />
                )}
                <CardContent>
                  <Typography variant="h6">{promo.label}</Typography>
                  <Typography>
                    {promo.discountedPrice} {promo.currency}
                    {promo.originalPrice !== promo.discountedPrice && (
                      <>
                        <Typography component="span" ml={1} sx={{ textDecoration: "line-through", color: "gray" }}>
                          {promo.originalPrice} {promo.currency}
                        </Typography>
                        <Typography variant="caption" ml={1} color="green">
                          ({promo.discountCode})
                        </Typography>
                      </>
                    )}
                  </Typography>
                  {promo.durationDays && (
                    <Typography variant="body2" mt={1}>
                      Duration: {promo.durationDays} days
                    </Typography>
                  )}
                  {promo.discountValidTo && (
                    <Typography variant="caption" color="text.secondary">
                      Discount valid until: {new Date(promo.discountValidTo).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </StyledCard>
            ))}
          </PackageGrid>
        </>
      )}

      <Box textAlign="center" mt={4}>
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

export default SelectPackagePage;