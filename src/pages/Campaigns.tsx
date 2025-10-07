import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { apiRequest } from "@/utils/api";
import { Video } from "lucide-react";

interface Campaign {
  id: number;
  title: string;
  logo: string;
  earnings: number;
  views: string;
  completion: number;
  budgetUsed: number;
  budgetTotal: number;
  status: "active" | "ended" | string;
  submissions: number;
  rejected: number;
}

interface ConnectedAccount {
  id: number;
  platform: string;
  username: string;
}

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [reelUrl, setReelUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchConnectedAccounts();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/campaigns/user/me");
      setCampaigns(data?.campaigns ?? []);
    } catch (error) {
      console.error("❌ Failed to fetch campaigns:", error);
      toast.error(`Failed to load campaigns: ${error instanceof Error ? error.message : "Unknown error"}`);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectedAccounts = async () => {
    try {
      const data = await apiRequest("/api/auth/connected-accounts");
      setConnectedAccounts(data?.accounts ?? []);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      // fallback demo
      setConnectedAccounts([
        { id: 1, platform: "Instagram", username: "@learnwithraz" },
        { id: 2, platform: "YouTube", username: "noughtytauji" },
        { id: 3, platform: "TikTok", username: "@memmer.47" },
      ]);
    }
  };

  const toggleAccount = (id: number) => {
    setSelectedAccounts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = async () => {
    if (!reelUrl || selectedAccounts.length === 0) {
      toast.error("Please select an account and enter a reel URL!");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(`/api/campaigns/${selectedCampaign?.id}/submissions`, {
        method: "POST",
        body: JSON.stringify({
          accounts: selectedAccounts.map((id) => connectedAccounts.find((acc) => acc.id === id)?.username),
          reel_url: reelUrl,
          metadata: { submitted_from: "web", timestamp: new Date().toISOString() },
        }),
      });

      toast.success("Content submitted successfully! 🎉");
      await fetchCampaigns();
      setOpenSubmit(false);
      setReelUrl("");
      setSelectedAccounts([]);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit content");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2">Loading campaigns...</span>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold">Your Campaigns</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Earnings will be credited to your wallet after review. All posts are subject to approval.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {campaigns.length === 0 ? (
          <div className="col-span-full text-center py-10 sm:py-14">
            <div className="mb-4">
              <Video className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">No campaigns joined yet</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
              Explore available campaigns and join them to start earning!
            </p>
            <Link to="/explore">
              <Button variant="gradient" size="sm" className="w-full sm:w-auto">
                Explore Campaigns
              </Button>
            </Link>
          </div>
        ) : (
          campaigns.map((c) => (
            <Card key={c.id} className="bg-gradient-card shadow-sm sm:shadow-md flex flex-col">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <img
                    src={c.logo || "/placeholder.svg"}
                    alt={c.title}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border object-cover shrink-0"
                  />
                  <CardTitle className="text-base sm:text-lg leading-tight line-clamp-1">{c.title}</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 sm:space-y-4 flex flex-col grow">
                {/* Earnings */}
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">Your Earnings</p>
                  <p className="text-lg sm:text-xl font-bold">${(c.earnings || 0).toFixed(2)}</p>
                  {c.status === "ended" && <p className="text-xs text-success">✔ Paid Out</p>}
                </div>

                {/* Stats */}
                {c.status !== "ended" && (
                  <>
                    <div className="flex justify-between text-[11px] sm:text-xs text-muted-foreground">
                      <span className="truncate">{c.views || "0"} views</span>
                      <span className="truncate">{(c.budgetTotal || 0).toLocaleString()} limit</span>
                    </div>
                    <Progress value={c.completion || 0} className="h-2" />
                    <p className="text-center text-xs sm:text-sm font-medium">
                      {(c.completion || 0).toFixed(2)}% completion
                    </p>
                    <p className="text-xs text-center text-muted-foreground">
                      ${(c.budgetUsed || 0).toFixed(2)} / ${(c.budgetTotal || 0).toLocaleString()}
                    </p>
                  </>
                )}

                {/* Actions */}
                <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
                    onClick={() => {
                      setSelectedCampaign(c);
                      setOpenStats(true);
                    }}
                  >
                    Stats
                  </Button>

                  <Link to={`/campaigns/${c.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm py-2 sm:py-2.5">
                      View Details
                    </Button>
                  </Link>

                  {c.status === "active" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
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
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4 sm:mt-6 px-4">
        Can't see older campaigns? We're making some updates and they'll be back soon!
      </p>

      {/* Submit Content Dialog */}
      <Dialog open={openSubmit} onOpenChange={setOpenSubmit}>
        <DialogContent className="w-[92vw] sm:w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Submit Content {selectedCampaign ? `for ${selectedCampaign.title}` : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4">
            <Label className="text-sm sm:text-base">Select Connected Accounts</Label>
            <div className="space-y-2 sm:space-y-3">
              {connectedAccounts.map((acc) => (
                <div key={acc.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedAccounts.includes(acc.id)}
                    onCheckedChange={() => toggleAccount(acc.id)}
                    id={`acc-${acc.id}`}
                  />
                  <label htmlFor={`acc-${acc.id}`} className="text-sm cursor-pointer">
                    {acc.platform} - <strong>{acc.username}</strong>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label className="text-sm sm:text-base">Reel / Video URL</Label>
            <Input
              placeholder="Paste your reel or video link..."
              value={reelUrl}
              onChange={(e) => setReelUrl(e.target.value)}
              className="text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end mt-6 gap-2">
            <Button variant="outline" onClick={() => setOpenSubmit(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog open={openStats} onOpenChange={setOpenStats}>
        <DialogContent className="w-[92vw] sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
          <div className="relative rounded-lg bg-white/80 p-4 sm:p-6 shadow-xl backdrop-blur-sm dark:bg-gray-800">
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-lg"
              onClick={() => setOpenStats(false)}
            >
              ✕
            </button>
            <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white pr-8">
              Campaign Stats
            </h3>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Total Submissions:</span>
                <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  {selectedCampaign?.submissions ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Rejected Submissions:</span>
                <span className="font-semibold text-red-600 dark:text-red-400 text-sm sm:text-base">
                  {selectedCampaign?.rejected ?? 0}
                </span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
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

              <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Views for this campaign update every <span className="font-bold">~6 hours</span>.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
