import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Menu } from "lucide-react";
import { useNavigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.full_name || user?.username || user?.email?.split('@')[0] || 'Creator';
  const displayInitial = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CR';

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-muted/40 flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-background/95 backdrop-blur-sm border-b flex items-center px-4 md:px-6 justify-between sticky top-0 z-30">
            {/* Left Side: Sidebar Toggle and Welcome Message */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
              <h1 className="hidden sm:block text-lg font-semibold text-foreground">
                Welcome back, <span className="bg-gradient-hero bg-clip-text text-transparent">{displayName}</span> 👋
              </h1>
            </div>

            {/* Right Side: User Menu */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-primary transition-colors">
                        <AvatarImage src={user?.avatar_url || "https://i.pravatar.cc/40"} alt={displayName} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {displayInitial}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        </div>
                    </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" /> 
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="h-4 w-4 mr-2" /> 
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> 
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;