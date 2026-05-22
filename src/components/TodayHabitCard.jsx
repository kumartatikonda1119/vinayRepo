import { Check, Flame, Pencil, Trash2, Archive } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./TodayHabitCard.css";

export default function TodayHabitCard({
  habit,
  completed,
  onToggle,
  streak = 0,
  onEdit,
  onDelete,
  onArchive,
}) {
  const [menu, setMenu] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuWidth = 160; // matches w-40
  const menuHeight = 132; // approx for 3 items

  useLayoutEffect(() => {
    if (!menu || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const flipUp = rect.bottom + menuHeight + 8 > window.innerHeight;
    setPos({
      top: flipUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: rect.right - menuWidth,
    });
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menu]);

  return (
    <div
      className={`card habit-card ${completed ? "completed" : ""}`}
    >
      <div
        className="habit-icon"
        style={{ background: `${habit.color}26`, color: habit.color }}
      >
        {habit.icon}
      </div>

      <div className="flex-1-min-w-0">
        <div className="flex-items-center-gap-2">
          <div className="font-medium-truncate">{habit.name}</div>
          <span className="chip">{habit.category}</span>
        </div>
        {habit.description && (
          <div className="habit-desc">
            {habit.description}
          </div>
        )}
      </div>

      <div className="streak-container">
        <Flame
          size={16}
          className={streak > 0 ? "streak-icon-active" : "streak-icon-inactive"}
        />
        <span className="font-semibold">{streak}</span>
      </div>

      <div className="relative">
        <button
          ref={triggerRef}
          className="btn-ghost modal-close-btn"
          onClick={() => setMenu((m) => !m)}
          aria-label="Habit options"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="13" cy="8" r="1.5" />
          </svg>
        </button>

        {menu &&
          createPortal(
            <>
              <div
                className="portal-overlay"
                onClick={() => setMenu(false)}
              />
              <div
                className="portal-menu glass-strong animate-fade-in"
                style={{ top: pos.top, left: pos.left }}
              >
                <button
                  className="menu-item"
                  onClick={() => {
                    setMenu(false);
                    onEdit();
                  }}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="menu-item"
                  onClick={() => {
                    setMenu(false);
                    onArchive();
                  }}
                >
                  <Archive size={14} />
                  {habit.isArchived ? "Unarchive" : "Archive"}
                </button>
                <button
                  className="menu-item-danger"
                  onClick={() => {
                    setMenu(false);
                    onDelete();
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>,
            document.body
          )}
      </div>

      <button
        onClick={onToggle}
        className={`toggle-btn ${completed ? "completed animate-pop" : "incomplete"}`}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
      >
        <Check size={20} strokeWidth={3} />
      </button>
    </div>
  );
}
