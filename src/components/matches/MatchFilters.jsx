const FILTERS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "live", label: "Live" },
  { value: "finished", label: "Finished" },
  { value: "all", label: "All" },
];

export default function MatchFilters({ value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Match filters"
      className="inline-flex rounded-xl border border-white/10 bg-surface p-1"
    >
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          role="tab"
          aria-selected={value === filter.value}
          onClick={() => onChange(filter.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
            value === filter.value
              ? "bg-brand text-pitch"
              : "text-text-secondary hover:text-white"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}