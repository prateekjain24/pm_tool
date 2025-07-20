import {
  BarChart3,
  ChevronRight,
  FileText,
  FlaskConical,
  Home,
  Menu,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children?: ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  requiredRole?: "admin" | "member" | "viewer";
  requiredPermission?: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick actions",
  },
  {
    title: "Hypotheses",
    href: "/hypotheses",
    icon: FlaskConical,
    description: "Create and manage hypotheses",
  },
  {
    title: "Experiments",
    href: "/experiments",
    icon: BarChart3,
    description: "Track experiment results",
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
    description: "PRDs and test plans",
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
    description: "Manage team members",
    requiredPermission: "manage_team",
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Shield,
    description: "Admin controls",
    requiredRole: "admin",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Workspace and account settings",
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, hasRole, hasPermission } = useUser();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Filter navigation items based on user role and permissions
  const filteredNavItems = navItems.filter((item) => {
    if (item.requiredRole && !hasRole(item.requiredRole)) {
      return false;
    }
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsSidebarOpen(false);
            }
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border-r border-border transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border lg:hidden">
            <span className="text-lg font-semibold">Menu</span>
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {filteredNavItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/dashboard" && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground font-medium",
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-border">
            <div className="px-3 py-2 text-xs text-muted-foreground">
              <div>PM Tools v1.0.0</div>
              <div className="mt-1">© 2025 PM Tools</div>
              {user && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-0">
        {/* Header with mobile menu button */}
        <div className="sticky top-0 z-20">
          <Header />
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-30 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-accent transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
