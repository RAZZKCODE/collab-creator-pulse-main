import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate, Outlet } from "react-router-dom";

export function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");
    // 🔹 Clear auth token / session
    localStorage.removeItem("authToken");
    navigate("/login");
  };

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
            <div className="flex items-center space-x-4">
              <span className="hidden md:block text-sm text-muted-foreground">
                Welcome back, <span className="font-medium text-foreground">Creator</span> 👋
              </span>

              {/* User Avatar + Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border shadow-sm">
                    <AvatarImage src="https://i.pravatar.cc/40" alt="User" />
                    <AvatarFallback>CR</AvatarFallback>
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
