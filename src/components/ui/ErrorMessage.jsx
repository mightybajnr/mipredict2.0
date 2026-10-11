import { AlertTriangle } from "lucide-react";
import Button from "./Button.jsx";

export default function ErrorMessage({
  message,
  onRetry,
  className = "",
}) {
  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger ${className}`}
    >
      <span className="flex items-center gap-2">
        <AlertTriangle size={16} className="shrink-0" />
        {message}
      </span>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
