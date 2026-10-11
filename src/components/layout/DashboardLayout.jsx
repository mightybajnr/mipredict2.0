import { useState } from "react";
import { Outlet } from "react-router-dom";

import MobileNav from "../navigation/MobileNav.jsx";
import Sidebar from "../navigation/Sidebar.jsx";
import Topbar from "../navigation/Topbar.jsx";

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-pitch text-text-primary">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />

        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
