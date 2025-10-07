import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    console.log("User logged out");
    logout();
    navigate("/login");
  };

  // Get display name - prefer full_name, fallback to username, then email
  const displayName = user?.full_name || user?.username || user?.email?.split('@')[0] || 'Creator';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Section */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-gradient-card shadow-card flex items-center px-4 md:px-6 justify-between">
            {/* Sidebar Trigger (for collapse/expand) */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="p-2 rounded-lg hover:bg-accent transition-smooth" />
              <h1 className="hidden sm:block text-lg font-semibold text-foreground">
                CreatorPulse Dashboard
              </h1>
            </div>

                        {/* Right Side (User Info + Dropdown) */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:block text-xs sm:text-sm text-muted-foreground">
                Welcome back, <span className="font-medium text-foreground">{displayName}</span> 👋
              </span>

              {/* User Avatar + Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border shadow-sm">
                    <AvatarImage src={user?.avatar_url || "https://i.pravatar.cc/40"} alt={displayName} />
                    <AvatarFallback>
                      {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CR'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6">
            {/* 👇 Child routes yaha render honge */}
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// ✅ ADD THIS DEFAULT EXPORT
export default Layout;