import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { PrivateRoute } from "./utils/PrivateRoute";
import Layout from "./components/Layout";
import { UserProvider } from "./contexts/UserContext";

// User Pages
import Explore from "./pages/Explore";
import Wallet from "./pages/Wallet";
import Campaigns from "./pages/Campaigns";
import Accounts from "./pages/Accounts";
import Profile from "./pages/Profile";
import CampaignDetails from "./pages/CampaignDetails";
import CampaignOverview from "./pages/CampaignOverview";
import Settings from "./pages/Settings";

// Auth Wrappers
import { AdminPrivateRoute } from "./utils/AdminPrivateRoute";

// Admin Layout + Pages
import ALayout from "./components/admin/ALayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCampaigns from "./pages/admin/Campaigns";
import AdminSubmissions from "./pages/admin/Submissions";
import AdminPayouts from "./pages/admin/Payouts";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSupport from "./pages/admin/Support";
import AdminSettings from "./pages/admin/Settings";

// Initialize React Query Client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected User Routes */}
            <Route
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />

              {/* Dynamic User Routes */}
              <Route path="/campaigns/:id" element={<CampaignDetails />} />
              <Route path="/campaigns/:id/overview" element={<CampaignOverview />} />
            </Route>

            {/* ✅ Fixed Protected Admin Routes */}
            <Route element={<AdminPrivateRoute />}>
              <Route element={<ALayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/campaigns" element={<AdminCampaigns />} />
                <Route path="/admin/submissions" element={<AdminSubmissions />} />
                <Route path="/admin/payouts" element={<AdminPayouts />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/support" element={<AdminSupport />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


