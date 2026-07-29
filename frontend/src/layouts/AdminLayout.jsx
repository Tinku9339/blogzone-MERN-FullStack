import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  MessageSquare,
  UserCircle,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { initials } from "../utils/constants.js";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/blogs", label: "Posts", icon: Newspaper },
  { to: "/dashboard/comments", label: "Comments", icon: MessageSquare },
  { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row">
      <aside className="lg:w-56 lg:flex-shrink-0">
        <div className="lg:sticky lg:top-24">
          <Link to="/" className="mb-8 hidden items-center gap-2 lg:flex">
            <span className="font-display text-xl font-semibold text-paper">
              Blog<span className="text-brass">Zone</span>
            </span>
          </Link>

          <div className="mb-6 flex items-center gap-3 rounded-sm border border-paper-line/12 bg-canvas-panel p-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas-raised font-mono text-xs text-brass">
              {initials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-paper">
                {user?.name}
              </p>
              <p className="truncate font-mono text-[11px] text-muted">
                {user?.email}
              </p>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-shrink-0 items-center gap-2.5 whitespace-nowrap rounded-sm px-3.5 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-canvas-raised text-brass"
                      : "text-muted hover:bg-canvas-panel hover:text-paper"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={toggleTheme}
            className="mt-4 flex w-full items-center gap-2.5 rounded-sm px-3.5 py-2.5 text-left text-sm text-muted transition-colors hover:bg-canvas-panel hover:text-brass"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            Switch to {theme === "dark" ? "daylight" : "dark"}
          </button>
          <div className="mt-6 hidden flex-col gap-1 border-t border-paper-line/10 pt-4 lg:flex">
            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-sm px-3.5 py-2.5 text-sm text-muted hover:bg-canvas-panel hover:text-paper"
            >
              <ExternalLink className="h-4 w-4" />
              View site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2.5 rounded-sm px-3.5 py-2.5 text-left text-sm text-muted hover:bg-canvas-panel hover:text-rust"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
