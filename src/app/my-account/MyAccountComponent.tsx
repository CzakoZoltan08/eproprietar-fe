// MyAccountComponent.tsx
"use client";

import { Box, Button, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";

import { COLOR_TEXT } from "@/constants/colors";
import { InputField } from "@/common/input/InputField";
import { observer } from "mobx-react";
import styles from "./MyAccountComponent.module.css";
import { useStore } from "@/hooks/useStore";

const LABELS = {
  myAccount: "Contul meu",
  phone: "Telefon",
  currentPassword: "Parola curentă",
  newPassword: "Parolă nouă",
  confirmPassword: "Confirmare parolă",
};

const MyAccountComponent = () => {
  const {
    userStore: { user, deleteCurrentUser },
    emailAuthStore,
  } = useStore();

  const [formData, setFormData] = useState({
    phone: user?.phoneNumber || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [pwChanging, setPwChanging] = useState(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnregister = async () => {
    if (!user?.id) return;
    const confirmed = window.confirm("Ești sigur că vrei să ștergi contul tău?");
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

  const handleChangePassword = async () => {
    if (!user?.email) return;
    if (formData.newPassword.length < 6) {
      alert("Parola nouă trebuie să aibă cel puțin 6 caractere.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Parola nouă și confirmarea nu coincid.");
      return;
    }
    try {
      setPwChanging(true);
      await emailAuthStore.changePassword(formData.currentPassword, formData.newPassword);
      alert("Parola a fost schimbată cu succes.");
      setFormData((p) => ({ ...p, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (e: any) {
      alert(e?.message ?? "Nu am putut schimba parola.");
    } finally {
      setPwChanging(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) {
      alert("Nu am găsit emailul contului.");
      return;
    }
    try {
      await emailAuthStore.sendResetEmail(user.email);
      alert("Ți-am trimis un email pentru resetarea/ setarea parolei.");
    } catch (e: any) {
      alert(e?.message ?? "Nu am putut trimite emailul de resetare.");
    }
  };

  const isEmailProvider = user?.authProvider === "email";

  return (
    <Box>
      <Typography variant="h4" className={styles.header} color={COLOR_TEXT}>
        {LABELS.myAccount}
      </Typography>

      <Box className={styles.container}>
        {/* Existing info section */}
        <Box className={styles.section}>
          <InputField name="email" value={user?.email || ""} onChange={onChange} disabled />
        </Box>

        {/* Password section */}
        <Box className={styles.section}>
          <Typography variant="h6" sx={{ mb: 1, color: COLOR_TEXT }}>
            Securitate
          </Typography>

          {isEmailProvider ? (
            <>
              <InputField
                label={LABELS.currentPassword}
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={onChange}
              />
              <InputField
                label={LABELS.newPassword}
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={onChange}
              />
              <InputField
                label={LABELS.confirmPassword}
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={onChange}
              />
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={pwChanging}
                sx={{ mt: 1 }}
              >
                Schimbă parola
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 1, color: COLOR_TEXT }}>
                Te-ai conectat cu {user?.authProvider}. Pentru a seta sau reseta o parolă,
                trimite-ți un email de setare/resetare:
              </Typography>
              <Button variant="contained" onClick={handleSendResetEmail}>
                Trimite email de resetare
              </Button>
            </>
          )}
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