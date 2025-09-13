import { ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, FileText, DollarSign, BarChart3, HelpCircle, Settings, LogOut } from "lucide-react";

interface LayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Campaigns", url: "/admin/campaigns", icon: Briefcase },
    { title: "Submissions", url: "/admin/submissions", icon: FileText },
    { title: "Payouts", url: "/admin/payouts", icon: DollarSign },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    { title: "Support", url: "/admin/support", icon: HelpCircle },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-card border-r shadow-md">
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <nav className="flex flex-col space-y-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-md transition ${
                    isActive ? "bg-primary text-white" : "hover:bg-accent"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </NavLink>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 rounded-md text-red-500 hover:bg-red-100 mt-4"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-background">
        {children || <Outlet />}
      </main>
    </div>
  );
}
