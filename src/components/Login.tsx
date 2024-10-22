import React, { useState } from 'react';
import { loginUser, resetPassword } from '../services/userService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
    } catch (error) {
      setError('Failed to log in');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    try {
      await resetPassword(email);
      alert('Password reset email sent. Check your inbox.');
    } catch (error) {
      setError('Failed to send password reset email');
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleResetPassword}>Reset Password</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;