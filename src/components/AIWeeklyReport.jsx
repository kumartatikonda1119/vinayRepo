import { useState } from "react";
import { Sparkles, ChevronDown, RefreshCw } from "lucide-react";
import api from "../api/axios.js";
import Markdown from "./Markdown.jsx";
import "./AIWeeklyReport.css";

export default function AIWeeklyReport() {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedAt, setGeneratedAt] = useState(null);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/weekly-report");
      setContent(res.data.content);
      setGeneratedAt(new Date());
      setExpanded(true);
    } catch (e) {
      setContent("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card weekly-report-container relative overflow-hidden">
      <div
        className="weekly-report-bg"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.25), transparent 60%)",
        }}
      />
      <button
        onClick={() => setExpanded((e) => !e)}
        className="weekly-report-header"
      >
        <div className="weekly-report-icon-container">
          <Sparkles size={18} />
        </div>
        <div className="weekly-report-info">
          <div className="weekly-report-title">AI Weekly Report</div>
          <div className="weekly-report-subtitle">
            {content
              ? `Generated ${generatedAt ? generatedAt.toLocaleTimeString() : "now"}`
              : "See patterns and personalised encouragement from the past 7 days"}
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`weekly-report-chevron ${expanded ? "expanded" : ""}`}
        />
      </button>

      {expanded && (
        <div className="weekly-report-content animate-slide-up">
          {!content && (
            <button
              onClick={generate}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Analysing your week...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Generate weekly report
                </>
              )}
            </button>
          )}

          {content && (
            <>
              <Markdown className="weekly-report-markdown glass rounded-xl">
                {content}
              </Markdown>
              <div className="weekly-report-footer">
                <button
                  onClick={generate}
                  disabled={loading}
                  className="btn-ghost"
                >
                  <RefreshCw
                    size={14}
                    className={loading ? "animate-spin" : ""}
                  />
                  Regenerate
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

