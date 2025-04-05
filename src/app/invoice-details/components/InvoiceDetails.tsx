"use client";

import {
  Box,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { COLOR_PRIMARY, COLOR_RED_BUTTON } from "@/constants/colors";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { CommonButton } from "@/common/button/CommonButton";
import { observer } from "mobx-react";
import { useStore } from "@/hooks/useStore";

const defaultValues = {
  name: "",
  cif: "",
  regCom: "",
  address: "",
  city: "",
  country: "Romania",
  email: "",
  isTaxPayer: false,
};

const InvoiceDetailsPage = () => {
    const {
        announcementStore: { createPaymentSession },
        } = useStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [tab, setTab] = useState(0); // 0 = Individual, 1 = Company
  const [form, setForm] = useState(defaultValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const packageId = searchParams.get("packageId");
    const promotionId = searchParams.get("promotionId");
    const announcementId = searchParams.get("announcementId");

    const discountCode = searchParams.get("discountCode");
    const promotionDiscountCode = searchParams.get("promotionDiscountCode");
    const amount = Number(searchParams.get("amount"));
    const originalAmount = Number(searchParams.get("originalAmount"));
    const currency = (searchParams.get("currency") || "RON").toUpperCase();

    if (!packageId || !announcementId) return;

    const invoicePayload = {
      seriesName: "FACTURA",
      number: null,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
      client: {
        name: form.name,
        cif: tab === 1 ? form.cif : null,
        regCom: tab === 1 ? form.regCom : null,
        address: form.address,
        city: form.city,
        country: form.country,
        isTaxPayer: form.isTaxPayer,
        email: form.email,
      },
      products: [
        {
          name: "Pachet promovare anunt", // You can make this dynamic
          unitPrice: 120,
          currency: "RON",
          quantity: 1,
          unitOfMeasure: "buc",
          isTaxIncluded: true,
          vatPercent: 0,
        },
      ],
      currency: "RON",
      language: "ro",
      isDraft: false,
      email: true,
    };

    try {
        setLoading(true);
    
        // 1. Save invoice
        // await fetch("/api/create-invoice", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(invoicePayload),
        // });
    
        // 2. Create Stripe session (moved from SelectPackagePage)
        const res = await createPaymentSession({
            orderId: announcementId,
            packageId,
            promotionId: promotionId || undefined,
            amount,
            currency: currency,
            originalAmount,
            discountCode: discountCode || undefined,
            promotionDiscountCode: promotionDiscountCode || undefined,
          });
    
        if (res?.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          console.error("Missing checkoutUrl");
        }
      } catch (err) {
        console.error("Submission failed", err);
      } finally {
        setLoading(false);
      }
  };

  return (
    <Box maxWidth="720px" mx="auto" px={3} py={4}>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary">
        Fill in your invoicing details
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Individual" />
        <Tab label="Company" />
      </Tabs>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Full Name" name="name" onChange={handleChange} value={form.name} />
        </Grid>
        {tab === 1 && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="CIF" name="cif" onChange={handleChange} value={form.cif} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="RegCom" name="regCom" onChange={handleChange} value={form.regCom} />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <TextField fullWidth label="Address" name="address" onChange={handleChange} value={form.address} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="City" name="city" onChange={handleChange} value={form.city} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Country" name="country" onChange={handleChange} value={form.country} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Email" name="email" onChange={handleChange} value={form.email} />
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <CommonButton
          text={loading ? "Processing..." : "Continue to Payment"}
          onClick={handleSubmit}
          sx={{
            backgroundColor: COLOR_PRIMARY,
            color: "white",
            ":hover": { backgroundColor: COLOR_RED_BUTTON },
          }}
        />
      </Box>
    </Box>
  );
}

export default observer(InvoiceDetailsPage);