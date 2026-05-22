import { Link, Navigate } from "react-router-dom";
import {
  Sparkles,
  Flame,
  BarChart3,
  Brain,
  CheckCircle2,
  ArrowRight,
  Target,
  Activity,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import OrbitingHabits from "../components/OrbitingHabits.jsx";
import "./Landing.css";

const features = [
  {
    icon: CheckCircle2,
    title: "Track daily habits",
    desc: "One-click check-offs with progress rings, streaks and a 90-day heatmap.",
  },
  {
    icon: Brain,
    title: "AI weekly insights",
    desc: "Personalised reports on what worked, what struggled, and what to try next.",
  },
  {
    icon: Flame,
    title: "Streak recovery coach",
    desc: "When streaks break, AI generates a gentle 3-day comeback plan.",
  },
  {
    icon: BarChart3,
    title: "Beautiful statistics",
    desc: "See patterns across days, weeks, categories — with an AI chat built-in.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen">
      <header className="landing-header">
        <div className="landing-logo">
          <div className="landing-logo-icon">
            <Sparkles size={18} />
          </div>
          <span className="landing-logo-text">AI Habit Tracker</span>
        </div>
        <nav className="landing-nav">
          <button
            onClick={toggle}
            className="btn-ghost p-2.5"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login" className="btn-ghost">
            Log in
          </Link>
          <Link to="/register" className="btn-primary">
            Get started
          </Link>
        </nav>
      </header>

      <section className="landing-hero-section">
        <div className="landing-hero-grid">
          <div className="landing-hero-content">
            <div className="landing-hero-badge chip bg-brand-500/15 text-brand-700 dark:text-brand-300">
              <Sparkles size={12} />
              AI-powered habit coach
            </div>
            <h1 className="landing-hero-title">
              Build habits that stick,
              <br />
              with an AI that actually{" "}
              <span className="landing-gradient-text">
                knows you
              </span>
              .
            </h1>
            <p className="landing-hero-desc">
              Track your habits, watch your streaks grow, and let AI turn your
              data into real encouragement — not generic motivation.
            </p>
            <div className="landing-hero-actions">
              <Link to="/register" className="btn-primary px-5 py-3 text-base">
                Start free
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-secondary px-5 py-3 text-base">
                I have an account
              </Link>
            </div>
          </div>

          <div className="landing-hero-orbit">
            <OrbitingHabits />
          </div>
        </div>

        <div className="landing-demo-grid">
          <div className="card p-6 relative overflow-hidden">
            <div className="landing-section-sub">
              Today
            </div>
            <div className="landing-demo-list">
              {[
                { icon: "💧", name: "Drink 2L water", done: true, streak: 12 },
                { icon: "📚", name: "Read 20 minutes", done: true, streak: 7 },
                { icon: "🏃", name: "Morning run", done: false, streak: 3 },
              ].map((h, i) => (
                <div
                  key={i}
                  className={`landing-demo-item glass ${h.done ? "done" : ""}`}
                >
                  <span className="landing-demo-icon">
                    {h.icon}
                  </span>
                  <div className="landing-demo-name">{h.name}</div>
                  <div className="landing-demo-streak">
                    <Flame size={12} className="text-orange-500" />
                    {h.streak}
                  </div>
                  <div
                    className={`landing-demo-checkbox ${h.done ? "checked" : "unchecked"}`}
                  >
                    {h.done && <CheckCircle2 size={14} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 relative overflow-hidden">
            <div className="landing-report-bg"
              style={{
                background:
                  "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.22), transparent 55%)",
              }}
            />
            <div className="relative">
              <div className="landing-section-sub flex items-center gap-2">
                <Sparkles size={12} />
                AI Weekly Report
              </div>
              <p className="text-sm leading-relaxed">
                Big week for hydration — 7/7 on <b>Drink 2L water</b>! Your
                morning runs slipped to 3/5 on weekdays. Consistency pattern:
                you're strongest Mon–Wed. Try prepping shoes by the door tonight
                to protect tomorrow's momentum. Proud of you.
              </p>
              <div className="landing-stats-grid">
                {[
                  { label: "Streaks", value: "4" },
                  { label: "This week", value: "86%" },
                  { label: "Best ever", value: "28d" },
                ].map((s) => (
                  <div key={s.label} className="landing-stat-card glass">
                    <div className="landing-stat-value">{s.value}</div>
                    <div className="landing-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features-section">
        <div className="landing-features-header">
          <h2 className="landing-features-title">
            Everything you need, nothing you don't
          </h2>
          <p className="mt-3 text-soft">
            Clean tracking, deep stats, and AI features that understand your
            actual data.
          </p>
        </div>
        <div className="landing-features-grid">
          {features.map((f) => (
            <div key={f.title} className="card p-5">
              <div className="landing-feature-icon">
                <f.icon size={18} />
              </div>
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-soft mt-1 leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta-section">
        <div className="landing-cta-card text-white">
          <div className="landing-cta-bg"
            style={{
              background:
                "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.25), transparent 55%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.3), transparent 55%)",
            }}
          />
          <div className="relative">
            <div className="landing-cta-icons">
              <Target size={18} />
              <Activity size={18} />
              <Sparkles size={18} />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Your first streak is 3 clicks away.
            </h2>
            <p className="mt-3 text-brand-100 max-w-lg mx-auto">
              Create your account, add a habit, check it off. That's the whole
              onboarding.
            </p>
            <Link
              to="/register"
              className="landing-cta-btn"
            >
              Create my account
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        Built with MERN · AI Habit Tracker © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
