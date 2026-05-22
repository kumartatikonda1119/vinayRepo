import { useState, useEffect, useMemo } from "react";
import { Trophy, Flame, Target, Sparkles } from "lucide-react";
import api from "../api/axios.js";
import AchievementCard from "../components/AchievementCard.jsx";
import { ACHIEVEMENT_CATEGORIES, RARITY } from "../utils/mockAchievements.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Modal from "../components/Modal.jsx";
import { celebrate } from "../utils/confetti.js";
import "./Achievements.css";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/achievements");
        setAchievements(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === "All") return achievements;
    return achievements.filter((a) => a.category === activeTab);
  }, [achievements, activeTab]);

  const earned = useMemo(
    () => achievements.filter((a) => a.earnedAt),
    [achievements]
  );
  const totalCount = achievements.length;
  const earnedCount = earned.length;
  const earnedPct = totalCount
    ? Math.round((earnedCount / totalCount) * 100)
    : 0;

  // Count by rarity
  const rarityCounts = useMemo(() => {
    const counts = { common: 0, rare: 0, epic: 0, legendary: 0 };
    for (const a of earned) counts[a.rarity]++;
    return counts;
  }, [earned]);

  const handleCardClick = (achievement) => {
    setSelectedAchievement(achievement);
    if (achievement.earnedAt) {
      celebrate();
    }
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="achievements-container animate-fade-in">
      {/* Header */}
      <div className="achievements-header">
        <div>
          <h1>
            <Trophy size={28} className="achievements-header-trophy" />
            Achievements
          </h1>
          <p>Track your milestones and showcase your progress</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="achievements-stats-grid">
        <div className="card stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon-container icon-container-brand">
              <Trophy size={16} className="text-brand" />
            </div>
            <span className="stat-card-label">Earned</span>
          </div>
          <div className="stat-card-value">
            {earnedCount}
            <span className="stat-card-denominator">/{totalCount}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon-container icon-container-emerald">
              <Target size={16} className="text-emerald" />
            </div>
            <span className="stat-card-label">Completion</span>
          </div>
          <div className="stat-card-value">{earnedPct}%</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon-container icon-container-purple">
              <Sparkles size={16} className="text-purple" />
            </div>
            <span className="stat-card-label">Rarest</span>
          </div>
          <div className="stat-card-subtext">
            {rarityCounts.legendary > 0
              ? `${rarityCounts.legendary} Legendary`
              : rarityCounts.epic > 0
              ? `${rarityCounts.epic} Epic`
              : `${rarityCounts.rare} Rare`}
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon-container icon-container-orange">
              <Flame size={16} className="text-orange" />
            </div>
            <span className="stat-card-label">Next Up</span>
          </div>
          <div className="stat-card-subtext">
            {achievements.find((a) => !a.earnedAt)?.title || "All done! 🎉"}
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="card progress-card">
        <div className="progress-card-header">
          <span className="progress-card-title">Overall Progress</span>
          <span className="progress-card-count">
            {earnedCount} of {totalCount} achievements
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${earnedPct}%`,
              background: "linear-gradient(90deg, #fbbf24, #d97706, #f59e0b)",
            }}
          />
        </div>
        {/* Rarity breakdown */}
        <div className="rarity-breakdown-row">
          {Object.entries(RARITY).map(([key, r]) => (
            <div key={key} className="rarity-breakdown-item">
              <div
                className="rarity-indicator-dot"
                style={{ background: r.color }}
              />
              <span className="rarity-breakdown-text">
                {rarityCounts[key]} {r.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs-scroll-row">
        {ACHIEVEMENT_CATEGORIES.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`filter-tab-btn ${isActive ? "active" : "inactive glass"}`}
            >
              {cat}
              {cat !== "All" && (
                <span className="tab-count-badge">
                  {achievements.filter((a) =>
                    cat === "All" ? true : a.category === cat
                  ).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Achievement Grid */}
      <div className="achievements-cards-grid">
        {filtered
          .sort((a, b) => {
            // Earned first, then by rarity
            if (a.earnedAt && !b.earnedAt) return -1;
            if (!a.earnedAt && b.earnedAt) return 1;
            const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
          })
          .map((a) => (
            <AchievementCard
              key={a.id}
              achievement={a}
              onClick={handleCardClick}
            />
          ))}
      </div>

      {filtered.length === 0 && (
        <div className="card empty-achievements-card">
          <div className="text-4xl mb-3">🏆</div>
          <div className="font-medium">No achievements in this category yet</div>
          <div className="text-muted">
            Keep building habits to unlock achievements!
          </div>
        </div>
      )}

      {/* Achievement Detail Modal */}
      <Modal
        open={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        title="Achievement Details"
        maxWidth="max-w-sm"
      >
        {selectedAchievement && (
          <div className="detail-modal-body">
            <div
              className={`modal-badge ${
                selectedAchievement.earnedAt ? "badge-shine" : "locked"
              }`}
              style={{
                background: selectedAchievement.earnedAt
                  ? `linear-gradient(135deg, ${RARITY[selectedAchievement.rarity].color}22, ${RARITY[selectedAchievement.rarity].color}11)`
                  : "var(--chip-bg)",
                boxShadow: selectedAchievement.earnedAt
                  ? `0 8px 32px ${RARITY[selectedAchievement.rarity].glow}`
                  : "none",
              }}
            >
              {selectedAchievement.icon}
            </div>

            <div>
              <h3 className="modal-achievement-title">
                {selectedAchievement.title}
              </h3>
              <div
                className="modal-rarity-badge"
                style={{
                  background: `${RARITY[selectedAchievement.rarity].color}22`,
                  color: RARITY[selectedAchievement.rarity].color,
                }}
              >
                {RARITY[selectedAchievement.rarity].label}
              </div>
            </div>

            <p className="modal-achievement-desc">
              {selectedAchievement.description}
            </p>

            {selectedAchievement.earnedAt ? (
              <div className="glass modal-detail-panel">
                <div className="modal-detail-panel-label">Earned on</div>
                <div className="modal-detail-panel-value">
                  {new Date(selectedAchievement.earnedAt).toLocaleDateString(
                    undefined,
                    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div className="glass modal-detail-panel text-left">
                  <div className="modal-progress-row">
                    <span className="text-muted">Progress</span>
                    <span className="font-medium">
                      {selectedAchievement.progress.current}/
                      {selectedAchievement.progress.target}
                    </span>
                  </div>
                  <div
                    className="progress-bar-container"
                    style={{ height: "0.5rem" }}
                  >
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, Math.round((selectedAchievement.progress.current / selectedAchievement.progress.target) * 100))}%`,
                        background: `linear-gradient(90deg, ${RARITY[selectedAchievement.rarity].color}88, ${RARITY[selectedAchievement.rarity].color})`,
                      }}
                    />
                  </div>
                </div>
                {selectedAchievement.tip && (
                  <div className="glass modal-detail-panel text-left">
                    <div className="modal-tip-header">
                      <Sparkles size={10} /> Tip
                    </div>
                    <div className="modal-achievement-desc">
                      {selectedAchievement.tip}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              className="btn-secondary w-full"
              onClick={() => setSelectedAchievement(null)}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
