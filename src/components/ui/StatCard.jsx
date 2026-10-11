export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium uppercase tracking-wider text-text-secondary">
          {label}
        </span>
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Icon size={17} />
          </span>
        )}
      </div>

      <p className="mt-3 font-display text-2xl font-bold sm:text-3xl">{value}</p>

      {hint && (
        <p className="mt-1 text-xs text-text-secondary">{hint}</p>
      )}
    </div>
  );
}
