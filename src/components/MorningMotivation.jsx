import { useEffect, useState } from "react";
import { Sun, X } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Markdown from "./Markdown.jsx";
import "./MorningMotivation.css";

export default function MorningMotivation() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.morningMotivation) return;
    const today = new Date().toISOString().slice(0, 10);
    const seen = localStorage.getItem("morning-seen");
    if (seen === today) return;
    setLoading(true);
    api
      .get("/ai/morning")
      .then((res) => {
        setContent(res.data.content);
        localStorage.setItem("morning-seen", today);
      })
      .finally(() => setLoading(false));
  }, [user?.morningMotivation]);

  if (!user?.morningMotivation || dismissed || (!content && !loading))
    return null;

  return (
    <div className="relative rounded-2xl morning-motivation-container glass animate-slide-up">
      <div
        className="morning-motivation-bg"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(251,191,36,0.25), transparent 55%), radial-gradient(circle at 100% 100%, rgba(99,102,241,0.18), transparent 55%)",
        }}
      />
      <button
        onClick={() => setDismissed(true)}
        className="morning-motivation-dismiss"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
      <div className="morning-motivation-content">
        <div className="morning-motivation-icon animate-float">
          <Sun size={20} />
        </div>
        <div>
          <div className="morning-motivation-greeting">
            Good morning, {user.name?.split(" ")[0]}
          </div>
          <div className="morning-motivation-body">
            {loading ? (
              "Thinking of something nice to say..."
            ) : (
              <Markdown>{content}</Markdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
