import { useState } from "react";
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const creatorItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Explore Campaigns", url: "/explore", icon: Search },
  { title: "My Campaigns", url: "/campaigns", icon: Briefcase },
  { title: "Wallet", url: "/wallet", icon: Wallet },
  { title: "Connected Accounts", url: "/accounts", icon: Link2 },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

const brandItems = [
  { title: "Brand Dashboard", url: "/brand", icon: TrendingUp },
  { title: "Manage Campaigns", url: "/brand/campaigns", icon: Briefcase },
  { title: "Analytics", url: "/brand/analytics", icon: BarChart3 },
  { title: "Creator Network", url: "/brand/creators", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

const adminItems = [
  { title: "Admin Dashboard", url: "/admin", icon: Crown },
  { title: "Manage Users", url: "/admin/users", icon: Users },
  { title: "All Campaigns", url: "/admin/campaigns", icon: Briefcase },
  { title: "Payouts", url: "/admin/payouts", icon: Wallet },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  // ✅ Use real user context instead of hardcoded role
  const { user, logout } = useUser();

  // Get user role from context or default to creator
  const userRole = user?.is_admin ? "admin" : (user?.role === "brand" ? "brand" : "creator");

  // Get display name
  const displayName = user?.full_name || user?.username || user?.email?.split('@')[0] || 'Creator';

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-gradient-primary text-primary-foreground font-medium shadow-elegant"
      : "hover:bg-accent/50 transition-smooth";

  const getItems = () => {
    if (userRole === "brand") return brandItems;
    if (userRole === "admin") return adminItems;
    return creatorItems;
  };

  const items = getItems();

  // ✅ Real logout function using context
  const handleLogout = () => {
    console.log("Logging out user...");
    logout();
    navigate("/login");
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r bg-gradient-card shadow-card transition-smooth`}
      collapsible="icon"
    >
      <SidebarContent className="p-2">
        {/* Logo */}
        <div className="flex items-center justify-center py-6">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                CreatorPulse
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
          )}
        </div>

        {/* ✅ User Profile Section */}
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8 border-2 border-white/20">
              <AvatarImage src={user?.avatar_url || "https://i.pravatar.cc/40"} alt={displayName} />
              <AvatarFallback className="bg-gradient-hero text-white text-sm">
                {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CR'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {displayName}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={userRole === "admin" ? "destructive" : userRole === "brand" ? "secondary" : "default"} className="text-xs">
                    {userRole === "admin" && <Crown className="w-3 h-3 mr-1" />}
                    {userRole === "brand" && <Star className="w-3 h-3 mr-1" />}
                    {userRole === "creator" && <Activity className="w-3 h-3 mr-1" />}
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = currentPath.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="rounded-lg">
                      <NavLink to={item.url} className={getNavCls({ isActive })}>
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        {!collapsed && (
                          <span className={`ml-3 ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Help Section */}
        <div className="mt-auto p-2 space-y-2">
          {/* Help & Support */}
          <SidebarMenuButton asChild className="rounded-lg hover:bg-accent/50 transition-smooth">
            <div className="flex items-center cursor-pointer">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              {!collapsed && (
                <span className="ml-3 text-sm text-muted-foreground">Help & Support</span>
              )}
            </div>
          </SidebarMenuButton>

          {/* ✅ Logout Button with proper styling */}
          <SidebarMenuButton
            className="rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-smooth cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 text-red-500" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium text-red-500">Logout</span>
            )}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}