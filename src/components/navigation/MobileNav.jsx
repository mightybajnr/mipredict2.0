import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, X } from "lucide-react";

import Avatar from "../ui/Avatar.jsx";
import useAuth from "../../hooks/useAuth.js";
import { navItems } from "./navItems.js";

export default function MobileNav({ open, onClose }) {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!open) return undefined;

    function handleKey(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60"
      />

      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-white/10 bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <span className="font-display text-base font-bold">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white transition hover:border-brand hover:text-brand"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-text-secondary hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <Avatar name={user?.name || user?.email} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {user?.name || "Player"}
              </p>
              <p className="truncate text-xs text-text-secondary">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-danger/10 hover:text-danger"
          >
            <LogOut size={18} className="shrink-0" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
