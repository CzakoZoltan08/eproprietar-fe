"use client";
import { ChangeEvent, useState } from "react";
import { observer } from "mobx-react";

import { Box, Typography } from "@mui/material";

import { COLOR_TEXT } from "@/constants/colors";

import { InputField } from "@/common/input/InputField";
import { useStore } from "@/hooks/useStore";

const MyAccountComponent = () => {
  const {
    userStore: { user },
  } = useStore();
  const [formData, setFormData] = useState({
    phone: user?.phoneNumber,
  });

  const [formErrors, setFormErrors] = useState({
    phone: "",
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, marginBottom: "32px" }}
        color={COLOR_TEXT}
      >
        Contul meu
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "300px",
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} marginBottom={6}>
          <InputField
            name="email"
            value={user?.email}
            onChange={onChange}
            disabled={true}
          />
          <InputField
            label="Telefon"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            helperText={formErrors.phone}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default observer(MyAccountComponent);
