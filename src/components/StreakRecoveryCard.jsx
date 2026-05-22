import { useState } from "react";
import { Heart, RefreshCw, X } from "lucide-react";
import api from "../api/axios.js";
import Markdown from "./Markdown.jsx";
import "./StreakRecoveryCard.css";

export default function StreakRecoveryCard({ habit, onDismiss }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/recovery-plan", { habitId: habit._id });
      setContent(res.data.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-2xl streak-recovery-container glass animate-slide-up">
      <div
        className="streak-recovery-bg"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(244,114,182,0.22), transparent 55%), radial-gradient(circle at 100% 100%, rgba(239,68,68,0.15), transparent 55%)",
        }}
      />
      <button
        onClick={onDismiss}
        className="streak-recovery-dismiss"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>

      <div className="streak-recovery-content">
        <div className="streak-recovery-icon">
          <Heart size={18} />
        </div>
        <div className="streak-recovery-body">
          <div className="streak-recovery-title">
            Streak paused · {habit.name}
          </div>
          <div className="streak-recovery-subtitle">
            You had a great run. Broken streaks are part of the journey — let's
            get back on track.
          </div>

          {!content ? (
            <button
              className="mt-3 btn-primary"
              onClick={generate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Building your plan...
                </>
              ) : (
                "Get back on track"
              )}
            </button>
          ) : (
            <Markdown className="streak-recovery-markdown glass rounded-xl">
              {content}
            </Markdown>
          )}
        </div>
      </div>
    </div>
  );
}
