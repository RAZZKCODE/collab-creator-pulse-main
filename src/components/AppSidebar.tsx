import {
  LayoutDashboard,
  Search,
  Briefcase,
  Wallet,
  User,
  Settings,
  TrendingUp,
  Users,
  BarChart3,
  Link2,
  HelpCircle,
  LogOut,
  Crown,
  Star,
  Activity
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const creatorItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Explore Campaigns", url: "/explore", icon: Search },
  { title: "My Campaigns", url: "/campaigns", icon: Briefcase },
  { title: "Wallet", url: "/wallet", icon: Wallet },
  { title: "Connected Accounts", url: "/accounts", icon: Link2 },
];

const accountItems = [
    { title: "Profile", url: "/profile", icon: User },
    { title: "Settings", url: "/settings", icon: Settings },
]

const brandItems = [
  { title: "Brand Dashboard", url: "/brand", icon: TrendingUp },
  { title: "Manage Campaigns", url: "/brand/campaigns", icon: Briefcase },
  { title: "Analytics", url: "/brand/analytics", icon: BarChart3 },
  { title: "Creator Network", url: "/brand/creators", icon: Users },
];

const adminItems = [
  { title: "Admin Dashboard", url: "/admin", icon: Crown },
  { title: "Manage Users", url: "/admin/users", icon: Users },
  { title: "All Campaigns", url: "/admin/campaigns", icon: Briefcase },
  { title: "Payouts", url: "/admin/payouts", icon: Wallet },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const { user, logout } = useUser();

  const userRole = user?.is_admin ? "admin" : user?.role === "brand" ? "brand" : "creator";
  const displayName = user?.full_name || user?.username || user?.email?.split('@')[0] || 'User';
  const displayInitial = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary border-l-2 border-primary dark:bg-primary/20"
      : "hover:bg-accent/50 text-muted-foreground transition-colors";

  const getItems = () => {
    if (userRole === "admin") return adminItems;
    if (userRole === "brand") return brandItems;
    return creatorItems;
  };
  const navItems = getItems();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r bg-background transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col p-2">
        {/* Logo */}
        <div className="flex items-center justify-center py-5 h-16">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            {!collapsed && (
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent whitespace-nowrap">
                CreatorPulse
              </span>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        <div className={`my-4 p-3 rounded-lg border transition-all ${collapsed ? 'bg-transparent border-transparent' : 'bg-accent/30'}`}>
          <div className={`flex items-center space-x-3 ${collapsed ? 'justify-center' : ''}`}>
            <Avatar className="w-9 h-9 border-2 border-primary/50">
              <AvatarImage src={user?.avatar_url || "https://i.pravatar.cc/40"} alt={displayName} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                {displayInitial}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {displayName}
                </p>
                <Badge 
                  variant={userRole === "admin" ? "destructive" : userRole === "brand" ? "secondary" : "default"} 
                  className="text-xs mt-1"
                >
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <SidebarMenu className="space-y-1 flex-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="rounded-lg justify-start" tooltip={item.title}>
                <NavLink to={item.url} className={getNavCls({ isActive: location.pathname === item.url })}>
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Bottom Section */}
        <div className="mt-auto space-y-1">
          <SidebarSeparator />
          <SidebarMenu>
            {/* Account Items (Profile/Settings) */}
            {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="rounded-lg justify-start" tooltip={item.title}>
                    <NavLink to={item.url} className={getNavCls({ isActive: location.pathname.startsWith(item.url) })}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                    </NavLink>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            
            {/* Logout Button */}
            <SidebarMenuItem>
              <SidebarMenuButton
                className="rounded-lg justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                onClick={handleLogout}
                tooltip="Logout"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="ml-3 font-medium">Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}