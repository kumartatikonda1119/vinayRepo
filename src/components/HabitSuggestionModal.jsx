import { useState } from "react";
import { Sparkles, Check, RefreshCw } from "lucide-react";
import Modal from "./Modal.jsx";
import api from "../api/axios.js";
import "./HabitSuggestionModal.css";

export default function HabitSuggestionModal({ open, onClose, onAccept }) {
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState("");
  const [productiveTime, setProductiveTime] = useState("");
  const [struggles, setStruggles] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState({});

  const reset = () => {
    setStep(0);
    setGoals("");
    setProductiveTime("");
    setStruggles("");
    setSuggestions([]);
    setAdded({});
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/suggest-habits", {
        goals,
        productiveTime,
        struggles,
      });
      setSuggestions(res.data.suggestions || []);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const accept = async (s, idx) => {
    await onAccept(s);
    setAdded((a) => ({ ...a, [idx]: true }));
  };

  return (
    <Modal open={open} onClose={close} title="AI Habit Suggestions" maxWidth="max-w-xl">
      {step === 0 && (
        <div className="suggestion-step-container">
          <div className="suggestion-desc">
            Answer 3 quick questions and I'll suggest 3 personalised habits.
          </div>
          <div>
            <label className="label">What are your goals right now?</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="e.g. Get fitter, read more, reduce phone time..."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              autoFocus
            />
          </div>
          <div className="suggestion-actions end">
            <button className="btn-secondary" onClick={close}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={() => setStep(1)}
              disabled={!goals.trim()}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="suggestion-step-container">
          <div>
            <label className="label">
              When are you most productive during the day?
            </label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="e.g. Early morning, late evenings..."
              value={productiveTime}
              onChange={(e) => setProductiveTime(e.target.value)}
              autoFocus
            />
          </div>
          <div className="suggestion-actions between">
            <button className="btn-ghost" onClick={() => setStep(0)}>
              Back
            </button>
            <button
              className="btn-primary"
              onClick={() => setStep(2)}
              disabled={!productiveTime.trim()}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="suggestion-step-container">
          <div>
            <label className="label">What habits have you struggled with?</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="e.g. Gym in the morning, journaling at night..."
              value={struggles}
              onChange={(e) => setStruggles(e.target.value)}
              autoFocus
            />
          </div>
          <div className="suggestion-actions between">
            <button className="btn-ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn-primary"
              onClick={submit}
              disabled={loading || !struggles.trim()}
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Get suggestions
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="suggestion-step-container compact">
          {suggestions.length === 0 && (
            <div className="text-sm text-muted">
              No suggestions returned. Try again.
            </div>
          )}
          {suggestions.map((s, i) => (
            <div key={i} className="suggestion-card glass">
              <div className="suggestion-card-header">
                <span className="suggestion-card-icon">{s.icon}</span>
                <div className="suggestion-card-name">{s.name}</div>
                <span className="chip">{s.category}</span>
                <span className="chip">{s.frequency}</span>
              </div>
              <div className="suggestion-card-desc">{s.description}</div>
              {s.reason && (
                <div className="suggestion-card-reason">
                  Why: {s.reason}
                </div>
              )}
              <div className="suggestion-card-footer">
                {added[i] ? (
                  <div className="suggestion-added-badge">
                    <Check size={14} />
                    Added
                  </div>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => accept(s, i)}
                  >
                    Add this habit
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="suggestion-actions end">
            <button className="btn-secondary" onClick={close}>
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
