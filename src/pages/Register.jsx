import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import "./Register.css";

export default function Register() {
  const { user, register } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setErr(e.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <button
        onClick={toggle}
        className="theme-toggle-btn glass"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="register-box">
        <Link
          to="/"
          className="register-logo-link"
        >
          <div className="register-logo-icon">
            <Sparkles size={18} />
          </div>
          <span className="register-logo-text">AI Habit Tracker</span>
        </Link>

        <div className="card register-card">
          <h1 className="register-title">Create your account</h1>
          <p className="register-subtitle">
            Free forever. Takes 30 seconds.
          </p>

          <form onSubmit={submit} className="register-form">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                value={form.name}
                onChange={set("name")}
                placeholder="Your name"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="At least 6 characters"
                required
              />
            </div>
            {err && (
              <div className="register-error">
                {err}
              </div>
            )}
            <button
              type="submit"
              className="btn-primary register-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="register-footer">
            Already have an account?{" "}
            <Link to="/login" className="register-footer-link">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
