import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    type = "text",
    id,
    className = "",
    revealable = false,
    ...props
  },
  ref
) {
  const inputId = id || props.name || props["aria-label"];
  const [revealed, setRevealed] = useState(false);

  const showToggle = revealable && type === "password";
  const resolvedType = showToggle && revealed ? "text" : type;

  return (
    <div className="min-w-0">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full rounded-xl border bg-pitch px-4 py-3 text-white outline-none transition placeholder:text-text-secondary/60 focus:border-brand ${
            showToggle ? "pr-12" : ""
          } ${
            error
              ? "border-danger/60 focus:border-danger"
              : "border-white/10 focus:border-brand/70"
          } ${className}`}
          {...props}
        />

        {showToggle && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-text-secondary transition hover:text-brand focus-visible:text-brand focus-visible:outline-none"
          >
            {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1.5 text-xs text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;