import React, { useState } from 'react';
import Button from '../components/Button';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/UserService'; // ← Fixed this line
import '../styles/Login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await loginUser({ email, password });
      
      // Store user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.type);
      localStorage.setItem('userName', response.data.firstName);
      
      console.log('Login successful:', response.data);

      // Navigate to the dashboard after login
      navigate('/dashboard', {
        state: {
          name: response.data.firstName,
          userType: response.data.type,
          token: response.data.token
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page">
        <h2>Login</h2>
        
        {error && (
          <div className="error-message" style={{ 
            color: 'red', 
            marginBottom: '1rem', 
            padding: '0.5rem',
            backgroundColor: '#fee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="register-link-container">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;