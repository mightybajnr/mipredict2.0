import miPredictLogo from "../../assets/logos/mipredict2.0_logo_nav.svg";

export default function BrandLoader({ label = "Loading the pitch" }) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-pitch text-white">
      {/* Ambient glow field */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl motion-reduce:animate-none animate-brand-glow" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-brand/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-brand/5 blur-3xl" />

      {/* Faint pitch markings */}
      <div className="pointer-events-none absolute inset-8 rounded-[2rem] border border-white/5 sm:inset-16" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

      <div className="relative flex flex-col items-center px-6">
        {/* Logo halo + ring */}
        <div className="relative flex h-44 w-44 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-white/10" />
          <span className="absolute inset-4 rounded-full border border-brand/10" />

          <span
            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand border-r-brand/40 motion-reduce:animate-none"
            style={{ animationDuration: "1.6s" }}
          />

          <span className="absolute inset-10 rounded-full bg-brand/10 blur-xl motion-reduce:animate-none animate-brand-glow" />

          <img
            src={miPredictLogo}
            alt="Mi Predict"
            className="relative h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(184,255,59,0.45)] motion-reduce:animate-none animate-brand-float"
          />
        </div>

        {/* Wordmark */}
        <div className="mt-8 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Mi<span className="text-brand">Predict</span>
          <span className="ml-1 align-middle text-xs font-medium text-text-secondary">
            2.0
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-1/3 rounded-full bg-brand motion-reduce:animate-none animate-loading-bar" />
        </div>

        {/* Status label */}
        <p className="mt-4 flex items-center gap-0.5 text-sm text-text-secondary">
          {label}
          <span aria-hidden="true" className="inline-flex">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: "0.15s" }}>
              .
            </span>
            <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>
              .
            </span>
          </span>
        </p>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {label}
      </span>
    </div>
  );
}