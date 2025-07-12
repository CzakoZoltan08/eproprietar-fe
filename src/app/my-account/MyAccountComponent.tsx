"use client";

import { Box, Button, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";

import { COLOR_TEXT } from "@/constants/colors";
import { InputField } from "@/common/input/InputField";
import bannerImage from "../../assets/BookCoverImage.jpg";
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
      "Ești sigur că vrei să ștergi contul tău?"
    );
    if (!confirmed) return;

    try {
      await deleteCurrentUser(user.id);
      alert("Contul a fost șters cu succes.");
      window.location.href = "/";
    } catch (error) {
      console.error("Ștergerea contului a eșuat:", error);
      alert("Ceva nu a funcționat corect la ștergerea contului.");
    }
  };

  return (
    <Box>
      {/* === Conținutul contului existent === */}
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
            Șterge contul meu
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default observer(MyAccountComponent);
