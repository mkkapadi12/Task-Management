import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/auth.slice";
import { Button } from "@/components/ui/button";
import { GUEST_ICONS } from "@/lib/icons/guest.icons";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
const { MENU: Menu, SUN: Sun, MOON: Moon } = GUEST_ICONS;
const { LOGOUT: LogOut, CHEVRONDOWN: ChevronDown } = DASHBOARD_ICONS;
import { useState, useRef, useEffect } from "react";

// Map pathname to page title
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/posts": "Posts",
  "/profile": "Profile",
  "/settings": "Settings",
};

const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Derive page title — fallback for dynamic routes like /posts/:id
  const pageTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith("/posts/") ? "Post Detail" : "Page");

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 md:px-6">
      {/* Left — hamburger + title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-lg font-semibold tracking-tight">{pageTitle}</h1>
      </div>

      {/* Right — theme toggle + avatar dropdown */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        {/* User avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
            <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
              {user?.name || "User"}
            </span>
            <ChevronDown
              size={14}
              className={`hidden sm:block text-muted-foreground transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-popover p-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-sm font-medium truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  dispatch(logout());
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
