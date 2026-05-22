import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Brain,
  BarChart3,
  LogOut,
  Settings,
  Sparkles,
  Sun,
  Moon,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import Modal from "./Modal.jsx";
import api from "../api/axios.js";
import "./Sidebar.css";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/ai-coach", label: "AI Coach", icon: Brain },
  { to: "/achievements", label: "Achievements", icon: Trophy },
];

export default function Sidebar() {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggle } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [morning, setMorning] = useState(user?.morningMotivation || false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", {
        name,
        morningMotivation: morning,
      });
      updateUser(res.data.user);
      setSettingsOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="sidebar-aside glass">
      <div className="sidebar-header divider">
        <div className="sidebar-brand">
          <div className="sidebar-icon-container">
            <Sparkles size={18} />
          </div>
          <div className="sidebar-title">AI Habit Tracker</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : "inactive"}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer divider">
        <button
          onClick={toggle}
          className="sidebar-footer-btn"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>

        <button
          className="sidebar-footer-btn"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings size={18} />
          Settings
        </button>

        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="sidebar-profile-info">
            <div className="sidebar-username">{user?.name}</div>
            <div className="sidebar-email">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="sidebar-logout-btn"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
      >
        <div className="settings-content">
          <div>
            <label className="label">Display name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <label className="settings-checkbox-container glass">
            <input
              type="checkbox"
              checked={morning}
              onChange={(e) => setMorning(e.target.checked)}
              className="settings-checkbox"
            />
            <div>
              <div className="checkbox-title">Morning motivation</div>
              <div className="checkbox-desc">
                Show a short personalised AI message every morning on the
                dashboard.
              </div>
            </div>
          </label>

          <div className="settings-actions">
            <button
              className="btn-secondary"
              onClick={() => setSettingsOpen(false)}
            >
              Cancel
            </button>
            <button className="btn-primary" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}
