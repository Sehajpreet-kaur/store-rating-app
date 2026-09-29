import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { logoutUser } from "../../store/auth/index.js";

// Shared shell for Normal User and Store Owner (admin keeps its own sidebar layout).
function TopNavLayout({ navItems, subtitle }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser()).then(() => toast.success("Logged out successfully"));
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 md:px-10">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground">Store Rating App</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <nav className="flex gap-1">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-xs text-muted-foreground sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8 md:px-10">
        <Outlet />
      </main>
    </div>
  );
}

export default TopNavLayout;
