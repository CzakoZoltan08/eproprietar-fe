"use client";

import { Box, Button, Container, TextField, Typography } from "@mui/material";

import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";

const CreateUserPage = observer(() => {
    const { userStore } = useStore();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const handleCreate = async () => {
        try {
            if (!email || !firstName || !lastName) {
                setError('All fields are required');
                return;
            }

            await userStore.userApi.createFirebaseUser({
                email,
                firstName,
                lastName
            });
            router.push('/admin/users');
        } catch (err) {
            console.error('Failed to create user', err);
            setError('Failed to create user');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Create User</Typography>
            {error && <Typography color="error" gutterBottom>{error}</Typography>}
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <Button variant="contained" color="primary" onClick={handleCreate}>Create</Button>
                <Button onClick={() => router.push('.')}>Cancel</Button>
            </Box>
        </Container>
    );
});

export default CreateUserPage;