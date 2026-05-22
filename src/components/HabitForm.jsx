import { useState } from "react";
import { CATEGORIES, COLORS, ICONS } from "../utils/constants.js";
import "./HabitForm.css";

export default function HabitForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    category: initial?.category || "Health",
    frequency: initial?.frequency || "daily",
    targetDays: initial?.targetDays || 7,
    color: initial?.color || COLORS[0],
    icon: initial?.icon || ICONS[0],
  });

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target ? e.target.value : e,
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      ...form,
      targetDays: Number(form.targetDays),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <label className="label">Habit name</label>
        <input
          className="input"
          placeholder="e.g. Drink 2L of water"
          value={form.name}
          onChange={set("name")}
          autoFocus
          required
        />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          className="input resize-none"
          rows={2}
          placeholder="Why does this habit matter to you?"
          value={form.description}
          onChange={set("description")}
        />
      </div>

      <div className="form-grid-2">
        <div>
          <label className="label">Category</label>
          <select
            className="input"
            value={form.category}
            onChange={set("category")}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Frequency</label>
          <select
            className="input"
            value={form.frequency}
            onChange={set("frequency")}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">
          Target days per week:{" "}
          <span className="font-semibold">{form.targetDays}</span>
        </label>
        <input
          type="range"
          min={1}
          max={7}
          value={form.targetDays}
          onChange={set("targetDays")}
          className="range-input"
        />
      </div>

      <div>
        <label className="label">Icon</label>
        <div className="flex-wrap-gap-2">
          {ICONS.map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => set("icon")(i)}
              className={`icon-btn ${form.icon === i ? "selected" : "unselected"}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Color</label>
        <div className="flex-gap-2">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => set("color")(c)}
              className={`color-btn ${form.color === c ? "selected" : ""}`}
              style={{ background: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : initial ? "Save changes" : "Create habit"}
        </button>
      </div>
    </form>
  );
}
