import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Video, 
  DollarSign, 
  Eye, 
  Key, 
  Mail, 
  AlertTriangle 
} from "lucide-react";

export default function Profile() {
  const user = {
    username: "razz2004",
    role: "User",
    joined: "April 27, 2025",
    discordLinked: true,
    stats: {
      videos: 73,
      earned: "$2",
      views: "401,187"
    },
    wallet: "0x8d6567cc246a0AcC618B5cE3E9d1e0FEDB5d38",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account details and preferences
          </p>
        </div>
      </div>

      {/* User Info */}
      <Card className="bg-gradient-card">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-sm text-muted-foreground">
                Member since: {user.joined}
              </p>
              <Badge variant="secondary" className="mt-1">
                {user.role}
              </Badge>
            </div>
          </div>
          {user.discordLinked && (
            <Badge className="bg-gradient-primary text-primary-foreground">
              Discord Linked
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-card">
          <CardContent className="p-4 text-center">
            <Video className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Videos</p>
            <p className="text-2xl font-bold">{user.stats.videos}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Money Earned</p>
            <p className="text-2xl font-bold">{user.stats.earned}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Views</p>
            <p className="text-2xl font-bold">{user.stats.views}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Information */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm font-medium">
            USDT (ERC20) Wallet
          </p>
          <p className="text-xs text-muted-foreground break-all">
            {user.wallet}
          </p>
          <Separator />
          <div className="flex gap-2">
            <Input placeholder="Enter payment details" />
            <Button variant="gradient">Update Payment Method</Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input type="password" placeholder="Current Password" />
          <Input type="password" placeholder="New Password" />
          <Input type="password" placeholder="Confirm Password" />
          <Button variant="gradient">Update Password</Button>
        </CardContent>
      </Card>

      {/* Email Preferences */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Email Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm">Marketing Emails</p>
            <Button variant="outline" size="sm">Toggle</Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">Notification Emails</p>
            <Button variant="outline" size="sm">Toggle</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
