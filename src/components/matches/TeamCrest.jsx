import { getInitials } from "../../utils/initials.js";

export default function TeamCrest({ name, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 sm:h-16 sm:w-16 ${className}`}
    >
      <span className="font-display text-lg font-bold sm:text-2xl">
        {getInitials(name)}
      </span>
    </span>
  );
}
