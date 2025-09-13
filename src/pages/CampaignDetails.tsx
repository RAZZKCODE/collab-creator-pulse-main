// frontend/src/components/CampaignDetails.tsx
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

// API base - change if needed
const API_BASE = "http://192.168.31.31:5000/api/campaigns";

type CampaignAPI = {
  id: number | string;
  title?: string;
  banner?: string;
  logo_url?: string;
  rate_per_million?: number | string;
  budget_total?: number | string;
  budget_used?: number | string; // may be raw amount
  max_submissions?: number | null;
  max_earnings_per_creator?: number | null;
  description?: string;
  discord_link?: string | null;
  discordLink?: string | null;
  reactions?: { likes?: number; dislikes?: number; comments?: number };
  platforms?: string[] | string;
  status?: string;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

// Example connected accounts (replace with real connected accounts if available)
const connectedAccountsMock = [
  { id: 1, platform: "Instagram", username: "@learnwithraz" },
  { id: 2, platform: "YouTube", username: "noughtytauji" },
  { id: 3, platform: "TikTok", username: "@memmer.47" },
];

function normalizePlatforms(field: any): string[] {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    return typeof field === "string" ? JSON.parse(field) : [];
  } catch {
    return typeof field === "string" ? field.split(",").map((s) => s.trim()) : [];
  }
}

function toNumber(v: any): number {
  if (v === undefined || v === null || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<CampaignAPI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // submit dialog & form state
  const [open, setOpen] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [reelUrl, setReelUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // connected accounts - replace with real fetch if you have an API
  const [connectedAccounts] = useState(connectedAccountsMock);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const fetchCampaign = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!mounted) return;

        // normalize common fields
        const normalized: CampaignAPI = {
          ...data,
          banner: (data.logo_url as string) || data.banner || "",
          rate_per_million: toNumber(data.rate_per_million),
          budget_total: toNumber(data.budget_total),
          // budget_used in DB may be absolute amount (e.g. dollars used). We keep it as number.
          budget_used: toNumber(data.budget_used),
          max_submissions: data.max_submissions ?? null,
          max_earnings_per_creator: data.max_earnings_per_creator ?? null,
          platforms: normalizePlatforms(data.platforms),
          description: data.description ?? "",
          discordLink: data.discord_link ?? data.discordLink ?? null,
          reactions: data.reactions ?? { likes: 0, dislikes: 0, comments: 0 },
        };

        setCampaign(normalized);
      } catch (err: any) {
        console.error("Failed to fetch campaign:", err);
        setError(err.message || "Failed to fetch campaign");
        setCampaign(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCampaign();
    return () => {
      mounted = false;
    };
  }, [id]);

  const pctCompletion = useMemo(() => {
    if (!campaign) return 0;
    const used = toNumber(campaign.budget_used);
    const total = toNumber(campaign.budget_total);
    if (total <= 0) return 0;
    return Math.max(0, Math.min(100, (used / total) * 100));
  }, [campaign]);

  const toggleAccount = (accId: number) => {
    setSelectedAccounts((prev) => (prev.includes(accId) ? prev.filter((x) => x !== accId) : [...prev, accId]));
  };

  const handleSubmit = async () => {
    if (!reelUrl || selectedAccounts.length === 0) {
      toast.error("Please select an account and enter a reel URL!");
      return;
    }
    if (!campaign) {
      toast.error("No campaign loaded");
      return;
    }

    setSubmitting(true);
    try {
      // Attempt to call backend submission endpoint.
      // If your API uses a different path, change this URL accordingly.
      const res = await fetch(`${API_BASE}/${campaign.id}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accounts: selectedAccounts,
          reel_url: reelUrl,
          submitted_at: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        toast.success("Content submitted successfully 🎉");
        // reset
        setOpen(false);
        setReelUrl("");
        setSelectedAccounts([]);
        // Optionally refresh campaign to show updated budget_used etc.
        // refetch campaign
        const updatedRes = await fetch(`${API_BASE}/${campaign.id}`);
        if (updatedRes.ok) {
          const updated = await updatedRes.json();
          setCampaign((prev) => ({ ...(prev || {}), ...updated }));
        }
      } else {
        // handle 404/422 etc.
        const text = await res.text();
        console.warn("Submission failed:", text);
        // Fallback: show success toast but indicate backend not available
        if (res.status === 404) {
          toast.error("Submission endpoint not implemented on server. (Frontend demo only)");
        } else {
          toast.error("Submission failed: " + (text || res.status));
        }
      }
    } catch (err: any) {
      console.error("Failed to submit:", err);
      toast.error("Network error while submitting");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading campaign...</p>;
  if (error) return <p className="mt-10 text-center text-destructive">Error: {error}</p>;
  if (!campaign) return <p className="mt-10 text-center">Campaign not found</p>;

  const reactions = campaign.reactions ?? { likes: 0, dislikes: 0, comments: 0 };
  const platforms = normalizePlatforms(campaign.platforms);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="w-full h-52 md:h-72 rounded-lg overflow-hidden bg-muted">
        <img
          src={campaign.banner || campaign.logo_url || `https://dummyimage.com/1200x300/cccccc/000&text=${encodeURIComponent((campaign.title||"C").charAt(0))}`}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold">{campaign.title}</h1>

      {/* Rate + Progress */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Rate */}
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Rate per Million Views</p>
            <p className="text-4xl font-bold text-red-500 mt-2">
              ${toNumber(campaign.rate_per_million).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Per million views across all supported platforms
            </p>
            <div className="mt-4">
              <Button variant="destructive" onClick={() => setOpen(true)}>Submit Content</Button>
            </div>

            {/* Reactions */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">How do you feel about this campaign?</p>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-green-500" /> {reactions.likes}
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="h-4 w-4 text-red-500" /> {reactions.dislikes}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-gray-500" /> {reactions.comments}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <CardTitle className="mb-4">Campaign Progress</CardTitle>
            <Progress value={pctCompletion} />
            <div className="flex justify-between mt-2 text-sm">
              <span>Used: ${toNumber(campaign.budget_used).toFixed(2)}</span>
              <span>Total: ${toNumber(campaign.budget_total).toFixed(2)}</span>
            </div>
            <p className="text-right text-sm mt-1 text-red-500 font-medium">
              {pctCompletion.toFixed(0)}% Complete
            </p>
            <div className="mt-3 text-xs text-muted-foreground">
              Platforms: {platforms.join(", ") || "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Details */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Max Submissions</p>
            <p className="font-medium text-red-500">
              {campaign.max_submissions ?? campaign.maxSubmissions ?? "—"} per social media account
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Max Earnings</p>
            <p className="font-medium text-red-500">
              ${campaign.max_earnings_per_creator ?? campaign.maxEarningsCreator ?? "—"} per creator
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Description</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap">{campaign.description}</pre>
          {campaign.discordLink && (
            <div className="mt-3">
              <Button asChild variant="gradient">
                <a href={campaign.discordLink} target="_blank" rel="noreferrer">Join Discord Server</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Content Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Content</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Select Connected Accounts</Label>
            {connectedAccounts.map((acc) => (
              <div key={acc.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedAccounts.includes(acc.id)}
                  onCheckedChange={() => toggleAccount(acc.id)}
                />
                <span className="text-sm">{acc.platform} - <strong>{acc.username}</strong></span>
              </div>
            ))}
          </div>

          <div className="space-y-2 mt-4">
            <Label>Reel / Video URL</Label>
            <Input
              placeholder="Paste your reel or video link..."
              value={reelUrl}
              onChange={(e) => setReelUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
