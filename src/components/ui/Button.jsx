import Loader from "./Loader.jsx";

const VARIANTS = {
  primary:
    "bg-brand font-bold text-pitch hover:bg-brand-hover",
  outline:
    "border border-white/15 font-semibold text-white hover:border-brand/50 hover:text-brand",
  ghost: "font-semibold text-text-secondary hover:text-white",
};

const SIZES = {
  sm: "min-h-10 px-4 py-2 text-xs sm:text-sm",
  md: "min-h-12 px-6 py-3 text-sm sm:text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  type = "button",
  disabled,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader className="h-4 w-4" />}
      {children}
    </button>
  );
}