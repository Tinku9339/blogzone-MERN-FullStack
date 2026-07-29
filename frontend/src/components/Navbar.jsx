import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  PenLine,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { initials } from "../utils/constants.js";

const navLinkClass = ({ isActive }) =>
  `eyebrow transition-colors hover:text-paper ${isActive ? "text-paper" : "text-muted"}`;

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-paper-line/10 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="group flex items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-2xl font-semibold tracking-tight text-paper">
            Blog<span className="text-brass">Zone</span>
          </span>
          <span className="eyebrow hidden sm:inline">
            the writer&apos;s desk
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/archive" className={navLinkClass}>
            Archive
          </NavLink>
          <button
            type="button"
            onClick={toggleTheme}
            className="text-muted transition-colors hover:text-brass"
            aria-label={`Switch to ${theme === "dark" ? "daylight" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "daylight" : "dark"} theme`}
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <Link to="/dashboard/blogs/new" className="btn-primary">
                <PenLine className="h-4 w-4" />
                Write
              </Link>
              <Link
                to="/dashboard/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-paper-line/30 font-mono text-xs text-paper hover:border-brass"
                title={user?.name}
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  initials(user?.name)
                )}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                className="text-muted transition-colors hover:text-rust"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Log in
              </NavLink>
              <Link to="/signup" className="btn-primary">
                Start writing
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="text-paper md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-paper-line/10 bg-canvas-panel px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/archive"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Archive
            </NavLink>
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="eyebrow flex items-center gap-2 text-left text-muted hover:text-brass"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              Switch to {theme === "dark" ? "daylight" : "dark"} theme
            </button>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  <span className="inline-flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </span>
                </NavLink>
                <NavLink
                  to="/dashboard/blogs/new"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Write a post
                </NavLink>
                <NavLink
                  to="/dashboard/profile"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="eyebrow flex items-center gap-2 text-left text-rust"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
