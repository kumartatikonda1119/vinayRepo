import { weekKeys } from "../utils/dateHelpers.js";
import { Check } from "lucide-react";
import "./WeeklyGrid.css";

export default function WeeklyGrid({ habits, logsByHabit, days: customDays }) {
  const days = customDays || weekKeys();
  const todayKey = new Date().toISOString().slice(0, 10);

  if (!habits.length) {
    return (
      <div className="card grid-empty-card">
        Create a habit to see your weekly grid.
      </div>
    );
  }

  return (
    <div className="card grid-card">
      <div className="grid-min-width">
        <div className="weekly-row-layout weekly-header-row">
          <div className="weekly-header-title">
            Habit
          </div>
          {days.map((d) => (
            <div
              key={d.key}
              className={`day-header ${d.key === todayKey ? "today" : "other"}`}
            >
              <div>{d.label}</div>
              <div className="text-faint">{d.short}</div>
            </div>
          ))}
        </div>

        {habits.map((h) => {
          const done = new Set(logsByHabit[h._id] || []);
          return (
            <div
              key={h._id}
              className="weekly-row-layout weekly-habit-row divider"
            >
              <div className="weekly-habit-info">
                <span
                  className="weekly-habit-icon"
                  style={{ background: `${h.color}26`, color: h.color }}
                >
                  {h.icon}
                </span>
                <span className="weekly-habit-name">{h.name}</span>
              </div>
              {days.map((d) => {
                const isDone = done.has(d.key);
                const future = d.key > todayKey;
                return (
                  <div key={d.key} className="weekly-cell-container">
                    <div
                      className={`weekly-cell ${
                        isDone
                          ? "done"
                          : future
                          ? "future"
                          : "empty"
                      }`}
                      style={
                        isDone
                          ? { background: h.color, boxShadow: `0 4px 12px ${h.color}55` }
                          : { background: "var(--chip-bg)" }
                      }
                    >
                      {isDone && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
