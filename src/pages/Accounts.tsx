import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Youtube, Music2, Plus, HelpCircle } from "lucide-react";
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

const initialAccounts = [
  {
    id: 1,
    platform: "Instagram",
    username: "@learnwithraz",
    connected: true,
    connectedAt: "April 27, 2025",
    icon: Instagram,
    color: "text-pink-500",
  },
  {
    id: 2,
    platform: "Instagram",
    username: "@memmer.47",
    connected: true,
    connectedAt: "July 2, 2025",
    icon: Instagram,
    color: "text-pink-500",
  },
  {
    id: 3,
    platform: "YouTube",
    username: "noughtytauji",
    connected: true,
    connectedAt: "July 19, 2025",
    icon: Youtube,
    color: "text-red-500",
  },
];

export default function Accounts() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerifyCode(code);
    toast.success(`Your verification code is ${code}`);
  };

  const handleConnect = () => {
    if (!platform || !username) {
      toast.error("Please select platform and enter username/link");
      return;
    }

    if (accounts.length >= 5) {
      toast.error("You can only connect a maximum of 5 accounts ❌");
      return;
    }

    const newAccount = {
      id: accounts.length + 1,
      platform,
      username,
      connected: true,
      connectedAt: new Date().toLocaleDateString(),
      icon:
        platform === "Instagram"
          ? Instagram
          : platform === "YouTube"
          ? Youtube
          : Music2,
      color:
        platform === "Instagram"
          ? "text-pink-500"
          : platform === "YouTube"
          ? "text-red-500"
          : "text-black",
    };

    setAccounts([...accounts, newAccount]);
    toast.success(`${platform} account connected successfully 🎉`);

    // Reset fields
    setPlatform("");
    setUsername("");
    setVerifyCode("");
  };

  const handleSupportTicket = (acc: any) => {
    toast.info(
      `A support ticket has been generated to disconnect ${acc.username}. Admin will review it.`
    );
  };

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
                  disabled={accounts.length >= 5}
                >
                  Connect
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Accounts List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => (
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
                {/* ❌ User can't disconnect directly */}
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
        ))}
      </div>

      {/* ✅ Note Section */}
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
