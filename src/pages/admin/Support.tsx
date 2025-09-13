import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  MessageCircle, 
  CheckCircle, 
  XCircle,
  Filter,
  Plus,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  Paperclip
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const tickets = [
  {
    id: "TIC-001",
    user: "Sarah Chen",
    userAvatar: "/avatars/sarah.jpg",
    userType: "Creator",
    subject: "Payment not received for completed campaign",
    status: "open",
    priority: "high",
    category: "Payment",
    createdDate: "2024-01-28",
    lastUpdate: "2024-01-28",
    description: "I completed the Nike campaign over a week ago but haven't received my payment yet. The campaign was approved and marked as complete.",
    messages: [
      {
        id: 1,
        sender: "Sarah Chen",
        message: "Hi, I completed the Nike campaign over a week ago but haven't received my payment yet. The campaign was approved and marked as complete.",
        timestamp: "2024-01-28 10:30 AM",
        isAdmin: false
      }
    ]
  },
  {
    id: "TIC-002",
    user: "Marcus Johnson",
    userAvatar: "/avatars/marcus.jpg",
    userType: "Creator",
    subject: "Unable to upload content for review",
    status: "in_progress",
    priority: "medium",
    category: "Technical",
    createdDate: "2024-01-27",
    lastUpdate: "2024-01-28",
    description: "Getting an error when trying to upload my YouTube video for campaign review. Error says 'File format not supported'.",
    messages: [
      {
        id: 1,
        sender: "Marcus Johnson",
        message: "Getting an error when trying to upload my YouTube video for campaign review. Error says 'File format not supported'.",
        timestamp: "2024-01-27 2:15 PM",
        isAdmin: false
      },
      {
        id: 2,
        sender: "Admin",
        message: "Hi Marcus! I can see the issue. Our system currently supports MP4, MOV, and AVI formats. What format is your video in?",
        timestamp: "2024-01-27 3:45 PM",
        isAdmin: true
      },
      {
        id: 3,
        sender: "Marcus Johnson",
        message: "It's an MP4 file, around 2GB in size. Could that be the issue?",
        timestamp: "2024-01-28 9:20 AM",
        isAdmin: false
      }
    ]
  },
  {
    id: "TIC-003",
    user: "Nike Inc.",
    userAvatar: "/avatars/nike.jpg",
    userType: "Brand",
    subject: "Request for campaign performance analytics",
    status: "closed",
    priority: "low",
    category: "Analytics",
    createdDate: "2024-01-25",
    lastUpdate: "2024-01-26",
    description: "We would like to request detailed analytics for our Summer Athletics campaign including engagement rates and demographic breakdown.",
    messages: [
      {
        id: 1,
        sender: "Nike Inc.",
        message: "We would like to request detailed analytics for our Summer Athletics campaign including engagement rates and demographic breakdown.",
        timestamp: "2024-01-25 11:00 AM",
        isAdmin: false
      },
      {
        id: 2,
        sender: "Admin",
        message: "I've generated the analytics report for your Summer Athletics campaign. You can download it from your campaign dashboard or I can email it to you directly.",
        timestamp: "2024-01-25 2:30 PM",
        isAdmin: true
      },
      {
        id: 3,
        sender: "Nike Inc.",
        message: "Perfect! I can see it in the dashboard now. Thank you for the quick response.",
        timestamp: "2024-01-26 9:15 AM",
        isAdmin: false
      }
    ]
  },
  {
    id: "TIC-004",
    user: "Emma Rodriguez",
    userAvatar: "/avatars/emma.jpg",
    userType: "Creator",
    subject: "Account verification stuck in review",
    status: "open",
    priority: "medium",
    category: "Account",
    createdDate: "2024-01-26",
    lastUpdate: "2024-01-26",
    description: "My account verification has been stuck in review for 5 days now. I've uploaded all required documents.",
    messages: [
      {
        id: 1,
        sender: "Emma Rodriguez",
        message: "My account verification has been stuck in review for 5 days now. I've uploaded all required documents.",
        timestamp: "2024-01-26 4:20 PM",
        isAdmin: false
      }
    ]
  },
  {
    id: "TIC-005",
    user: "Alex Kim",
    userAvatar: "/avatars/alex.jpg",
    userType: "Creator",
    subject: "Feature request: Bulk content upload",
    status: "open",
    priority: "low",
    category: "Feature Request",
    createdDate: "2024-01-24",
    lastUpdate: "2024-01-24",
    description: "It would be great to have a feature to upload multiple pieces of content at once for campaigns that require multiple deliverables.",
    messages: [
      {
        id: 1,
        sender: "Alex Kim",
        message: "It would be great to have a feature to upload multiple pieces of content at once for campaigns that require multiple deliverables.",
        timestamp: "2024-01-24 1:10 PM",
        isAdmin: false
      }
    ]
  }
]

const stats = [
  { 
    label: "Open Tickets", 
    value: "23", 
    change: "-12.5%", 
    icon: MessageCircle,
    description: "Requires attention"
  },
  { 
    label: "Avg Response Time", 
    value: "2.3h", 
    change: "+5.2%", 
    icon: Clock,
    description: "First response"
  },
  { 
    label: "Resolution Rate", 
    value: "94.5%", 
    change: "+8.1%", 
    icon: CheckCircle,
    description: "Tickets resolved"
  },
  { 
    label: "High Priority", 
    value: "4", 
    change: "-25.0%", 
    icon: AlertCircle,
    description: "Urgent tickets"
  }
]

export default function Support() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-warning text-warning-foreground">Open</Badge>
      case "in_progress":
        return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>
      case "closed":
        return <Badge className="bg-success text-success-foreground">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const handleSendReply = () => {
    if (!replyMessage.trim()) return
    
    // Add reply to ticket
    console.log("Sending reply:", replyMessage)
    setReplyMessage("")
    toast({
      title: "Reply Sent",
      description: "Your response has been sent to the user.",
    })
  }

  const handleCloseTicket = (ticketId: string) => {
    console.log("Closing ticket:", ticketId)
    setIsTicketModalOpen(false)
    toast({
      title: "Ticket Closed",
      description: "The support ticket has been marked as resolved.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support</h1>
        <p className="text-muted-foreground">Manage customer support tickets and inquiries</p>
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
                  <span>from last week</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Support Tickets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Manage customer support requests and inquiries</CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Tickets Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={ticket.userAvatar} />
                        <AvatarFallback>{ticket.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{ticket.user}</div>
                        <div className="text-sm text-muted-foreground">{ticket.userType}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-64">
                      <div className="font-medium truncate">{ticket.subject}</div>
                      <div className="text-sm text-muted-foreground">{ticket.category}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell className="text-sm">{ticket.createdDate}</TableCell>
                  <TableCell className="text-right">
                    <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle>Ticket {selectedTicket?.id}</DialogTitle>
                          <DialogDescription>{selectedTicket?.subject}</DialogDescription>
                        </DialogHeader>
                        {selectedTicket && (
                          <div className="flex-1 overflow-hidden flex flex-col">
                            {/* Ticket Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                              <div>
                                <span className="text-sm font-medium">User:</span>
                                <div className="flex items-center gap-2 mt-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={selectedTicket.userAvatar} />
                                    <AvatarFallback>{selectedTicket.user.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{selectedTicket.user}</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Status:</span>
                                <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Priority:</span>
                                <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Category:</span>
                                <div className="mt-1 text-sm">{selectedTicket.category}</div>
                              </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                              {selectedTicket.messages.map((message: any) => (
                                <div key={message.id} className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[70%] rounded-lg p-3 ${
                                    message.isAdmin 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-muted'
                                  }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium">{message.sender}</span>
                                      <span className="text-xs opacity-70">{message.timestamp}</span>
                                    </div>
                                    <p className="text-sm">{message.message}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Reply Box */}
                            {selectedTicket.status !== 'closed' && (
                              <>
                                <Separator className="mb-4" />
                                <div className="space-y-3">
                                  <Textarea
                                    placeholder="Type your response..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows={3}
                                  />
                                  <div className="flex items-center justify-between">
                                    <Button variant="outline" size="sm">
                                      <Paperclip className="w-4 h-4 mr-2" />
                                      Attach File
                                    </Button>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => handleCloseTicket(selectedTicket.id)}
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Close Ticket
                                      </Button>
                                      <Button onClick={handleSendReply} disabled={!replyMessage.trim()}>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Reply
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredTickets.length} of {tickets.length} tickets
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