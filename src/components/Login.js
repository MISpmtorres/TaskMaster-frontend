import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper, CircularProgress } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle specific error messages
                if (response.status === 401) {
                    setError('Invalid credentials. Please try again.');
                } else if (response.status === 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError(data.error || 'Something went wrong. Please try again.');
                }
            } else {
                // Store the token and handle successful login
                console.log('token from Login: ' + data.token)
                localStorage.setItem('token', data.token);
                console.log('Login successful:', data);
                // Redirect or update state as needed
            }
        } catch (err) {
            setError('Network error. Ensure the backend is running and CORS is configured properly.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h5" align="center">Login</Typography>
                <form onSubmit={handleSubmit}>
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
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <Typography color="error" align="center">{error}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '16px' }}
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
