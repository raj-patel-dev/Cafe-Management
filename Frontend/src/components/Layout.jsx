import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  HomeIcon,
  FolderIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CircleStackIcon,
  ArrowLeftOnRectangleIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon, roles: ["admin", "staff"] },
    { name: "Orders", path: "/orders", icon: ClipboardDocumentListIcon, roles: ["admin", "staff"] },
    { name: "Products", path: "/products", icon: ShoppingBagIcon, roles: ["admin", "staff"] },
    { name: "Categories", path: "/categories", icon: FolderIcon, roles: ["admin", "staff"] },
    { name: "Inventory", path: "/inventory", icon: CircleStackIcon, roles: ["admin", "staff"] },
  ];

  // Filter items by role (if needed, but they are all viewable by staff too, which is very nice)
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || "staff")
  );

  return (
    <div className="min-h-screen bg-[#090807] text-neutral-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-[#131110] border-b border-amber-950/20 px-6 py-4 z-25">
        <div className="flex items-center gap-3">
          <span className="text-2xl">☕</span>
          <span className="font-serif font-bold text-amber-50">Bean &amp; Brew</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-neutral-400 hover:text-amber-400 p-1"
        >
          {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex z-30 w-64 flex-col bg-[#110f0e] border-r border-amber-950/20 transition-transform duration-300 ease-in-out`}
      >
        {/* Brand logo */}
        <div className="hidden md:flex items-center gap-3 px-6 py-8 border-b border-amber-950/10">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/10">
            <span className="text-xl text-neutral-900 font-bold">☕</span>
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-amber-50 leading-none">Bean &amp; Brew</h1>
            <span className="text-[10px] text-amber-200/40 uppercase tracking-widest font-semibold mt-1 block">Cafe Management</span>
          </div>
        </div>

        {/* User Card */}
        <div className="px-6 py-6 border-b border-amber-950/10">
          <div className="flex items-center gap-3.5 bg-[#171513]/60 p-3.5 rounded-2xl border border-amber-900/10">
            <div className="w-10 h-10 bg-amber-950/50 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-medium text-neutral-200 text-sm truncate">{user?.name || "Staff User"}</h4>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 ${
                isAdmin ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-neutral-800 text-neutral-400"
              }`}>
                {user?.role || "Staff"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-600/15 to-amber-500/5 text-amber-400 border-l-2 border-amber-500 font-semibold"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-[#181614]/50"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-amber-450" : "text-neutral-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom logout action */}
        <div className="p-4 border-t border-amber-950/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-950/15 transition-all duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 bg-[#090807] border-b border-amber-950/10">
          <div>
            <h2 className="text-xl font-bold text-amber-50 font-serif">
              {navItems.find((n) => n.path === location.pathname)?.name || "Cafe Workspace"}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">Manage your cafe operations smoothly</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span>📅 {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
