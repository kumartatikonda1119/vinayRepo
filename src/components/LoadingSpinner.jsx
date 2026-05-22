import "./LoadingSpinner.css";

export default function LoadingSpinner({ full = false, size = 24 }) {
  const spinner = (
    <div
      className="spinner"
      style={{ width: size, height: size }}
    />
  );
  if (!full) return spinner;
  return (
    <div className="spinner-full-container">
      {spinner}
    </div>
  );
}
