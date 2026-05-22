import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Sparkles, RefreshCw } from "lucide-react";
import api from "../api/axios.js";
import Markdown from "./Markdown.jsx";
import "./AIChat.css";

const SAMPLES = [
  "Which day of the week am I most consistent?",
  "What is my best performing category?",
  "Why do I keep failing my exercise habit?",
];

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi — ask me anything about your habit data. Try one of the examples below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, open]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await api.post("/ai/chat", { question: q });
      setMessages((m) => [
        ...m,
        { role: "assistant", content: res.data.content },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I couldn't answer that right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="chat-trigger-btn"
        aria-label="AI Chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="chat-window glass-strong animate-slide-up">
          <div className="chat-header divider">
            <div className="chat-header-logo">
              <Sparkles size={14} />
            </div>
            <div>
              <div className="chat-header-title">Habit Analysis</div>
              <div className="chat-header-subtitle">AI-powered insights</div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="chat-messages"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-row ${m.role === "user" ? "user" : "assistant"}`}
              >
                <div
                  className={`chat-bubble ${m.role === "user" ? "user" : "glass assistant"}`}
                >
                  {m.role === "user" ? m.content : <Markdown>{m.content}</Markdown>}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-row assistant">
                <div className="chat-thinking glass">
                  <RefreshCw size={12} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="samples-container">
                {SAMPLES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className="sample-btn glass"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="chat-form divider"
          >
            <input
              className="input"
              placeholder="Ask about your habits..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary send-btn"
              disabled={loading}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
