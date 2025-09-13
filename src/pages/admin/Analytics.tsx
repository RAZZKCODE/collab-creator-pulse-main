import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Download, TrendingUp, DollarSign, Users, Award, FileText, Eye } from "lucide-react"

// Mock data
const revenueData = [
  { month: "Aug", platformRevenue: 28000, creatorEarnings: 245000, brandSpending: 280000 },
  { month: "Sep", platformRevenue: 32000, creatorEarnings: 288000, brandSpending: 320000 },
  { month: "Oct", platformRevenue: 29000, creatorEarnings: 261000, brandSpending: 290000 },
  { month: "Nov", platformRevenue: 35000, creatorEarnings: 315000, brandSpending: 350000 },
  { month: "Dec", platformRevenue: 42000, creatorEarnings: 378000, brandSpending: 420000 },
  { month: "Jan", platformRevenue: 38000, creatorEarnings: 342000, brandSpending: 380000 },
]

const userGrowthData = [
  { month: "Aug", creators: 1200, brands: 580, total: 1780 },
  { month: "Sep", creators: 1450, brands: 680, total: 2130 },
  { month: "Oct", creators: 1680, brands: 750, total: 2430 },
  { month: "Nov", creators: 1920, brands: 840, total: 2760 },
  { month: "Dec", creators: 2180, brands: 920, total: 3100 },
  { month: "Jan", creators: 2450, brands: 1050, total: 3500 },
]

const campaignPerformanceData = [
  { category: "Fashion", campaigns: 45, avgBudget: 8500, successRate: 89 },
  { category: "Tech", campaigns: 38, avgBudget: 15200, successRate: 92 },
  { category: "Food", campaigns: 52, avgBudget: 3800, successRate: 85 },
  { category: "Fitness", campaigns: 29, avgBudget: 6700, successRate: 88 },
  { category: "Travel", campaigns: 33, avgBudget: 12100, successRate: 90 },
  { category: "Beauty", campaigns: 41, avgBudget: 5900, successRate: 87 },
]

const engagementData = [
  { platform: "Instagram", avgEngagement: 4.2, reach: 2500000 },
  { platform: "TikTok", avgEngagement: 6.8, reach: 1800000 },
  { platform: "YouTube", avgEngagement: 3.1, reach: 3200000 },
  { platform: "Twitter", avgEngagement: 2.9, reach: 950000 },
]

const topPerformingCampaigns = [
  {
    name: "Nike Summer Athletics",
    brand: "Nike Inc.",
    budget: "$75,000",
    roi: "340%",
    engagement: "4.8%",
    reach: "2.8M",
    status: "completed"
  },
  {
    name: "iPhone 15 Reviews",
    brand: "Apple Inc.",
    budget: "$120,000",
    roi: "280%",
    engagement: "3.9%",
    reach: "4.2M",
    status: "completed"
  },
  {
    name: "Tesla Model Y Experience",
    brand: "Tesla",
    budget: "$95,000",
    roi: "195%",
    engagement: "5.2%",
    reach: "1.9M",
    status: "active"
  }
]

const platformDistribution = [
  { name: "Instagram", value: 35, color: "hsl(var(--chart-primary))" },
  { name: "TikTok", value: 28, color: "hsl(var(--chart-secondary))" },
  { name: "YouTube", value: 25, color: "hsl(var(--chart-tertiary))" },
  { name: "Twitter", value: 12, color: "hsl(var(--chart-quaternary))" },
]

const kpiMetrics = [
  {
    title: "Total Platform Revenue",
    value: "$2.8M",
    change: "+23.1%",
    trend: "up",
    icon: DollarSign,
    description: "Last 6 months"
  },
  {
    title: "Active Users",
    value: "3,500",
    change: "+18.7%",
    trend: "up",
    icon: Users,
    description: "Monthly active users"
  },
  {
    title: "Campaign Success Rate",
    value: "89.2%",
    change: "+5.3%",
    trend: "up",
    icon: Award,
    description: "Campaigns completed successfully"
  },
  {
    title: "Avg. Campaign ROI",
    value: "245%",
    change: "+12.8%",
    trend: "up",
    icon: TrendingUp,
    description: "Return on investment"
  }
]

export default function Analytics() {
  const downloadReport = (format: string) => {
    console.log(`Downloading ${format} report...`)
    // Handle report download logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">Comprehensive platform performance insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="last6months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last3months">Last 3 Months</SelectItem>
              <SelectItem value="last6months">Last 6 Months</SelectItem>
              <SelectItem value="lastyear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => downloadReport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Excel Report
          </Button>
          <Button onClick={() => downloadReport('pdf')}>
            <FileText className="w-4 h-4 mr-2" />
            PDF Report
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className="text-success">{metric.change}</span>
                  <span>from previous period</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Platform revenue, creator earnings, and brand spending over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="brandSpending" 
                stackId="1"
                stroke="hsl(var(--chart-primary))" 
                fill="hsl(var(--chart-primary))"
                fillOpacity={0.6}
                name="Brand Spending"
              />
              <Area 
                type="monotone" 
                dataKey="creatorEarnings" 
                stackId="1"
                stroke="hsl(var(--chart-secondary))" 
                fill="hsl(var(--chart-secondary))"
                fillOpacity={0.6}
                name="Creator Earnings"
              />
              <Area 
                type="monotone" 
                dataKey="platformRevenue" 
                stackId="1"
                stroke="hsl(var(--chart-tertiary))" 
                fill="hsl(var(--chart-tertiary))"
                fillOpacity={0.6}
                name="Platform Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Creator and brand user growth trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="creators" 
                  stroke="hsl(var(--chart-primary))" 
                  strokeWidth={3}
                  name="Creators"
                />
                <Line 
                  type="monotone" 
                  dataKey="brands" 
                  stroke="hsl(var(--chart-secondary))" 
                  strokeWidth={3}
                  name="Brands"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--chart-tertiary))" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="Total Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Content creation by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance by Category</CardTitle>
          <CardDescription>Success rates and average budgets across different verticals</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "avgBudget") return [`$${Number(value).toLocaleString()}`, "Avg Budget"]
                  if (name === "successRate") return [`${value}%`, "Success Rate"]
                  return [value, name]
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="avgBudget" fill="hsl(var(--chart-primary))" name="Avg Budget" />
              <Bar yAxisId="right" dataKey="successRate" fill="hsl(var(--chart-secondary))" name="Success Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Campaigns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Performing Campaigns</CardTitle>
            <CardDescription>Highest ROI campaigns this period</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">{campaign.brand}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{campaign.budget}</div>
                    <div className="text-muted-foreground">Budget</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-success">{campaign.roi}</div>
                    <div className="text-muted-foreground">ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{campaign.engagement}</div>
                    <div className="text-muted-foreground">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{campaign.reach}</div>
                    <div className="text-muted-foreground">Reach</div>
                  </div>
                  <Badge variant={campaign.status === "completed" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}