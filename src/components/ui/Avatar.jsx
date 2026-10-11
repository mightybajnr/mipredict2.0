import { getInitials } from "../../utils/initials.js";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

export default function Avatar({ name = "", size = "md", className = "" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-brand/20 bg-brand/10 font-display font-bold text-brand ${
        SIZES[size] ?? SIZES.md
      } ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}