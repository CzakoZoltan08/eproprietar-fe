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
  country: "România",
  email: "",
  isTaxPayer: false,
};

const InvoiceDetailsPage = () => {
  const {
    announcementStore: { createPaymentSession },
  } = useStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [tab, setTab] = useState(0); // 0 = Persoană fizică, 1 = Firmă
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
        name: "Pachet afișare anunț",
        quantity: 1,
        unitOfMeasure: "buc",
        unitPrice: amount,
        currency: currency,
        isTaxIncluded: true,
        vatPercent: 0,
      },
    ];

    try {
      setLoading(true);

      const res = await createPaymentSession({
        orderId: announcementId,
        packageId,
        promotionId: promotionId || undefined,
        amount,
        currency,
        originalAmount,
        discountCode: discountCode || undefined,
        promotionDiscountCode: promotionDiscountCode || undefined,
        invoiceDetails,
        products,
      });

      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        console.error("Lipsește checkoutUrl");
      }
    } catch (err) {
      console.error("Trimiterea a eșuat", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="720px" mx="auto" px={3} py={4}>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary">
        Completează datele de facturare
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Persoană fizică" />
        <Tab label="Firmă" />
      </Tabs>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Nume complet" name="name" onChange={handleChange} value={form.name} />
        </Grid>
        {tab === 1 && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="CIF" name="cif" onChange={handleChange} value={form.cif} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nr. Reg. Comerțului" name="regCom" onChange={handleChange} value={form.regCom} />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <TextField fullWidth label="Adresă" name="address" onChange={handleChange} value={form.address} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Oraș" name="city" onChange={handleChange} value={form.city} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Țară" name="country" onChange={handleChange} value={form.country} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Email" name="email" onChange={handleChange} value={form.email} />
        </Grid>
      </Grid>

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
    </Box>
  );
};

export default observer(InvoiceDetailsPage);