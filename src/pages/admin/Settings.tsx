import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Save, 
  RefreshCw, 
  Shield, 
  CreditCard, 
  Mail, 
  MessageSquare, 
  Smartphone,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const { toast } = useToast()
  const [platformFee, setPlatformFee] = useState("10")
  const [minimumPayout, setMinimumPayout] = useState("50")
  const [paymentProcessingTime, setPaymentProcessingTime] = useState("3")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)

  const handleSave = () => {
    // Save settings logic
    toast({
      title: "Settings Saved",
      description: "Platform settings have been updated successfully.",
    })
  }

  const handlePasswordReset = () => {
    // Password reset logic
    toast({
      title: "Password Reset Email Sent",
      description: "A password reset link has been sent to your email address.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage platform configuration and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Platform Configuration
              </CardTitle>
              <CardDescription>Configure core platform settings and fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platformFee">Platform Fee (%)</Label>
                  <Input
                    id="platformFee"
                    type="number"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(e.target.value)}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Percentage taken from creator earnings
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumPayout">Minimum Payout ($)</Label>
                  <Input
                    id="minimumPayout"
                    type="number"
                    value={minimumPayout}
                    onChange={(e) => setMinimumPayout(e.target.value)}
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum amount for payout requests
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentProcessingTime">Payment Processing Time (Business Days)</Label>
                <Select value={paymentProcessingTime} onValueChange={setPaymentProcessingTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Business Day</SelectItem>
                    <SelectItem value="2">2 Business Days</SelectItem>
                    <SelectItem value="3">3 Business Days</SelectItem>
                    <SelectItem value="5">5 Business Days</SelectItem>
                    <SelectItem value="7">7 Business Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Payment Gateway Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripeKey">Stripe API Key</Label>
                    <Input
                      id="stripeKey"
                      type="password"
                      placeholder="sk_live_..."
                      value="••••••••••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                    <Input
                      id="paypalClientId"
                      type="password"
                      placeholder="AYi..."
                      value="••••••••••••••••"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage admin account security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin login
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Password Management</h4>
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={handlePasswordReset}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Admin Password
                  </Button>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Generate API Key
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Security Recommendation</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Enable two-factor authentication and regularly rotate API keys for enhanced security.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Notification Templates
              </CardTitle>
              <CardDescription>Customize email and notification templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcomeEmail">Welcome Email Template</Label>
                  <Textarea
                    id="welcomeEmail"
                    rows={4}
                    placeholder="Welcome to CreatorPulse! We're excited to have you join our creator community..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoutEmail">Payout Notification Template</Label>
                  <Textarea
                    id="payoutEmail"
                    rows={4}
                    placeholder="Your payout of {amount} has been processed and will arrive within {processing_time} business days..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignEmail">Campaign Approval Template</Label>
                  <Textarea
                    id="campaignEmail"
                    rows={4}
                    placeholder="Congratulations! Your campaign submission has been approved..."
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Template Variables</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Use variables like {"{user_name}"}, {"{amount}"}, {"{campaign_name}"} to personalize messages.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <Label>Email Notifications</Label>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <Label>SMS Notifications</Label>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <Label>Push Notifications</Label>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Status</CardTitle>
              <CardDescription>Current platform health metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">System Status</span>
                <span className="text-sm font-medium text-success">Operational</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">API Response</span>
                <span className="text-sm font-medium">142ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <span className="text-sm font-medium text-success">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Sessions</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="text-sm font-medium">2.3TB / 10TB</span>
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button onClick={handleSave} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Settings
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}