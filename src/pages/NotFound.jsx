import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pitch px-5 text-center text-white">
      <p className="font-display text-7xl font-bold text-brand">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist yet.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-bold text-pitch transition hover:bg-brand-hover"
      >
        Back to home
      </Link>
    </div>
  );
}