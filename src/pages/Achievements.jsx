import { useState, useEffect, useMemo } from "react";
import { Trophy, Filter, Star, Flame, Target, Sparkles, X } from "lucide-react";
import api from "../api/axios.js";
import AchievementCard from "../components/AchievementCard.jsx";
import { ACHIEVEMENT_CATEGORIES, RARITY } from "../utils/mockAchievements.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Modal from "../components/Modal.jsx";
import { celebrate } from "../utils/confetti.js";

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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Trophy size={28} className="text-brand-500" />
            Achievements
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Track your milestones and showcase your progress
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-700/10 flex items-center justify-center">
              <Trophy size={16} className="text-brand-500" />
            </div>
            <span className="text-xs text-muted">Earned</span>
          </div>
          <div className="text-2xl font-bold">
            {earnedCount}
            <span className="text-sm font-normal text-faint">
              /{totalCount}
            </span>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 flex items-center justify-center">
              <Target size={16} className="text-emerald-400" />
            </div>
            <span className="text-xs text-muted">Completion</span>
          </div>
          <div className="text-2xl font-bold">{earnedPct}%</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-700/10 flex items-center justify-center">
              <Sparkles size={16} className="text-purple-400" />
            </div>
            <span className="text-xs text-muted">Rarest</span>
          </div>
          <div className="text-sm font-semibold">
            {rarityCounts.legendary > 0
              ? `${rarityCounts.legendary} Legendary`
              : rarityCounts.epic > 0
              ? `${rarityCounts.epic} Epic`
              : `${rarityCounts.rare} Rare`}
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-700/10 flex items-center justify-center">
              <Flame size={16} className="text-orange-400" />
            </div>
            <span className="text-xs text-muted">Next Up</span>
          </div>
          <div className="text-sm font-semibold truncate">
            {achievements.find((a) => !a.earnedAt)?.title || "All done! 🎉"}
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted">
            {earnedCount} of {totalCount} achievements
          </span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--chip-bg)" }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${earnedPct}%`,
              background: "linear-gradient(90deg, #fbbf24, #d97706, #f59e0b)",
            }}
          />
        </div>
        {/* Rarity breakdown */}
        <div className="flex gap-4 mt-3">
          {Object.entries(RARITY).map(([key, r]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: r.color }}
              />
              <span className="text-[10px] text-muted">
                {rarityCounts[key]} {r.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {ACHIEVEMENT_CATEGORIES.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-r from-brand-500/15 to-brand-500/5 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/20"
                  : "text-soft hover:bg-[var(--surface-hover)] glass"
              }`}
            >
              {cat}
              {cat !== "All" && (
                <span className="ml-1.5 text-xs text-faint">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <div className="font-medium">No achievements in this category yet</div>
          <div className="text-sm text-muted mt-1">
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
          <div className="text-center space-y-4">
            <div
              className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-4xl ${
                selectedAchievement.earnedAt ? "badge-shine" : "grayscale opacity-50"
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
              <h3 className="text-lg font-semibold">
                {selectedAchievement.title}
              </h3>
              <div
                className="text-xs font-bold uppercase tracking-wider mt-1 inline-block px-2 py-0.5 rounded-full"
                style={{
                  background: `${RARITY[selectedAchievement.rarity].color}22`,
                  color: RARITY[selectedAchievement.rarity].color,
                }}
              >
                {RARITY[selectedAchievement.rarity].label}
              </div>
            </div>

            <p className="text-sm text-soft">
              {selectedAchievement.description}
            </p>

            {selectedAchievement.earnedAt ? (
              <div className="glass rounded-xl p-3">
                <div className="text-xs text-muted mb-1">Earned on</div>
                <div className="text-sm font-medium">
                  {new Date(selectedAchievement.earnedAt).toLocaleDateString(
                    undefined,
                    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="glass rounded-xl p-3">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted">Progress</span>
                    <span className="font-medium">
                      {selectedAchievement.progress.current}/
                      {selectedAchievement.progress.target}
                    </span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--chip-bg)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((selectedAchievement.progress.current / selectedAchievement.progress.target) * 100))}%`,
                        background: `linear-gradient(90deg, ${RARITY[selectedAchievement.rarity].color}88, ${RARITY[selectedAchievement.rarity].color})`,
                      }}
                    />
                  </div>
                </div>
                {selectedAchievement.tip && (
                  <div className="glass rounded-xl p-3 text-left">
                    <div className="text-xs text-muted mb-1 flex items-center gap-1">
                      <Sparkles size={10} /> Tip
                    </div>
                    <div className="text-sm text-soft">
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
