'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Fade,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      router.push('/admin/chatbot/editor');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'linear-gradient(135deg, #e0e7ff 0%, #f5f5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Fade in>
        <Paper
          elevation={8}
          sx={{
            p: 5,
            width: '100%',
            maxWidth: 380,
            borderRadius: 4,
            backdropFilter: 'blur(8px)',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: '#1976d2',
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              boxShadow: 2,
            }}
          >
            <LockOutlinedIcon sx={{ color: '#fff', fontSize: 36 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} color="#222" gutterBottom>
            Admin Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              margin="normal"
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 700,
                fontSize: 18,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #1976d2 0%, #5c6bc0 100%)',
                boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.12)',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1565c0 0%, #3949ab 100%)',
                  boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.18)',
                },
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
} 