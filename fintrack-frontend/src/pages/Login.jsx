import React, { useState, useContext } from 'react';
import {
Container, Typography, TextField, Button, Box,
Paper, Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(username, password);
            navigate('/dashboard');
        } catch (error) {
            setError('Failed to sign in. Check your username and password.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
    <Container maxWidth="sm">
    <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
    <Typography variant="h4" component="h1" align="center" gutterBottom>
    Sign In
    </Typography>

    {error && (
    <Alert severity="error" sx={{ mb: 2 }}>
    {error}
    </Alert>
    )}

<Box component="form" onSubmit={handleSubmit}>
<TextField
label="Username"
value={username}
onChange={(e) => setUsername(e.target.value)}
fullWidth
margin="normal"
required
/>

<TextField
label="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
fullWidth
margin="normal"
type="password"
required
/>

<Button
type="submit"
fullWidth
variant="contained"
color="primary"
sx={{ mt: 3, mb: 2 }}
disabled={loading}
>
{loading ? 'Signing in...' : 'Sign In'}
</Button>

<Box sx={{ textAlign: 'center', mt: 2 }}>
<Typography variant="body2">
Don't have an account?{' '}
<Link to="/register" style={{ textDecoration: 'none' }}>
Sign Up
</Link>
</Typography>
</Box>
</Box>
</Paper>
</Container>
);
}

export default Login;