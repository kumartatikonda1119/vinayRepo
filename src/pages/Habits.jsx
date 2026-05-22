import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Archive,
  Pencil,
  Trash2,
  Flame,
  Trophy,
  ArchiveRestore,
  Sparkles,
} from "lucide-react";
import api from "../api/axios.js";
import Modal from "../components/Modal.jsx";
import HabitForm from "../components/HabitForm.jsx";
import HabitSuggestionModal from "../components/HabitSuggestionModal.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { CATEGORIES } from "../utils/constants.js";
import { streakFromKeys } from "../utils/dateHelpers.js";
import { format, subDays } from "date-fns";
import "./Habits.css";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [logsByHabit, setLogsByHabit] = useState({});
  const [loading, setLoading] = useState(true);

  const [showArchived, setShowArchived] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [habitsRes, rangeRes] = await Promise.all([
        api.get("/habits", { params: { includeArchived: "true" } }),
        api.get("/logs/range", {
          params: {
            start: format(subDays(new Date(), 89), "yyyy-MM-dd"),
            end: format(new Date(), "yyyy-MM-dd"),
          },
        }),
      ]);
      setHabits(habitsRes.data);
      const byId = {};
      for (const h of habitsRes.data) byId[h._id] = [];
      for (const l of rangeRes.data) {
        if (!byId[l.habitId]) byId[l.habitId] = [];
        byId[l.habitId].push(l.completedDate);
      }
      for (const k of Object.keys(byId)) byId[k] = byId[k].sort().reverse();
      setLogsByHabit(byId);
    } finally {
      setLoading(false);
    }
  };

  const useEffectFn = () => {
    load();
  };
  useEffect(useEffectFn, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return habits.filter((h) => {
      if (!showArchived && h.isArchived) return false;
      if (showArchived && !h.isArchived) return false;
      if (category !== "All" && h.category !== category) return false;
      if (q && !h.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [habits, query, category, showArchived]);

  const activeCount = habits.filter((h) => !h.isArchived).length;
  const archivedCount = habits.filter((h) => h.isArchived).length;

  const save = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        const res = await api.put(`/habits/${editing._id}`, data);
        setHabits((hs) => hs.map((h) => (h._id === res.data._id ? res.data : h)));
      } else {
        const res = await api.post("/habits", data);
        setHabits((hs) => [...hs, res.data]);
        setLogsByHabit((p) => ({ ...p, [res.data._id]: [] }));
      }
      setFormOpen(false);
      setEditing(null);
    } finally {
      setSubmitting(false);
    }
  };

  const archive = async (habit) => {
    const res = await api.put(`/habits/${habit._id}/archive`);
    setHabits((hs) => hs.map((h) => (h._id === res.data._id ? res.data : h)));
  };

  const remove = async (habit) => {
    await api.delete(`/habits/${habit._id}`);
    setHabits((hs) => hs.filter((h) => h._id !== habit._id));
    setDeleteTarget(null);
  };

  const acceptSuggestion = async (s) => {
    const res = await api.post("/habits", {
      name: s.name,
      description: s.description,
      category: s.category,
      frequency: s.frequency,
      icon: s.icon,
      targetDays: s.frequency === "daily" ? 7 : 3,
    });
    setHabits((hs) => [...hs, res.data]);
    setLogsByHabit((p) => ({ ...p, [res.data._id]: [] }));
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="habits-container animate-fade-in">
      <div className="habits-header">
        <div>
          <h1>All habits</h1>
          <p>Manage every habit you've ever created.</p>
        </div>
        <div className="habits-header-actions">
          <button
            className="btn-secondary"
            onClick={() => setSuggestOpen(true)}
          >
            <Sparkles size={14} />
            <span className="hide-mobile">Suggest</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus size={14} />
            New habit
          </button>
        </div>
      </div>

      <div className="card filter-bar">
        <div className="filter-row">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              className="input search-input"
              placeholder="Search habits..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="input category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="tab-group">
            <button
              onClick={() => setShowArchived(false)}
              className={`tab-btn ${!showArchived ? "active" : ""}`}
            >
              Active · {activeCount}
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`tab-btn tab-btn-archived ${showArchived ? "active" : ""}`}
            >
              Archived · {archivedCount}
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-card">
          <div className="empty-icon">{showArchived ? "🗂️" : "🎯"}</div>
          <div className="empty-title">
            {showArchived
              ? "Nothing archived"
              : habits.length === 0
              ? "No habits yet"
              : "No habits match your filter"}
          </div>
          <div className="empty-desc">
            {showArchived
              ? "Archived habits keep their history but stay out of your daily list."
              : habits.length === 0
              ? "Start small — something you can do in under 5 minutes."
              : "Try clearing your search or category filter."}
          </div>
          {!showArchived && habits.length === 0 && (
            <button
              className="btn-primary empty-btn"
              onClick={() => setFormOpen(true)}
            >
              <Plus size={14} />
              Create habit
            </button>
          )}
        </div>
      ) : (
        <div className="habits-list">
          {filtered.map((h) => {
            const keys = logsByHabit[h._id] || [];
            const { current, longest } = streakFromKeys(keys);
            return (
              <div
                key={h._id}
                className={`card habit-row ${h.isArchived ? "archived" : ""}`}
              >
                <div
                  className="habit-icon-container"
                  style={{ background: `${h.color}26`, color: h.color }}
                >
                  {h.icon}
                </div>

                <div className="habit-info">
                  <div className="habit-meta-row">
                    <div className="habit-name">{h.name}</div>
                    <span className="chip">{h.category}</span>
                    <span className="chip">{h.frequency}</span>
                    {h.isArchived && (
                      <span className="chip chip-archived">Archived</span>
                    )}
                  </div>
                  {h.description && (
                    <div className="habit-description">{h.description}</div>
                  )}
                </div>

                <div className="habit-stats-desktop">
                  <div className="habit-stat-item" title="Current streak">
                    <Flame
                      size={14}
                      className={current > 0 ? "streak-orange" : "streak-faint"}
                    />
                    <span className="font-medium">{current}</span>
                  </div>
                  <div className="habit-stat-item" title="Longest streak">
                    <Trophy size={14} className="streak-amber" />
                    <span className="font-medium">{longest}</span>
                  </div>
                  <div className="habit-stat-total">{keys.length} total</div>
                </div>

                <div className="habit-actions">
                  <button
                    className="btn-ghost p-2"
                    onClick={() => {
                      setEditing(h);
                      setFormOpen(true);
                    }}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn-ghost p-2"
                    onClick={() => archive(h)}
                    title={h.isArchived ? "Unarchive" : "Archive"}
                  >
                    {h.isArchived ? (
                      <ArchiveRestore size={16} />
                    ) : (
                      <Archive size={16} />
                    )}
                  </button>
                  <button
                    className="btn-ghost p-2 btn-delete"
                    onClick={() => setDeleteTarget(h)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit habit" : "New habit"}
      >
        <HabitForm
          initial={editing}
          submitting={submitting}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={save}
        />
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete habit?"
        maxWidth="max-w-sm"
      >
        <p className="delete-confirm-text">
          This will permanently delete <b>{deleteTarget?.name}</b> and all its
          history. This can't be undone.
        </p>
        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </button>
          <button
            className="btn-delete-confirm"
            onClick={() => remove(deleteTarget)}
          >
            Delete
          </button>
        </div>
      </Modal>

      <HabitSuggestionModal
        open={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        onAccept={acceptSuggestion}
      />
    </div>
  );
}
