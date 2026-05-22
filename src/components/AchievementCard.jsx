import { RARITY } from "../utils/mockAchievements.js";
import { Lock } from "lucide-react";

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
      className={`relative group text-left w-full rounded-2xl p-4 transition-all duration-300 
        ${earned
          ? "achievement-earned"
          : "achievement-locked"
        } hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`}
      style={{
        "--rarity-color": rarity.color,
        "--rarity-glow": rarity.glow,
      }}
    >
      {/* Rarity indicator */}
      <div
        className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
        style={{
          background: earned ? `${rarity.color}22` : "var(--chip-bg)",
          color: earned ? rarity.color : "var(--text-faint)",
        }}
      >
        {rarity.label}
      </div>

      {/* Icon */}
      <div className="relative mb-3">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
            earned
              ? "badge-shine"
              : "grayscale opacity-50"
          }`}
          style={{
            background: earned
              ? `linear-gradient(135deg, ${rarity.color}22, ${rarity.color}11)`
              : "var(--chip-bg)",
            boxShadow: earned
              ? `0 4px 16px ${rarity.glow}`
              : "none",
          }}
        >
          {achievement.icon}
        </div>
        {!earned && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--surface-strong)] border border-[var(--surface-border)] flex items-center justify-center">
            <Lock size={11} className="text-faint" />
          </div>
        )}
      </div>

      {/* Title & Description */}
      <h3
        className={`text-sm font-semibold mb-1 transition-colors ${
          earned ? "" : "text-soft"
        }`}
      >
        {achievement.title}
      </h3>
      <p className="text-xs text-muted leading-relaxed mb-3">
        {achievement.description}
      </p>

      {/* Progress bar */}
      {!earned && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-faint">Progress</span>
            <span className="text-soft font-medium">
              {progress.current}/{progress.target}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--chip-bg)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
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
        <div className="flex items-center gap-1.5 mt-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: rarity.color }}
          />
          <span className="text-[10px] text-muted">
            Earned {new Date(achievement.earnedAt).toLocaleDateString(undefined, {
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
