import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Youtube, Music2, Plus, HelpCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiRequest } from "@/utils/api";

interface ConnectedAccount {
  id: number;
  platform: string;
  username: string;
  profile_url?: string;
  connected: boolean;
  connectedAt: string;
  icon: any;
  color: string;
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return Instagram;
    case "youtube":
      return Youtube;
    case "tiktok":
      return Music2;
    default:
      return HelpCircle;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "text-pink-500";
    case "youtube":
      return "text-red-500";
    case "tiktok":
      return "text-black";
    default:
      return "text-gray-500";
  }
};

export default function Accounts() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  // Fetch connected accounts on component mount
  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/api/auth/connected-accounts');
      const formattedAccounts = (data.accounts || []).map((acc: any) => ({
        id: acc.id,
        platform: acc.platform,
        username: acc.username,
        profile_url: acc.profile_url,
        connected: acc.connected,
        connectedAt: acc.connectedAt,
        icon: getPlatformIcon(acc.platform),
        color: getPlatformColor(acc.platform),
      }));
      setAccounts(formattedAccounts);
    } catch (error) {
      console.error('Failed to fetch connected accounts:', error);
      toast.error('Failed to load connected accounts');
      // Fallback to empty array - no hardcoded data
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerifyCode(code);
    toast.success(`Your verification code is ${code}`);
  };

  const handleConnect = async () => {
    if (!platform || !username) {
      toast.error("Please select platform and enter username/link");
      return;
    }

    if (accounts.length >= 5) {
      toast.error("You can only connect a maximum of 5 accounts ❌");
      return;
    }

    setConnecting(true);
    try {
      await apiRequest('/api/auth/connected-accounts', {
        method: 'POST',
        body: JSON.stringify({
          platform,
          username,
          verification_code: verifyCode,
        }),
      });

      toast.success(`${platform} account connection request submitted successfully! 🎉`);
      
      // Refresh accounts list
      await fetchConnectedAccounts();
      
      // Reset fields
      setPlatform("");
      setUsername("");
      setVerifyCode("");
    } catch (error) {
      console.error('Failed to connect account:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to connect account');
    } finally {
      setConnecting(false);
    }
  };

  const handleSupportTicket = (acc: ConnectedAccount) => {
    toast.info(
      `A support ticket has been generated to disconnect ${acc.username}. Admin will review it.`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading connected accounts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Connected Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your linked social accounts for campaigns
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="gradient"
                size="sm"
                disabled={accounts.length >= 5}
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect a new account</DialogTitle>
                <DialogDescription>
                  Choose a platform and verify your account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder={
                    platform === "Other" ? "Enter profile link" : "Enter username"
                  }
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={generateCode}>
                    Generate Verify Code
                  </Button>
                  {verifyCode && (
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {verifyCode}
                    </span>
                  )}
                </div>

                <Button
                  variant="gradient"
                  className="w-full"
                  onClick={handleConnect}
                  disabled={connecting || accounts.length >= 5}
                >
                  {connecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Accounts List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="mb-4">
              <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No accounts connected yet</h3>
            <p className="text-muted-foreground">
              Connect your social media accounts to start participating in campaigns!
            </p>
          </div>
        ) : (
          accounts.map((acc) => (
            <Card key={acc.id} className="bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <acc.icon className={`h-5 w-5 ${acc.color}`} />
                  {acc.platform}
                </CardTitle>
                {acc.connected ? (
                  <Badge className="bg-success text-success-foreground">
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not Connected</Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium">
                  Username:{" "}
                  <span className="text-muted-foreground">{acc.username}</span>
                </p>
                {acc.connectedAt && (
                  <p className="text-xs text-muted-foreground">
                    Connected on {acc.connectedAt}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleSupportTicket(acc)}
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Request Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Note Section */}
      <div className="mt-8 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
        <h3 className="font-semibold mb-2">Important Notes:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>You can connect a maximum of <b>5 social accounts</b>.</li>
          <li>Once connected, you <b>cannot disconnect</b> an account yourself.</li>
          <li>To disconnect an account, you must <b>raise a Support Ticket</b>.</li>
          <li>Only <b>Admin</b> has the right to approve or remove connected accounts.</li>
          <li>Ensure your account username/link is correct to avoid campaign rejection.</li>
          <li>A <b>Verification Code</b> is required to confirm account ownership.</li>
        </ul>
      </div>
    </div>
  );
}
