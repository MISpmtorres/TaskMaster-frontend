import React, { useState } from 'react';
import { useSignup } from '../hooks/useSignup';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const { signup, isLoading, error } = useSignup();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Use navigate to redirect

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(email, password);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h5" align="center">Sign Up</Typography>
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
                        {isLoading ? 'Signing up...' : 'Sign Up'}
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

export default Signup;
