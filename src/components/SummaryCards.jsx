import { ListChecks, Flame, Trophy, TrendingUp } from "lucide-react";
import "./SummaryCards.css";

const Card = ({ icon: Icon, label, value, iconBg, iconFg }) => (
  <div className="card summary-card">
    <div
      className="summary-icon-container"
      style={{ background: iconBg, color: iconFg }}
    >
      <Icon size={18} />
    </div>
    <div>
      <div className="summary-label">{label}</div>
      <div className="summary-value">{value}</div>
    </div>
  </div>
);

export default function SummaryCards({ totalHabits, activeStreaks, bestStreak, weekRate }) {
  return (
    <div className="summary-grid">
      <Card
        icon={ListChecks}
        label="Total habits"
        value={totalHabits}
        iconBg="rgba(99,102,241,0.15)"
        iconFg="#6366f1"
      />
      <Card
        icon={Flame}
        label="Active streaks"
        value={activeStreaks}
        iconBg="rgba(249,115,22,0.15)"
        iconFg="#f97316"
      />
      <Card
        icon={Trophy}
        label="Best streak"
        value={bestStreak}
        iconBg="rgba(245,158,11,0.15)"
        iconFg="#f59e0b"
      />
      <Card
        icon={TrendingUp}
        label="This week"
        value={`${weekRate}%`}
        iconBg="rgba(16,185,129,0.15)"
        iconFg="#10b981"
      />
    </div>
  );
}
