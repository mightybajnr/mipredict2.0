import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, Search, UserRound } from "lucide-react";

import Avatar from "../ui/Avatar.jsx";
import useAuth from "../../hooks/useAuth.js";
import logo from "../../assets/logos/mipredict2.0_logo_nav.svg";

export default function Topbar({ onOpenMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointer(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKey(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  function handleSearch(event) {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/matches?q=${encodeURIComponent(term)}` : "/matches");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-pitch/85 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white transition hover:border-brand hover:text-brand lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <Link
          to="/app"
          className="flex min-w-0 items-center gap-2 lg:hidden"
          aria-label="Mi Predict home"
        >
          <img
            src={logo}
            alt="Mi Predict logo"
            className="h-8 w-auto shrink-0 object-contain"
          />
          <span className="truncate font-display text-base font-bold tracking-tight">
            Mi<span className="text-brand">Predict</span>
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="ml-auto hidden flex-1 justify-end md:flex"
        >
          <div className="relative w-full max-w-md">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search teams, competitions or matches"
              aria-label="Search matches"
              className="w-full rounded-xl border border-white/10 bg-surface py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-text-secondary/60 focus:border-brand/70"
            />
          </div>
        </form>

        <div className="relative ml-auto hidden lg:block" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-3 transition hover:border-brand/40"
          >
            <Avatar name={user?.name || user?.email} size="sm" />
            <span className="max-w-32 truncate text-sm font-semibold">
              {user?.name || "Player"}
            </span>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-surface p-1 shadow-2xl"
            >
              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold">
                  {user?.name || "Player"}
                </p>
                <p className="truncate text-xs text-text-secondary">
                  {user?.email}
                </p>
              </div>

              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-white/5 hover:text-white"
              >
                <UserRound size={16} />
                Profile
              </Link>

              <button
                type="button"
                role="menuitem"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-danger/10 hover:text-danger"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
