"use client";

import { Box, Button, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";

import { COLOR_TEXT } from "@/constants/colors";
import { InputField } from "@/common/input/InputField";
import bannerImage from "../../assets/startup-ceo-banner.jpg";
import { observer } from "mobx-react";
import styles from "./MyAccountComponent.module.css";
import { useStore } from "@/hooks/useStore";

const LABELS = {
  myAccount: "Contul meu",
  phone: "Telefon",
};

const MyAccountComponent = () => {
  const {
    userStore: { user, deleteCurrentUser },
  } = useStore();

  const [formData, setFormData] = useState({
    phone: user?.phoneNumber || "",
  });

  const [formErrors] = useState({
    phone: "",
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUnregister = async () => {
    if (!user?.id) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmed) return;

    try {
      await deleteCurrentUser(user.id);
      alert("Account deleted successfully.");
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Something went wrong while deleting your account.");
    }
  };

  return (
    <Box>
      {/* === Existing Account Content === */}
      <Typography variant="h4" className={styles.header} color={COLOR_TEXT}>
        {LABELS.myAccount}
      </Typography>

      <Box className={styles.container}>
        <Box className={styles.section}>
          <InputField
            name="email"
            value={user?.email || ""}
            onChange={onChange}
            disabled
          />
          <InputField
            label={LABELS.phone}
            name="phone"
            value={formData.phone}
            onChange={onChange}
            helperText={formErrors.phone}
          />
        </Box>

        <Box className={styles.section}>
          <Button color="error" variant="contained" onClick={handleUnregister}>
            Delete My Account
          </Button>
        </Box>
      </Box>

      {/* === Banner Section (moved below the form) === */}
      <Box
        component="a"
        href="https://www.ubuy.hu/en/product/23GB1IX0-startup-ceo-a-field-guide-to-scaling-up-your-business-techstars"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.banner}
      >
        <img
          src={bannerImage.src}
          alt="Startup CEO Book Banner"
          className={styles.bannerImage}
        />
      </Box>
    </Box>
  );
};

export default observer(MyAccountComponent);