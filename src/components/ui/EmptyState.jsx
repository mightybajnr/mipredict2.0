export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center ${className}`}
    >
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon size={22} />
        </span>
      )}

      {title && (
        <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
      )}

      {description && (
        <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
