import { Flame, Trophy, Target } from "lucide-react";
import "./HabitStatsCard.css";

export default function HabitStatsCard({ stat }) {
  return (
    <div className="card stats-card">
      <div
        className="stats-icon-container"
        style={{ background: `${stat.color}26`, color: stat.color }}
      >
        {stat.icon}
      </div>
      <div className="flex-1-min-w-0">
        <div className="font-medium-truncate">{stat.name}</div>
        <div className="text-xs text-muted">{stat.category}</div>
      </div>
      <div className="stats-data-row">
        <div className="stats-item" title="Current streak">
          <Flame size={14} className="text-orange" />
          <span className="font-medium">{stat.currentStreak}</span>
        </div>
        <div className="stats-item" title="Longest streak">
          <Trophy size={14} className="text-amber" />
          <span className="font-medium">{stat.longestStreak}</span>
        </div>
        <div className="stats-item-desktop" title="30-day count">
          <Target size={14} className="text-brand" />
          <span className="font-medium">{stat.completions30d}/30</span>
        </div>
      </div>
    </div>
  );
}
