import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/auth.slice";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  LogOut,
  X,
  Calendar,
  SquareStack,
  ListChecks,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/posts", label: "Posts", icon: FileText },
  { to: "/projects", label: "Projects", icon: SquareStack },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-primary-foreground">
              <LayoutDashboard size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">TaskFlow</span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(
            ({ to, label, icon: Icon }) => (
              console.log("to ", to),
              console.log("label ", label),
              (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              )
            ),
          )}
        </nav>

        {/* Footer / User section */}
        <div className="border-t border-sidebar-border px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/50">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
