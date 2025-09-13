import { StatsCard } from "@/components/StatsCard";
import { CampaignCard } from "@/components/CampaignCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Eye, 
  Video, 
  TrendingUp, 
  Users, 
  Calendar,
  Instagram,
  Youtube,
  Zap,
  ArrowUpRight,
  Clock
} from "lucide-react";

// Mock data
const stats = [
  {
    title: "Total Earnings",
    value: "$2,847.32",
    change: "+12.5% from last month",
    changeType: "positive" as const,
    icon: DollarSign,
    gradient: true,
  },
  {
    title: "Total Views",
    value: "2.8M",
    change: "+5.2% from last month",
    changeType: "positive" as const,
    icon: Eye,
  },
  {
    title: "Active Campaigns",
    value: "8",
    change: "+2 this week",
    changeType: "positive" as const,
    icon: Video,
  },
  {
    title: "Completion Rate",
    value: "92%",
    change: "+3% from last month",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

const recentCampaigns = [
  {
    id: "1",
    title: "Jammable x Creator Collab",
    description: "Create viral mashups with Jammable's new app. Showcase music creation. TikTok Only. No follower minimum.",
    budget: 2000,
    ratePerMillion: 1000,
    used: 1250,
    completion: 63,
    platforms: ["TikTok"],
    maxSubmissions: 50,
    maxEarnings: 1500,
    status: "active" as const,
    brand: "Jammable",
    submissions: 3,
    earnings: 847.50,
  },
  {
    id: "2",
    title: "Seele AI x Creator Partnership",
    description: "Showcase AI productivity tools in your workflow. Professional content creators only.",
    budget: 4100,
    ratePerMillion: 750,
    used: 1500,
    completion: 36,
    platforms: ["YouTube", "Instagram"],
    maxSubmissions: 50,
    maxEarnings: 1000,
    status: "active" as const,
    brand: "Seele AI",
    submissions: 2,
    earnings: 523.75,
  },
];

const connectedAccounts = [
  { platform: "Instagram", username: "@creator_pro", followers: "125K", connected: true },
  { platform: "YouTube", username: "CreatorPro Channel", followers: "89K", connected: true },
  { platform: "TikTok", username: "@creatorpro2024", followers: "245K", connected: false },
];

const recentActivity = [
  { type: "earnings", message: "Earned $125.50 from Jammable campaign", time: "2 hours ago" },
  { type: "submission", message: "Submitted content for Seele AI campaign", time: "5 hours ago" },
  { type: "approval", message: "Content approved for Refrag campaign", time: "1 day ago" },
  { type: "payout", message: "Payout of $500.00 processed", time: "3 days ago" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your campaigns, earnings, and performance
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="gradient" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Active Campaigns */}
      
    </div>
  );
}