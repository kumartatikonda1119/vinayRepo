import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Brain,
  BarChart3,
  Sparkles,
  LogOut,
  Sun,
  Moon,
  Trophy,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import "./MobileNav.css";

export default function MobileNav() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  return (
    <>
      <div className="mobile-header glass divider">
        <div className="mobile-brand">
          <div className="mobile-logo">
            <Sparkles size={16} />
          </div>
          <div className="mobile-title">AI Habit Tracker</div>
        </div>
        <div className="mobile-actions">
          <button
            onClick={toggle}
            className="mobile-btn"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="mobile-avatar">
            {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <button
            onClick={logout}
            className="mobile-btn"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      <nav className="mobile-nav glass divider">
        {[
          { to: "/dashboard", label: "Home", icon: LayoutDashboard },
          { to: "/habits", label: "Habits", icon: ListChecks },
          { to: "/ai-coach", label: "Coach", icon: Brain },
          { to: "/achievements", label: "Awards", icon: Trophy },
        ].map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? "active" : "inactive"}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
