import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "../context/ThemeContext.jsx";
import "./CategoryPieChart.css";

const COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

export default function CategoryPieChart({ data }) {
  const { theme } = useTheme();
  return (
    <div className="card chart-card">
      <div className="chart-title">Completions by category</div>
      {!data?.length ? (
        <div className="chart-empty-message">No data yet.</div>
      ) : (
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                stroke={theme === "dark" ? "rgba(255,255,255,0.06)" : "#ffffff"}
                strokeWidth={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background:
                    theme === "dark" ? "rgba(20,20,36,0.95)" : "rgba(255,255,255,0.95)",
                  border: `1px solid ${
                    theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(15,15,27,0.08)"
                  }`,
                  borderRadius: 12,
                  fontSize: 12,
                  color: theme === "dark" ? "#ebebf5" : "#13131b",
                  backdropFilter: "blur(12px)",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  color: theme === "dark" ? "#b8b8c8" : "#4e4e59",
                }}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
