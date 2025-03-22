import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../context/AuthContext';

// Simulated user database (replace with actual API calls)
const MOCK_USERS = [
  {
    email: 'admin@restaurant.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
  },
  {
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
    firstName: 'John',
    lastName: 'Doe',
  },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    // Check if account is locked in localStorage
    const lockoutTime = localStorage.getItem('loginLockoutTime');
    if (lockoutTime) {
      const timeLeft = parseInt(lockoutTime) - Date.now();
      if (timeLeft > 0) {
        setIsLocked(true);
        setLockTimer(Math.ceil(timeLeft / 1000));
      } else {
        localStorage.removeItem('loginLockoutTime');
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            localStorage.removeItem('loginLockoutTime');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const lockAccount = () => {
    const lockoutDuration = 5 * 60 * 1000; // 5 minutes
    const lockoutTime = Date.now() + lockoutDuration;
    localStorage.setItem('loginLockoutTime', lockoutTime.toString());
    setIsLocked(true);
    setLockTimer(300); // 5 minutes in seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError(`Account is locked. Please try again in ${lockTimer} seconds.`);
      return;
    }

    try {
      // Check if user exists in database first
      const user = MOCK_USERS.find((u) => u.email === formData.email);
      
      if (!user) {
        setError('No account found with this email. Please sign up first.');
        navigate('/register');
        return;
      }

      // Validate role
      if (user.role !== formData.role) {
        throw new Error('Invalid role selected for this account');
      }

      // Validate password
      if (user.password !== formData.password) {
        setAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= 3) {
            lockAccount();
          }
          return newAttempts;
        });
        throw new Error('Invalid password');
      }

      // Login successful
      setAttempts(0);
      login(user);

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            padding: 1,
            marginBottom: 1,
          }}
        >
          <LockOutlinedIcon sx={{ color: 'white' }} />
        </Box>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        {isLocked && (
          <Alert severity="warning" sx={{ width: '100%', mt: 2 }}>
            Account is locked. Please try again in {lockTimer} seconds.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            disabled={isLocked}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLocked}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
              required
              disabled={isLocked}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLocked}
          >
            Sign In
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
            <Box sx={{ mt: 1 }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Demo credentials */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Demo Credentials:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin: admin@restaurant.com / admin123
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customer: customer@example.com / customer123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 