import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/userService";
import { displayNotification } from "../../../services/firebase";
import "./Login.scss";

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
      displayNotification("Successfully logged in!");
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        displayNotification(`Login failed: ${err.message}`);
      } else {
        setError("Failed to log in");
        displayNotification("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login__container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login__form">
        <input
          className="login__form-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          className="login__form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;