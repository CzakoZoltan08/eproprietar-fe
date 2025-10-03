"use client";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { observer } from "mobx-react-lite";
import { useStore } from "@/hooks/useStore";

const EditUserPage = observer(() => {
  const { userStore } = useStore();
  const router = useRouter();
  const params = useParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!params?.id) return;
      try {
        const user = await userStore.userApi.getUserById(params.id as string);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
      } catch (err) {
        console.error("Failed to load user", err);
        setError("Failed to load user.");
      }
    };
    fetchUser();
  }, [params?.id, userStore.userApi]);

  const handleUpdate = async () => {
    setError("");
    if (!firstName || !lastName) {
      setError("First name and Last name are required.");
      return;
    }

    try {
      setSaving(true);
      await userStore.userApi.updateUser(params.id as string, {
        firstName,
        lastName,
      });
      router.push("/admin/users");
    } catch (err) {
      console.error("Failed to update user", err);
      setError("Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit User
      </Typography>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 480 }}
      >
        <TextField
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <TextField
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={saving}
        >
          {saving ? "Saving..." : "Update"}
        </Button>

        <Button onClick={() => router.push("/admin/users")} disabled={saving}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
});

export default EditUserPage;