import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const myCampaigns = [
  {
    id: 1,
    title: "Gamdom [GENERAL]",
    logo: "https://dummyimage.com/100x100/00aa55/ffffff&text=G",
    earnings: 0.05,
    views: "1.7K",
    completion: 36.96,
    budgetUsed: 3696.42,
    budgetTotal: 10000,
    status: "active",
    submissions: 3,
    rejected: 0,
  },
  {
    id: 2,
    title: "500Casino [GENERAL] 13",
    logo: "https://dummyimage.com/100x100/ff3333/ffffff&text=500",
    earnings: 1.03,
    views: "34K",
    completion: 98.71,
    budgetUsed: 4935.63,
    budgetTotal: 5000,
    status: "active",
    submissions: 5,
    rejected: 1,
  },
  {
    id: 3,
    title: "HypeDrop [GENERAL] 3",
    logo: "https://dummyimage.com/100x100/000000/ffffff&text=HD",
    earnings: 0,
    views: "0",
    completion: 100,
    budgetUsed: 0,
    budgetTotal: 0,
    status: "ended",
    submissions: 2,
    rejected: 0,
  },
];

// Dummy connected accounts
const connectedAccounts = [
  { id: 1, platform: "Instagram", username: "@learnwithraz" },
  { id: 2, platform: "YouTube", username: "noughtytauji" },
  { id: 3, platform: "TikTok", username: "@memmer.47" },
];

export default function MyCampaigns() {
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [reelUrl, setReelUrl] = useState("");

  const toggleAccount = (id: number) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!reelUrl || selectedAccounts.length === 0) {
      toast.error("Please select an account and enter a reel URL!");
      return;
    }
    toast.success("Content submitted successfully 🎉");
    console.log("Submitted:", {
      campaignId: selectedCampaign?.id,
      accounts: selectedAccounts,
      reelUrl,
    });
    setOpenSubmit(false);
    setReelUrl("");
    setSelectedAccounts([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Your Campaigns</h1>
        <p className="text-muted-foreground mt-1">
          Earnings will be credited to your wallet after review. All posts are subject to approval.
        </p>
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myCampaigns.map((c) => (
          <Card key={c.id} className="bg-gradient-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <img
                  src={c.logo}
                  alt={c.title}
                  className="w-12 h-12 rounded-lg border"
                />
                <CardTitle className="text-lg">{c.title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Earnings */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Earnings</p>
                <p className="text-xl font-bold">${c.earnings.toFixed(2)}</p>
                {c.status === "ended" && (
                  <p className="text-xs text-success">✔ Paid Out</p>
                )}
              </div>

              {/* Stats */}
              {c.status !== "ended" && (
                <>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{c.views} views</span>
                    <span>{c.budgetTotal.toLocaleString()} views limit</span>
                  </div>
                  <Progress value={c.completion} />
                  <p className="text-center text-sm font-medium mt-1">
                    {c.completion.toFixed(2)}% campaign completion
                  </p>
                  <p className="text-xs text-center text-muted-foreground">
                    ${c.budgetUsed.toFixed(2)} / ${c.budgetTotal.toLocaleString()}
                  </p>
                </>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-3">
                {/* ✅ Stats button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCampaign(c);
                    setOpenStats(true);
                  }}
                >
                  Stats
                </Button>

                {/* ✅ View Details button */}
                <Link to={`/campaigns/${c.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>

                {/* ✅ Submit button */}
                {c.status === "active" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedCampaign(c);
                      setOpenSubmit(true);
                    }}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Note */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        Can’t see older campaigns? We’re making some updates and they’ll be back soon!
      </p>

      {/* ---- Submit Content Popup ---- */}
      <Dialog open={openSubmit} onOpenChange={setOpenSubmit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Submit Content {selectedCampaign ? `for ${selectedCampaign.title}` : ""}
            </DialogTitle>
          </DialogHeader>

          {/* Accounts */}
          <div className="space-y-4">
            <Label>Select Connected Accounts</Label>
            {connectedAccounts.map((acc) => (
              <div key={acc.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedAccounts.includes(acc.id)}
                  onCheckedChange={() => toggleAccount(acc.id)}
                />
                <span className="text-sm">
                  {acc.platform} - <strong>{acc.username}</strong>
                </span>
              </div>
            ))}
          </div>

          {/* Reel URL */}
          <div className="space-y-2 mt-4">
            <Label>Reel / Video URL</Label>
            <Input
              placeholder="Paste your reel or video link..."
              value={reelUrl}
              onChange={(e) => setReelUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button variant="outline" onClick={() => setOpenSubmit(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---- Stats Popup ---- */}
      <Dialog open={openStats} onOpenChange={setOpenStats}>
        <DialogContent className="sm:max-w-md">
          <div className="relative rounded-lg bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:bg-gray-800">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setOpenStats(false)}
            >
              ✕
            </button>
            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Campaign Stats
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Submissions:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedCampaign?.submissions ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Rejected Submissions:
                </span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {selectedCampaign?.rejected ?? 0}
                </span>
              </div>
            </div>

            <div className="mt-6">
            <Button
  variant="gradient"
  className="w-full"
  onClick={() => {
    setOpenStats(false);
    window.location.href = `/campaigns/${selectedCampaign?.id}/overview`;
  }}
>
  Post Overview
</Button>

              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Views for this campaign update every{" "}
                <span className="font-bold">~6 hours</span>.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
