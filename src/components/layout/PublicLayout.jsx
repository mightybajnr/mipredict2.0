import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

import useAuth from "../../hooks/useAuth.js";
import logo from "../../assets/logos/mipredict2.0_logo_nav.svg";

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  async function handleLogout() {
    await logout();
    closeMenu();
  }

  return (
    <div id="top" className="min-h-screen bg-pitch text-white">
      <header className="relative z-40 mx-auto w-full max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex min-w-0 items-center gap-2"
            aria-label="Mi Predict home"
          >
            <img
              src={logo}
              alt="Mi Predict logo"
              className="h-10 w-10 shrink-0 object-contain md:h-12"
            />
            <span className="font-display text-base font-bold tracking-tight sm:text-lg">
              Mi<span className="text-brand">Predict</span>
              <span className="ml-1 text-xs font-medium text-text-secondary">
                2.0
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-text-secondary transition hover:text-white"
            >
              Features
            </a>
            <a
              href="#coming-soon"
              className="text-sm font-medium text-text-secondary transition hover:text-white"
            >
              What&apos;s next
            </a>

            <div className="flex items-center gap-2 sm:gap-3">
              {user ? (
                <>
                  <Link
                    to="/app"
                    className="shrink-0 rounded-full bg-brand px-4 py-2 text-xs font-bold text-pitch transition hover:bg-brand-hover sm:px-5 sm:text-sm"
                  >
                    Open dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold transition hover:border-brand hover:text-brand sm:px-5 sm:text-sm"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold transition hover:border-brand hover:text-brand sm:px-5 sm:text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="shrink-0 rounded-full bg-brand px-4 py-2 text-xs font-bold text-pitch transition hover:bg-brand-hover sm:px-5 sm:text-sm"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white transition hover:border-brand hover:text-brand md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="public-nav"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <nav
            id="public-nav"
            className="absolute inset-x-0 top-full z-40 mx-5 mt-2 rounded-2xl border border-white/10 bg-surface p-3 shadow-2xl md:hidden"
          >
            <div className="flex flex-col">
              <a
                href="#features"
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-text-secondary transition hover:bg-white/5 hover:text-white"
              >
                Features
              </a>
              <a
                href="#coming-soon"
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-text-secondary transition hover:bg-white/5 hover:text-white"
              >
                What&apos;s next
              </a>
            </div>

            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              {user ? (
                <>
                  <Link
                    to="/app"
                    onClick={closeMenu}
                    className="rounded-xl bg-brand px-4 py-3 text-center text-sm font-bold text-pitch transition hover:bg-brand-hover"
                  >
                    Open dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold transition hover:border-brand hover:text-brand"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold transition hover:border-brand hover:text-brand"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-brand px-4 py-3 text-center text-sm font-bold text-pitch transition hover:bg-brand-hover"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-white/10 px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-display text-sm font-bold">
            Mi<span className="text-brand">Predict</span> 2.0
          </p>
          <p className="text-xs leading-5 text-text-secondary sm:text-sm">
            Built for the love of the game. © {new Date().getFullYear()} Mi
            Predict.
          </p>
        </div>
      </footer>
    </div>
  );
}
