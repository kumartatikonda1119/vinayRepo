import { RARITY } from "../utils/mockAchievements.js";
import { Lock } from "lucide-react";
import "./AchievementCard.css";

export default function AchievementCard({ achievement, onClick }) {
  const earned = !!achievement.earnedAt;
  const rarity = RARITY[achievement.rarity];
  const progress = achievement.progress;
  const progressPct = Math.min(
    100,
    Math.round((progress.current / progress.target) * 100)
  );

  return (
    <button
      onClick={() => onClick?.(achievement)}
      className={`achievement-card-btn ${
        earned ? "achievement-earned" : "achievement-locked"
      }`}
      style={{
        "--rarity-color": rarity.color,
        "--rarity-glow": rarity.glow,
      }}
    >
      {/* Rarity indicator */}
      <div
        className="achievement-rarity-badge"
        style={{
          background: earned ? `${rarity.color}22` : "var(--chip-bg)",
          color: earned ? rarity.color : "var(--text-faint)",
        }}
      >
        {rarity.label}
      </div>

      {/* Icon */}
      <div className="achievement-icon-wrapper">
        <div
          className={`achievement-icon-container ${
            earned ? "badge-shine" : "locked"
          }`}
          style={{
            background: earned
              ? `linear-gradient(135deg, ${rarity.color}22, ${rarity.color}11)`
              : "var(--chip-bg)",
            boxShadow: earned ? `0 4px 16px ${rarity.glow}` : "none",
          }}
        >
          {achievement.icon}
        </div>
        {!earned && (
          <div className="achievement-lock-indicator">
            <Lock size={11} className="text-faint" />
          </div>
        )}
      </div>

      {/* Title & Description */}
      <h3 className={`achievement-title ${earned ? "" : "locked"}`}>
        {achievement.title}
      </h3>
      <p className="achievement-desc">{achievement.description}</p>

      {/* Progress bar */}
      {!earned && (
        <div className="achievement-progress-container">
          <div className="achievement-progress-header">
            <span className="text-faint">Progress</span>
            <span className="text-soft font-medium">
              {progress.current}/{progress.target}
            </span>
          </div>
          <div
            className="achievement-progress-track"
            style={{ background: "var(--chip-bg)" }}
          >
            <div
              className="achievement-progress-fill"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, ${rarity.color}88, ${rarity.color})`,
              }}
            />
          </div>
        </div>
      )}

      {/* Earned date */}
      {earned && (
        <div className="achievement-earned-date">
          <div
            className="achievement-dot"
            style={{ background: rarity.color }}
          />
          <span className="text-[10px] text-muted">
            Earned{" "}
            {new Date(achievement.earnedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      )}
    </button>
  );
}
