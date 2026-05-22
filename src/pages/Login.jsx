import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import "./Login.css";

export default function Login() {
  const { user, login } = useAuth();
  const { theme, toggle } = useTheme();
  const loc = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(loc.state?.from || "/dashboard", { replace: true });
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button
        onClick={toggle}
        className="theme-toggle-btn glass"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="login-box">
        <Link
          to="/"
          className="login-logo-link"
        >
          <div className="login-logo-icon">
            <Sparkles size={18} />
          </div>
          <span className="login-logo-text">AI Habit Tracker</span>
        </Link>

        <div className="card login-card">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">
            Log in to continue your streaks.
          </p>

          <form onSubmit={submit} className="login-form">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {err && (
              <div className="login-error">
                {err}
              </div>
            )}
            <button
              type="submit"
              className="btn-primary login-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="login-footer">
            Don't have an account?{" "}
            <Link to="/register" className="login-footer-link">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
