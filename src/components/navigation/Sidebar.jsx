import { Link, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

import Avatar from "../ui/Avatar.jsx";
import useAuth from "../../hooks/useAuth.js";
import logo from "../../assets/logos/mipredict2.0_logo_nav.svg";
import { navItems } from "./navItems.js";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-surface lg:flex">
      <div className="flex items-center px-5 py-5">
        <Link
          to="/app"
          className="flex min-w-0 items-center gap-2"
          aria-label="Mi Predict home"
        >
          <img
            src={logo}
            alt="Mi Predict logo"
            className="h-9 w-auto shrink-0 object-contain"
          />
          <span className="truncate font-display text-base font-bold tracking-tight">
            Mi<span className="text-brand">Predict</span>
            <span className="ml-1 text-[10px] font-medium text-text-secondary">
              2.0
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "text-text-secondary hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{item.label}</span>
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
            <p className="truncate text-xs text-text-secondary">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={18} className="shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
