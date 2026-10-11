const VARIANTS = {
  brand: "border-brand/25 bg-brand/10 text-brand",
  neutral: "border-white/10 bg-white/5 text-text-secondary",
  success: "border-success/30 bg-success/10 text-success",
  danger: "border-danger/30 bg-danger/10 text-danger",
  warning: "border-warning/30 bg-warning/10 text-warning",
};

export default function Badge({
  variant = "neutral",
  className = "",
  children,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        VARIANTS[variant] ?? VARIANTS.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
}