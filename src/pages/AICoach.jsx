import { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  RefreshCw,
  Flame,
  TrendingUp,
  Target,
  MoreHorizontal,
  Zap,
} from "lucide-react";
import api from "../api/axios.js";
import Markdown from "../components/Markdown.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./AICoach.css";

const QUICK_REPLIES = [
  "Why do I skip evening habits?",
  "Suggest a morning habit",
  "Improve my streak",
  "Best sleep habits",
  "What's a good workout for beginners?",
  "How to stay motivated?",
];

export default function AICoach() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Load stats and initial greeting
  useEffect(() => {
    const init = async () => {
      setStatsLoading(true);
      try {
        const res = await api.get("/ai/coach-init");
        setStats(res.data);
        setMessages([
          {
            role: "assistant",
            content: res.data.greeting,
            chips: QUICK_REPLIES.slice(0, 4),
          },
        ]);
      } catch {
        setMessages([
          {
            role: "assistant",
            content:
              "Hey! I'm your AI habit coach. Ask me anything about your habits, fitness, or routines.",
            chips: QUICK_REPLIES.slice(0, 4),
          },
        ]);
      } finally {
        setStatsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await api.post("/ai/chat", { question: q });
      // Determine which chips to show based on the response
      const responseChips = getContextualChips(q);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: res.data.content, chips: responseChips },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that right now. Try again!",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const getContextualChips = (question) => {
    const q = question.toLowerCase();
    if (q.includes("streak") || q.includes("skip"))
      return ["How to build consistency?", "Suggest a morning habit", "Best recovery tips"];
    if (q.includes("workout") || q.includes("fitness") || q.includes("exercise"))
      return ["Beginner workout plan", "How often should I exercise?", "Best post-workout habits"];
    if (q.includes("sleep") || q.includes("evening"))
      return ["Optimal sleep schedule", "Wind-down routine ideas", "Why do I skip evening habits?"];
    if (q.includes("morning") || q.includes("habit"))
      return ["Top 5 morning habits", "How to stack habits", "Improve my streak"];
    return QUICK_REPLIES.slice(2, 5);
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="coach-container animate-fade-in">
      {/* Header */}
      <div className="coach-header">
        <div className="coach-header-left">
          <div className="coach-avatar-ai">
            <Sparkles size={20} />
          </div>
          <div>
            <h1>AI Coach</h1>
            <p>Your personal habit & fitness assistant</p>
          </div>
        </div>
        <button className="btn-more-options">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Stats Ribbon */}
      {!statsLoading && stats && (
        <div className="stats-ribbon">
          <div className="chip stats-chip">
            <Flame size={13} className="text-orange" />
            <span>{stats.activeStreak}-day streak active</span>
          </div>
          <div className="chip stats-chip">
            <TrendingUp size={13} className="text-emerald" />
            <span>{stats.weeklyRate}% this week</span>
          </div>
          <div className="chip stats-chip">
            <Target size={13} className="text-amber" />
            <span>{stats.habitsTracked} habits tracked</span>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="card chat-workspace">
        <div ref={scrollRef} className="messages-list">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`message-row ${m.role === "user" ? "user" : "assistant"} chat-bubble-enter`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {m.role === "assistant" && (
                <div className="assistant-icon-badge">
                  <Sparkles size={14} />
                </div>
              )}
              <div className="message-payload">
                <div className={`chat-bubble ${m.role === "user" ? "user" : "glass assistant"}`}>
                  {m.role === "user" ? (
                    m.content
                  ) : (
                    <Markdown>{m.content}</Markdown>
                  )}
                </div>
                {/* Quick reply chips */}
                {m.role === "assistant" && m.chips && i === messages.length - 1 && !loading && (
                  <div className="quick-replies-container">
                    {m.chips.map((chip, ci) => (
                      <button
                        key={ci}
                        onClick={() => send(chip)}
                        className="quick-reply-btn"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row assistant chat-bubble-enter">
              <div className="assistant-icon-badge">
                <Sparkles size={14} />
              </div>
              <div className="glass chat-thinking-bubble">
                <div className="thinking-dots">
                  <span className="thinking-dot"></span>
                  <span className="thinking-dot"></span>
                  <span className="thinking-dot"></span>
                </div>
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* User info + Input area */}
        <div className="input-area-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="input-form"
          >
            <div className="user-avatar-circle">
              {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="user-name-label">
              {firstName}
            </div>
            <input
              ref={inputRef}
              className="input flex-1"
              placeholder="Ask your AI coach anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary px-3"
              disabled={loading || !input.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
