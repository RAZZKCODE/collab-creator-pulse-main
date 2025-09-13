// frontend/src/components/Explore.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const API_BASE = "http://192.168.31.31:5000/api/campaigns"; // change if needed

type Campaign = {
  id: number | string;
  title?: string;
  logo_url?: string;
  description?: string;
  budget_total?: number | string;
  budget_used?: number | string;
  rate_per_million?: number | string;
  tag?: string;
  creators?: number;
  platforms?: string[] | string;
  status?: string;
  start_date?: string | null;
  end_date?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  max_submissions?: number | null;
  max_earnings_per_creator?: number | null;
};

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
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function Explore() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState<"rate" | "budget">("rate");

  useEffect(() => {
    let mounted = true;
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!mounted) return;

        // Normalize each campaign
        const normalized: Campaign[] = (data || []).map((c: any) => ({
          ...c,
          id: c.id,
          title: c.title ?? c.name ?? "Untitled",
          logo_url: c.logo_url || c.logo || "",
          description: c.description || "",
          budget_total: toNumber(c.budget_total),
          budget_used: Math.min(100, Math.round((toNumber(c.budget_used) / (toNumber(c.budget_total) || 1)) * 100)), // percent used for UI
          rate_per_million: toNumber(c.rate_per_million),
          platforms: normalizePlatforms(c.platforms),
          status: c.status || "active",
          start_date: c.start_date || null,
          end_date: c.end_date || null,
          created_by: c.created_by || null,
          created_at: c.created_at || null,
          updated_at: c.updated_at || null,
          max_submissions: c.max_submissions ?? null,
          max_earnings_per_creator: c.max_earnings_per_creator ?? null,
        }));
        setCampaigns(normalized);
      } catch (err: any) {
        console.error("Failed to fetch campaigns:", err);
        setError(err.message || "Failed to fetch campaigns");
        toast.error("Failed to load campaigns");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCampaigns();
    return () => {
      mounted = false;
    };
  }, []);

  // derived list: search + platform filter
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return campaigns.filter((c) => {
      const matchesSearch = !term
        || (c.title || "").toLowerCase().includes(term)
        || (c.description || "").toLowerCase().includes(term)
        || (c.brand_name || "").toLowerCase().includes(term);

      const matchesPlatform =
        selectedPlatform === "all" ||
        (normalizePlatforms(c.platforms).map((p) => p.toLowerCase()).includes(selectedPlatform.toLowerCase()));

      return matchesSearch && matchesPlatform;
    });
  }, [campaigns, searchTerm, selectedPlatform]);

  const sortedCampaigns = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "rate") return toNumber(b.rate_per_million) - toNumber(a.rate_per_million);
      if (sortBy === "budget") return toNumber(b.budget_total) - toNumber(a.budget_total);
      return 0;
    });
  }, [filtered, sortBy]);

  // counts
  const activeCount = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
            <TrendingUp className="h-3 w-3 mr-1" />
            {activeCount} Active
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-6 bg-gradient-card rounded-lg shadow-card">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rate">Highest Rate</SelectItem>
            <SelectItem value="budget">Highest Budget</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading / Error */}
      {loading && <div className="text-sm text-muted-foreground">Loading campaigns...</div>}
      {error && <div className="text-sm text-destructive">Error: {error}</div>}

      {/* Campaigns List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {!loading && sortedCampaigns.length === 0 && (
          <div className="text-sm text-muted-foreground">No campaigns found.</div>
        )}

        {sortedCampaigns.map((c) => {
          const platforms = normalizePlatforms(c.platforms);
          const pctUsed = toNumber(c.budget_used); // our normalized percent
          return (
            <Card key={c.id} className="flex items-center p-4 shadow-md">
              <img
                src={c.logo_url || `https://dummyimage.com/80x80/cccccc/000000&text=${encodeURIComponent((c.title||"C").charAt(0))}`}
                alt={c.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <CardContent className="ml-4 w-full space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{c.title}</h3>
                  <Badge variant="outline">{platforms.join(", ") || "—"}</Badge>
                </div>

                {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}

                <div className="flex gap-4 text-sm">
                  <div>Budget: ${toNumber(c.budget_total).toLocaleString()}</div>
                  <div>Rate/1M: ${toNumber(c.rate_per_million).toLocaleString()}</div>
                </div>

                <Progress value={Math.max(0, Math.min(100, pctUsed))} className="h-2" />
                <p className="text-xs text-muted-foreground">{pctUsed}% used</p>

                <div className="flex justify-between items-center gap-2 mt-2">
                  <div className="text-xs text-muted-foreground">Creators: {c.creators ?? "—"}</div>
                  <div className="flex gap-2">
                    <Link to={`/campaigns/${c.id}`}>
                      <Button variant="outline" size="sm">Details</Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => toast("Join flow not implemented")}>Join</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
