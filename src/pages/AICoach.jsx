import { useState, useEffect, useRef, useMemo } from "react";
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
    <div className="animate-fade-in flex flex-col" style={{ height: "calc(100vh - 6rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">AI Coach</h1>
            <p className="text-xs text-muted">Your personal habit & fitness assistant</p>
          </div>
        </div>
        <button className="p-2 rounded-lg text-soft hover:bg-[var(--surface-hover)] transition">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Stats Ribbon */}
      {!statsLoading && stats && (
        <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
          <div className="chip gap-2 whitespace-nowrap">
            <Flame size={13} className="text-orange-400" />
            <span>{stats.activeStreak}-day streak active</span>
          </div>
          <div className="chip gap-2 whitespace-nowrap">
            <TrendingUp size={13} className="text-emerald-400" />
            <span>{stats.weeklyRate}% this week</span>
          </div>
          <div className="chip gap-2 whitespace-nowrap">
            <Target size={13} className="text-brand-400" />
            <span>{stats.habitsTracked} habits tracked</span>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="card flex-1 flex flex-col overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              } chat-bubble-enter`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-md shadow-brand-500/30 mr-2 mt-1 shrink-0">
                  <Sparkles size={14} />
                </div>
              )}
              <div className="max-w-[80%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white rounded-br-md shadow-md shadow-brand-500/30"
                      : "glass rounded-bl-md"
                  }`}
                >
                  {m.role === "user" ? (
                    m.content
                  ) : (
                    <Markdown>{m.content}</Markdown>
                  )}
                </div>
                {/* Quick reply chips */}
                {m.role === "assistant" && m.chips && i === messages.length - 1 && !loading && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.chips.map((chip, ci) => (
                      <button
                        key={ci}
                        onClick={() => send(chip)}
                        className="text-xs rounded-full px-3 py-1.5 border transition hover:scale-[1.03] active:scale-[0.97]"
                        style={{
                          borderColor: "var(--surface-border)",
                          background: "var(--surface)",
                          color: "var(--text-soft)",
                        }}
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
            <div className="flex justify-start chat-bubble-enter">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-md shadow-brand-500/30 mr-2 mt-1 shrink-0">
                <Sparkles size={14} />
              </div>
              <div className="glass rounded-2xl rounded-bl-md px-4 py-3 text-sm text-soft flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0s" }}></span>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                </div>
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* User info + Input area */}
        <div className="border-t divider">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white font-semibold text-sm flex items-center justify-center shrink-0 shadow-md shadow-brand-500/30">
              {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0 text-xs text-faint truncate hidden sm:block" style={{ maxWidth: "80px" }}>
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
