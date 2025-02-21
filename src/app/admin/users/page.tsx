"use client";

import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useStore';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

const UserListPage = observer(() => {
    const { userStore } = useStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await userStore.userApi.getAllUsers();
                // Filter out admin users
                setUsers(fetchedUsers.filter((user: User) => user.role !== 'admin'));
            } catch (error) {
                console.error('Failed to load users', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userStore]);

    const handleCreate = () => {
        router.push('users/create');
    };

    const handleEdit = (id: string) => {
        router.push(`users/edit/${id}`);
    };

    const handleDelete = async () => {
        if (deleteUserId) {
            try {
                await userStore.userApi.deleteUser(deleteUserId);
                setUsers(users.filter(user => user.id !== deleteUserId));
            } catch (error) {
                console.error('Failed to delete user', error);
            } finally {
                setDeleteUserId(null);
            }
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>User Management</Typography>
            <Button variant="contained" color="primary" onClick={handleCreate}>Create User</Button>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(user.id)}>Edit</Button>
                                    <Button color="error" onClick={() => setDeleteUserId(user.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirmation Dialog */}
            <Dialog open={!!deleteUserId} onClose={() => setDeleteUserId(null)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this user? This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteUserId(null)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
});

export default UserListPage;