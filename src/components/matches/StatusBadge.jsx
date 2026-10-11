import Badge from "../ui/Badge.jsx";
import { STATUS_VARIANTS } from "../../utils/matchStatus.js";

export default function StatusBadge({ status, className = "" }) {
  if (status === "live") {
    return (
      <Badge variant="danger" className={className}>
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
        </span>
        Live
      </Badge>
    );
  }

  return (
    <Badge variant={STATUS_VARIANTS[status]} className={className}>
      {status}
    </Badge>
  );
}
