"use client";

import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';

const EditUserPage = observer(() => {
    const { userStore } = useStore();
    const router = useRouter();
    const params = useParams();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            if (params?.id) {
                try {
                    const user = await userStore.userApi.getUserById(params.id as string);
                    setEmail(user.email || '');
                    setFirstName(user.name || '');
                } catch (err) {
                    console.error('Failed to load user', err);
                }
            }
        };

        fetchUser();
    }, [params?.id, userStore.userApi]);

    const handleUpdate = async () => {
        try {
            if (!email || !firstName) {
                setError('Email and Name are required');
                return;
            }
            await userStore.userApi.updateUser(params.id as string, { email, firstName });
            router.push('/users');
        } catch (err) {
            console.error('Failed to update user', err);
            setError('Failed to update user');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Edit User</Typography>
            {error && <Typography color="error" gutterBottom>{error}</Typography>}
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <TextField label="Name" value={name} onChange={(e) => setFirstName(e.target.value)} required />
                <TextField label="Password (optional)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
                <Button onClick={() => router.push('..')}>Cancel</Button>
            </Box>
        </Container>
    );
});

export default EditUserPage;