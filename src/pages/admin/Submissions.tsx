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
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle,
  Filter,
  ExternalLink,
  Calendar,
  User,
  Tag
} from "lucide-react"

// Mock data
const submissions = [
  {
    id: "SUB-001",
    creator: "Sarah Chen",
    creatorAvatar: "/avatars/sarah.jpg",
    campaign: "Nike Summer Athletics Campaign",
    contentType: "Instagram Post",
    contentUrl: "https://instagram.com/p/example1",
    submittedDate: "2024-01-28",
    submittedTime: "14:30",
    status: "pending",
    description: "Showcasing the new Nike Air Max running shoes during morning workout session in Central Park",
    engagement: { likes: "2.5K", comments: "180", shares: "45" },
    platformMetrics: { reach: "125K", impressions: "250K" }
  },
  {
    id: "SUB-002",
    creator: "Marcus Johnson",
    creatorAvatar: "/avatars/marcus.jpg",
    campaign: "iPhone 15 Review Series",
    contentType: "YouTube Video",
    contentUrl: "https://youtube.com/watch?v=example2",
    submittedDate: "2024-01-28",
    submittedTime: "09:15",
    status: "approved",
    description: "Comprehensive 15-minute review covering camera improvements, battery life, and daily usage",
    engagement: { views: "45K", likes: "1.2K", comments: "320" },
    platformMetrics: { watchTime: "8.5 min avg", ctr: "12.3%" }
  },
  {
    id: "SUB-003",
    creator: "Emma Rodriguez",
    creatorAvatar: "/avatars/emma.jpg",
    campaign: "Spotify Podcast Promotion",
    contentType: "TikTok Video",
    contentUrl: "https://tiktok.com/@example/video/3",
    submittedDate: "2024-01-27",
    submittedTime: "18:45",
    status: "pending",
    description: "Quick 30-second highlight reel of the most interesting podcast moments with catchy music",
    engagement: { views: "89K", likes: "4.2K", shares: "780" },
    platformMetrics: { completion: "78%", saves: "450" }
  },
  {
    id: "SUB-004",
    creator: "Alex Kim",
    creatorAvatar: "/avatars/alex.jpg",
    campaign: "Local Coffee Shop Partnership",
    contentType: "Blog Article",
    contentUrl: "https://alexkim.blog/bean-and-brew-review",
    submittedDate: "2024-01-27",
    submittedTime: "12:20",
    status: "rejected",
    rejectionReason: "Content doesn't adequately showcase the coffee shop atmosphere and product quality as outlined in campaign brief",
    description: "Written review of Bean & Brew's new seasonal menu and coffee brewing techniques",
    engagement: { reads: "1.2K", shares: "35", comments: "18" },
    platformMetrics: { timeOnPage: "4:32", bounceRate: "35%" }
  },
  {
    id: "SUB-005",
    creator: "Lisa Park",
    creatorAvatar: "/avatars/lisa.jpg",
    campaign: "Tech Review Series",
    contentType: "Instagram Reel",
    contentUrl: "https://instagram.com/reel/example5",
    submittedDate: "2024-01-26",
    submittedTime: "16:00",
    status: "pending",
    description: "Unboxing and first impressions of the latest gaming laptop with speed tests",
    engagement: { plays: "56K", likes: "3.8K", saves: "290" },
    platformMetrics: { reach: "89K", profileVisits: "120" }
  }
]

const stats = [
  { label: "Total Submissions", value: "1,247", change: "+18.2%" },
  { label: "Pending Review", value: "34", change: "-12.5%" },
  { label: "Approved Today", value: "28", change: "+25.1%" },
  { label: "Approval Rate", value: "89.3%", change: "+3.2%" }
]

export default function Submissions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [contentTypeFilter, setContentTypeFilter] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.campaign.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    const matchesContentType = contentTypeFilter === "all" || submission.contentType.toLowerCase().includes(contentTypeFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesContentType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending Review</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleApprove = (submissionId: string) => {
    // Handle approval logic
    console.log("Approving submission:", submissionId)
    setIsReviewModalOpen(false)
  }

  const handleReject = (submissionId: string) => {
    // Handle rejection logic
    console.log("Rejecting submission:", submissionId, "Reason:", rejectionReason)
    setIsReviewModalOpen(false)
    setRejectionReason("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Submissions & Approvals</h1>
        <p className="text-muted-foreground">Review and approve creator content submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Submissions</CardTitle>
              <CardDescription>Review all creator submissions for approval</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search submissions..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Submissions Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Content Type</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={submission.creatorAvatar} />
                        <AvatarFallback>{submission.creator.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{submission.creator}</div>
                        <div className="text-sm text-muted-foreground">{submission.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48">
                      <div className="font-medium truncate">{submission.campaign}</div>
                      <div className="text-sm text-muted-foreground truncate">{submission.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{submission.contentType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {submission.submittedDate}
                      </div>
                      <div className="text-muted-foreground">{submission.submittedTime}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(submission.contentUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {submission.status === "pending" && (
                        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Review Submission</DialogTitle>
                              <DialogDescription>
                                Review and approve or reject this content submission
                              </DialogDescription>
                            </DialogHeader>
                            {selectedSubmission && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Creator</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={selectedSubmission.creatorAvatar} />
                                        <AvatarFallback>{selectedSubmission.creator.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                      </Avatar>
                                      <span>{selectedSubmission.creator}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Content Type</label>
                                    <div className="mt-1">
                                      <Badge variant="outline">{selectedSubmission.contentType}</Badge>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Campaign</label>
                                  <p className="mt-1">{selectedSubmission.campaign}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <p className="mt-1 text-sm text-muted-foreground">{selectedSubmission.description}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Content Link</label>
                                  <div className="mt-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(selectedSubmission.contentUrl, '_blank')}
                                    >
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      View Content
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Rejection Reason (if rejecting)</label>
                                  <Textarea
                                    placeholder="Provide detailed feedback for rejection..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsReviewModalOpen(false)
                                  setRejectionReason("")
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => selectedSubmission && handleReject(selectedSubmission.id)}
                                disabled={!rejectionReason.trim()}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                onClick={() => selectedSubmission && handleApprove(selectedSubmission.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
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