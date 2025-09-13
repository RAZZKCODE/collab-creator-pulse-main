import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle,
  Filter,
  Download,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react"

// Mock data
const payouts = [
  {
    id: "PAY-001",
    creator: "Sarah Chen",
    creatorAvatar: "/avatars/sarah.jpg",
    amount: "$2,450.00",
    campaign: "Nike Summer Campaign",
    requestDate: "2024-01-25",
    status: "pending",
    paymentMethod: "PayPal",
    email: "sarah.chen@email.com",
    earnings: "$2,695.00",
    platformFee: "$245.00"
  },
  {
    id: "PAY-002",
    creator: "Marcus Johnson",
    creatorAvatar: "/avatars/marcus.jpg",
    amount: "$1,890.00",
    campaign: "Spotify Podcast Series",
    requestDate: "2024-01-24",
    status: "completed",
    paymentMethod: "Bank Transfer",
    email: "marcus.j@email.com",
    earnings: "$2,100.00",
    platformFee: "$210.00",
    completedDate: "2024-01-26"
  },
  {
    id: "PAY-003",
    creator: "Emma Rodriguez",
    creatorAvatar: "/avatars/emma.jpg",
    amount: "$3,200.00",
    campaign: "Apple iPhone Review",
    requestDate: "2024-01-23",
    status: "pending",
    paymentMethod: "Stripe",
    email: "emma.rodriguez@email.com",
    earnings: "$3,555.00",
    platformFee: "$355.00"
  },
  {
    id: "PAY-004",
    creator: "Alex Kim",
    creatorAvatar: "/avatars/alex.jpg",
    amount: "$950.00",
    campaign: "Local Coffee Brand",
    requestDate: "2024-01-22",
    status: "completed",
    paymentMethod: "PayPal",
    email: "alex.kim@email.com",
    earnings: "$1,055.00",
    platformFee: "$105.00",
    completedDate: "2024-01-24"
  },
  {
    id: "PAY-005",
    creator: "Lisa Park",
    creatorAvatar: "/avatars/lisa.jpg",
    amount: "$1,670.00",
    campaign: "Tech Review Series",
    requestDate: "2024-01-21",
    status: "rejected",
    paymentMethod: "Bank Transfer",
    email: "lisa.park@email.com",
    earnings: "$1,855.00",
    platformFee: "$185.00",
    rejectionReason: "Incomplete campaign deliverables"
  },
  {
    id: "PAY-006",
    creator: "David Wilson",
    creatorAvatar: "/avatars/david.jpg",
    amount: "$4,230.00",
    campaign: "Fashion Week Coverage",
    requestDate: "2024-01-20",
    status: "processing",
    paymentMethod: "Stripe",
    email: "david.wilson@email.com",
    earnings: "$4,700.00",
    platformFee: "$470.00"
  }
]

const stats = [
  { 
    label: "Pending Payouts", 
    value: "$12,450", 
    change: "-8.2%", 
    icon: Clock,
    description: "5 requests awaiting approval"
  },
  { 
    label: "Paid This Month", 
    value: "$284,592", 
    change: "+23.1%", 
    icon: DollarSign,
    description: "127 successful payments"
  },
  { 
    label: "Total Platform Fees", 
    value: "$31,705", 
    change: "+18.7%", 
    icon: TrendingUp,
    description: "11.15% average fee rate"
  },
  { 
    label: "Failed Payments", 
    value: "3", 
    change: "-67.8%", 
    icon: AlertCircle,
    description: "Requires immediate attention"
  }
]

export default function Payouts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter
    const matchesPaymentMethod = paymentMethodFilter === "all" || payout.paymentMethod.toLowerCase() === paymentMethodFilter.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesPaymentMethod
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>
      case "processing":
        return <Badge className="bg-primary text-primary-foreground">Processing</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleApprovePayout = (payoutId: string) => {
    console.log("Approving payout:", payoutId)
    // Handle approval logic
  }

  const handleRejectPayout = (payoutId: string) => {
    console.log("Rejecting payout:", payoutId)
    // Handle rejection logic
  }

  const exportPayouts = () => {
    console.log("Exporting payouts...")
    // Handle export logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payouts</h1>
        <p className="text-muted-foreground">Manage creator payment requests and transaction history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className={`${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                    {stat.change}
                  </span>
                  <span>from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common payout management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve All Pending
            </Button>
            <Button variant="outline" onClick={exportPayouts}>
              <Download className="w-4 h-4 mr-2" />
              Export This Month
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Requests</CardTitle>
              <CardDescription>All creator payout requests and transaction history</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search payouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="bank transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payouts Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={payout.creatorAvatar} />
                        <AvatarFallback>{payout.creator.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{payout.creator}</div>
                        <div className="text-sm text-muted-foreground">{payout.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-lg">{payout.amount}</div>
                      <div className="text-xs text-muted-foreground">
                        Gross: {payout.earnings} | Fee: {payout.platformFee}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-40">
                      <div className="font-medium truncate">{payout.campaign}</div>
                      <div className="text-sm text-muted-foreground">{payout.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payout.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{payout.requestDate}</div>
                      {payout.completedDate && (
                        <div className="text-muted-foreground text-xs">
                          Paid: {payout.completedDate}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  <TableCell className="text-right">
                    {payout.status === "pending" ? (
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectPayout(payout.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprovePayout(payout.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                          {payout.status === "rejected" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Reprocess Payment</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredPayouts.length} of {payouts.length} payouts
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}