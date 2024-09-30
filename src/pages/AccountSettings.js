import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Snackbar, Alert } from '@mui/material';
import { useAuthContext } from '../hooks/useAuthContext';

const AccountSettings = () => {
    const { user } = useAuthContext();
    const [email, setEmail] = useState(user ? user.email : '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleUpdate = async () => {
        // Make an API call to update user settings
        try {
            const response = await fetch('http://localhost:4000/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error);
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Account Settings
                </Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleUpdate}
                    style={{ marginTop: '16px' }}
                >
                    Update
                </Button>
            </Paper>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error">
                    {error}
                </Alert>
            </Snackbar>
            
            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success">
                    Account updated successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AccountSettings;
