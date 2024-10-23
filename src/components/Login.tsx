import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, resetPassword } from "../services/userService.ts";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginUser(email, password);
      // Redirige al usuario a la página principal o a su panel de usuario después del login
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to log in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await resetPassword(email);
      setError("Password reset email sent. Check your inbox."); // Reemplaza alert con un mensaje de estado
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send password reset email");
      }
    } finally {
      setIsLoading(false);
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button type="button" onClick={handleResetPassword} disabled={isLoading}>
        {isLoading ? "Sending..." : "Reset Password"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
