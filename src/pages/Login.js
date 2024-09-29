import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const { login, isLoading, error } = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
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
                    {error && <Typography color="error" align="center">{error}</Typography>} {/* Display error message */}
                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        disabled={isLoading} 
                        style={{ marginTop: '16px' }}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <Button 
                    onClick={() => navigate('/')} // Navigate to home page
                    fullWidth 
                    variant="outlined" 
                    color="secondary" 
                    style={{ marginTop: '16px' }}
                >
                    Back to Home
                </Button>
            </Paper>
        </Container>
    );
};

export default Login;
