import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { Users, DollarSign, TrendingUp, Clock, Eye, CheckCircle } from "lucide-react"

// Mock data
const metrics = [
  {
    title: "Total Users",
    value: "12,849",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "Active creators and brands"
  },
  {
    title: "Active Campaigns",
    value: "247",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
    description: "Currently running campaigns"
  },
  {
    title: "Total Payouts",
    value: "$284,592",
    change: "+23.1%",
    trend: "up",
    icon: DollarSign,
    description: "Paid to creators this month"
  },
  {
    title: "Pending Approvals",
    value: "34",
    change: "-5.3%",
    trend: "down",
    icon: Clock,
    description: "Submissions awaiting review"
  }
]

const dailyActiveUsers = [
  { date: "Jan 1", users: 1200 },
  { date: "Jan 2", users: 1350 },
  { date: "Jan 3", users: 1180 },
  { date: "Jan 4", users: 1420 },
  { date: "Jan 5", users: 1680 },
  { date: "Jan 6", users: 1590 },
  { date: "Jan 7", users: 1750 },
]

const revenueData = [
  { month: "Nov", brandSpending: 45000, creatorEarnings: 38000, platformFee: 7000 },
  { month: "Dec", brandSpending: 52000, creatorEarnings: 44000, platformFee: 8000 },
  { month: "Jan", brandSpending: 48000, creatorEarnings: 41000, platformFee: 7000 },
]

const platformRevenueBreakdown = [
  { name: "Platform Fees", value: 22000, color: "hsl(var(--chart-primary))" },
  { name: "Premium Subscriptions", value: 8500, color: "hsl(var(--chart-secondary))" },
  { name: "Featured Listings", value: 4200, color: "hsl(var(--chart-tertiary))" },
  { name: "Analytics Tools", value: 2800, color: "hsl(var(--chart-quaternary))" },
]

const recentPayouts = [
  {
    id: "PAY-001",
    creator: "Sarah Chen",
    avatar: "/avatars/sarah.jpg",
    amount: "$2,450",
    campaign: "Nike Summer Campaign",
    status: "completed",
    date: "2024-01-15"
  },
  {
    id: "PAY-002", 
    creator: "Marcus Johnson",
    avatar: "/avatars/marcus.jpg",
    amount: "$1,890",
    campaign: "Spotify Podcast Series",
    status: "completed",
    date: "2024-01-14"
  },
  {
    id: "PAY-003",
    creator: "Emma Rodriguez",
    avatar: "/avatars/emma.jpg", 
    amount: "$3,200",
    campaign: "Apple iPhone Review",
    status: "pending",
    date: "2024-01-13"
  },
  {
    id: "PAY-004",
    creator: "Alex Kim",
    avatar: "/avatars/alex.jpg",
    amount: "$950",
    campaign: "Local Coffee Brand",
    status: "completed",
    date: "2024-01-12"
  },
]

const recentApprovals = [
  {
    id: "SUB-045",
    creator: "Lisa Park",
    campaign: "Tech Review Series",
    type: "Instagram Post",
    submitted: "2 hours ago",
    status: "pending"
  },
  {
    id: "SUB-046", 
    creator: "David Wilson",
    campaign: "Fashion Week Coverage",
    type: "YouTube Video",
    submitted: "4 hours ago",
    status: "approved"
  },
  {
    id: "SUB-047",
    creator: "Maya Patel",
    campaign: "Food Blog Partnership",
    type: "Blog Article",
    submitted: "6 hours ago",
    status: "pending"
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform performance</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="border border-metric-card-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className={`${metric.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {metric.change}
                  </span>
                  <span>from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
            <CardDescription>User activity over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--chart-primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Revenue</CardTitle>
            <CardDescription>Revenue sources breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformRevenueBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformRevenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Brand spending vs creator earnings comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="brandSpending" fill="hsl(var(--chart-primary))" name="Brand Spending" />
              <Bar dataKey="creatorEarnings" fill="hsl(var(--chart-secondary))" name="Creator Earnings" />
              <Bar dataKey="platformFee" fill="hsl(var(--chart-tertiary))" name="Platform Fee" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payouts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Payouts</CardTitle>
              <CardDescription>Latest payments to creators</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={payout.avatar} />
                          <AvatarFallback>{payout.creator.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{payout.creator}</div>
                          <div className="text-xs text-muted-foreground">{payout.campaign}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{payout.amount}</TableCell>
                    <TableCell>
                      <Badge variant={payout.status === 'completed' ? 'default' : 'secondary'}>
                        {payout.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Content awaiting approval</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Review All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApprovals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{approval.creator}</div>
                        <div className="text-xs text-muted-foreground">{approval.campaign}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{approval.type}</TableCell>
                    <TableCell>
                      <Badge variant={approval.status === 'approved' ? 'default' : 'secondary'}>
                        {approval.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}