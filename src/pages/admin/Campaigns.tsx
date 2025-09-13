// frontend/src/components/Campaigns.tsx
import { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

const API_BASE = "http://192.168.31.31:5000/api/campaigns";

function normalizePlatforms(field: any) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    return typeof field === "string" ? JSON.parse(field) : [];
  } catch {
    return typeof field === "string" ? field.split(",").map(s => s.trim()) : [];
  }
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState("");
  const [budget, setBudget] = useState("");
  const [rate, setRate] = useState("");
  const [maxSubmissions, setMaxSubmissions] = useState("");
  const [maxEarningsPerCreator, setMaxEarningsPerCreator] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");
  const [editCampaign, setEditCampaign] = useState<any | null>(null);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_BASE}/`);
      if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
      const data = await res.json();
      const normalized = data.map((c: any) => ({ ...c, platforms: normalizePlatforms(c.platforms) }));
      setCampaigns(normalized);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      toast.error("Failed to fetch campaigns ❌");
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const togglePlatform = (p: string, isEdit = false) => {
    if (isEdit && editCampaign) {
      const cur = editCampaign.platforms ?? [];
      const next = cur.includes(p) ? cur.filter((x: string) => x !== p) : [...cur, p];
      setEditCampaign({ ...editCampaign, platforms: next });
    } else {
      setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
    }
  };

  const handleCreate = async () => {
    if (!title || !budget || !rate || platforms.length === 0) {
      toast.error("Please fill all required fields ❌"); return;
    }
    const newCampaign = {
      title, description, brand_name: brandName, logo_url: logo,
      budget_total: Number(budget), budget_used: 0, rate_per_million: Number(rate),
      max_submissions: maxSubmissions ? Number(maxSubmissions) : null,
      max_earnings_per_creator: maxEarningsPerCreator ? Number(maxEarningsPerCreator) : null,
      platforms, status, start_date: startDate || null, end_date: endDate || null,
    };
    try {
      const res = await fetch(API_BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCampaign) });
      if (!res.ok) { const errText = await res.text(); console.error("Create error:", errText); toast.error("Failed to create campaign ❌"); return; }
      const data = await res.json(); data.platforms = normalizePlatforms(data.platforms);
      setCampaigns((prev) => [data, ...prev]); toast.success(`Campaign "${data.title}" created ✅`);
      setTitle(""); setDescription(""); setBrandName(""); setBudget(""); setRate(""); setMaxSubmissions(""); setMaxEarningsPerCreator(""); setPlatforms([]); setLogo(""); setStartDate(""); setEndDate(""); setStatus("active");
    } catch (err) { console.error("Error creating campaign:", err); toast.error("Failed to create campaign ❌"); }
  };

  const handleUpdate = async () => {
    if (!editCampaign) return;

    // preserve existing budget_used if UI doesn't change it
    const existing = campaigns.find((c) => c.id === editCampaign.id);
    const preservedBudgetUsed = existing?.budget_used ?? editCampaign.budget_used ?? 0;

    const payload = {
      ...editCampaign,
      platforms: normalizePlatforms(editCampaign.platforms),
      budget_total: Number(editCampaign.budget_total || 0),
      // explicitly include budget_used
      budget_used: typeof editCampaign.budget_used === "number" ? editCampaign.budget_used : Number(preservedBudgetUsed || 0),
      rate_per_million: Number(editCampaign.rate_per_million || 0),
      max_submissions: editCampaign.max_submissions ? Number(editCampaign.max_submissions) : null,
      max_earnings_per_creator: editCampaign.max_earnings_per_creator ? Number(editCampaign.max_earnings_per_creator) : null
    };

    try {
      const res = await fetch(`${API_BASE}/${editCampaign.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const text = await res.text(); console.error("Update failed:", text); toast.error("Update failed ❌"); return; }
      const data = await res.json(); data.platforms = normalizePlatforms(data.platforms);
      setCampaigns((prev) => prev.map((c) => (c.id === data.id ? { ...c, ...data } : c))); setEditCampaign(null); toast.success(`Campaign "${data.title}" updated ✅`);
    } catch (err) { console.error("Error updating campaign:", err); toast.error("Update failed ❌"); }
  };

  const handleFinish = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/finish`, { method: "PUT" });
      if (!res.ok) { const txt = await res.text(); console.error("Finish failed:", txt); toast.error("Failed to finish campaign ❌"); return; }
      setCampaigns((prev) => prev.filter((c) => c.id !== id)); setSelectedCampaigns((prev) => prev.filter((x) => x !== id)); toast.success("Campaign moved to Finished 🗂️");
    } catch (err) { console.error("Error finishing campaign:", err); toast.error("Failed to finish campaign ❌"); }
  };

  const handleFinishMultiple = async () => {
    if (selectedCampaigns.length === 0) { toast.error("No campaigns selected ❌"); return; }
    try {
      const promises = selectedCampaigns.map((id) => fetch(`${API_BASE}/${id}/finish`, { method: "PUT" }).then(async (res) => { if (!res.ok) { const t = await res.text(); throw new Error(`Failed id ${id}: ${t}`); } return id; }));
      const finishedIds = await Promise.all(promises);
      setCampaigns((prev) => prev.filter((c) => !finishedIds.includes(c.id))); setSelectedCampaigns([]); toast.success("Selected campaigns moved to Finished ✅");
    } catch (err) { console.error("Error finishing multiple:", err); toast.error("Some campaigns failed to finish ❌"); fetchCampaigns(); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) { const txt = await res.text(); console.error("Delete failed:", txt); toast.error("Failed to delete campaign ❌"); return; }
      setCampaigns((prev) => prev.filter((c) => c.id !== id)); setSelectedCampaigns((prev) => prev.filter((x) => x !== id)); toast.success("Campaign permanently deleted ✅");
    } catch (err) { console.error("Error deleting campaign:", err); toast.error("Failed to delete campaign ❌"); }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = Object.values(campaign).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectCampaign = (id: number) => setSelectedCampaigns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const openEdit = (c: any) => setEditCampaign({
    ...c,
    platforms: normalizePlatforms(c.platforms),
    budget_total: c.budget_total ?? 0,
    // ensure budget_used exists and is numeric so UI can display it
    budget_used: typeof c.budget_used === "number" ? c.budget_used : (c.budget_used ? Number(c.budget_used) : 0),
    rate_per_million: c.rate_per_million ?? 0,
    max_submissions: c.max_submissions ?? null,
    max_earnings_per_creator: c.max_earnings_per_creator ?? null,
    status: c.status ?? "active",
    start_date: c.start_date ? c.start_date.split?.("T")?.[0] ?? c.start_date : "",
    end_date: c.end_date ? c.end_date.split?.("T")?.[0] ?? c.end_date : "",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Campaign Management</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage all brand campaigns</p>
        </div>

        <div className="flex items-center gap-2">
          <Input placeholder="Search campaigns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="min-w-[220px]" />

          <select className="p-2 rounded-md border" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>

          {selectedCampaigns.length > 0 && (
            <Button variant="destructive" onClick={handleFinishMultiple}>Finish {selectedCampaigns.length} Selected</Button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Campaign</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Create New Campaign</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Label>Title *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                <Label>Description</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label>Brand Name</Label>
                    <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Logo URL</Label>
                    <Input value={logo} onChange={(e) => setLogo(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label>Total Budget ($) *</Label>
                    <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
                  </div>
                  <div>
                    <Label>Rate per 1M ($) *</Label>
                    <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label>Max Submissions</Label>
                    <Input type="number" value={maxSubmissions} onChange={(e) => setMaxSubmissions(e.target.value)} />
                  </div>
                  <div>
                    <Label>Max Earnings Per Creator ($)</Label>
                    <Input type="number" value={maxEarningsPerCreator} onChange={(e) => setMaxEarningsPerCreator(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label>Start Date</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Platforms *</Label>
                  <div className="flex gap-3 mt-2">
                    {['Instagram','YouTube','TikTok'].map((p) => (
                      <label className="flex items-center gap-2" key={p}>
                        <Checkbox checked={platforms.includes(p)} onCheckedChange={() => togglePlatform(p)} />
                        <span>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <select className="w-full p-2 rounded-md border" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <Button className="w-full" onClick={handleCreate}>Create Campaign</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table for md+ screens */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>All campaigns across your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Budget Total</TableHead>
                    <TableHead>Budget Used</TableHead>
                    <TableHead>Rate /1M</TableHead>
                    <TableHead>Max Sub</TableHead>
                    <TableHead>Max Earn/Creator</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((c) => (
                    <TableRow key={c.id} className="align-top">
                      <TableCell>{c.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{c.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{c.description}</TableCell>
                      <TableCell>{c.brand_name}</TableCell>
                      <TableCell>{c.logo_url ? (<a className="text-blue-500 underline" href={c.logo_url} target="_blank" rel="noreferrer">link</a>) : '—'}</TableCell>
                      <TableCell>${Number(c.budget_total || 0).toFixed(2)}</TableCell>
                      <TableCell>${Number(c.budget_used || 0).toFixed(2)}</TableCell>
                      <TableCell>${Number(c.rate_per_million || 0).toFixed(2)}</TableCell>
                      <TableCell>{c.max_submissions ?? '—'}</TableCell>
                      <TableCell>{c.max_earnings_per_creator ?? '—'}</TableCell>
                      <TableCell>{(c.platforms || []).join(', ')}</TableCell>
                      <TableCell>{c.status}</TableCell>
                      <TableCell>{c.start_date ? new Date(c.start_date).toLocaleDateString() : '—'}</TableCell>
                      <TableCell>{c.end_date ? new Date(c.end_date).toLocaleDateString() : '—'}</TableCell>
                      <TableCell>{c.created_by ?? '—'}</TableCell>
                      <TableCell>{c.created_at ? new Date(c.created_at).toLocaleString() : '—'}</TableCell>
                      <TableCell>{c.updated_at ? new Date(c.updated_at).toLocaleString() : '—'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEdit(c)}><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast('View not implemented yet')}><Eye className="w-4 h-4 mr-2" /> View</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleFinish(c.id)}>Finish</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        {filteredCampaigns.map((c) => (
          <Card key={c.id}>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{c.title} <span className="text-sm text-muted-foreground">#{c.id}</span></h3>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm">{c.status}</div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => openEdit(c)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleFinish(c.id)}>Finish</Button>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div><strong>Brand:</strong> {c.brand_name ?? '—'}</div>
                <div><strong>Budget:</strong> ${Number(c.budget_total || 0).toFixed(2)}</div>
                <div><strong>Used:</strong> ${Number(c.budget_used || 0).toFixed(2)}</div>
                <div><strong>Rate/1M:</strong> ${Number(c.rate_per_million || 0).toFixed(2)}</div>
                <div><strong>Max Sub:</strong> {c.max_submissions ?? '—'}</div>
                <div><strong>Max Earn:</strong> {c.max_earnings_per_creator ?? '—'}</div>
                <div className="col-span-2"><strong>Platforms:</strong> {(c.platforms || []).join(', ')}</div>
                <div><strong>Start:</strong> {c.start_date ? new Date(c.start_date).toLocaleDateString() : '—'}</div>
                <div><strong>End:</strong> {c.end_date ? new Date(c.end_date).toLocaleDateString() : '—'}</div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">Created by {c.created_by ?? '—'} on {c.created_at ? new Date(c.created_at).toLocaleString() : '—'}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editCampaign && (
        <Dialog open={!!editCampaign} onOpenChange={(open) => { if (!open) setEditCampaign(null); }}>
          <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Campaign</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <Label>Title</Label>
              <Input value={editCampaign.title || ''} onChange={(e) => setEditCampaign({ ...editCampaign, title: e.target.value })} />
              <Label>Description</Label>
              <Input value={editCampaign.description || ''} onChange={(e) => setEditCampaign({ ...editCampaign, description: e.target.value })} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Brand</Label>
                  <Input value={editCampaign.brand_name || ''} onChange={(e) => setEditCampaign({ ...editCampaign, brand_name: e.target.value })} />
                </div>
                <div>
                  <Label>Logo URL</Label>
                  <Input value={editCampaign.logo_url || ''} onChange={(e) => setEditCampaign({ ...editCampaign, logo_url: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Total Budget ($)</Label>
                  <Input type="number" value={editCampaign.budget_total ?? ''} onChange={(e) => setEditCampaign({ ...editCampaign, budget_total: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Rate /1M ($)</Label>
                  <Input type="number" value={editCampaign.rate_per_million ?? ''} onChange={(e) => setEditCampaign({ ...editCampaign, rate_per_million: Number(e.target.value) })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Max Submissions</Label>
                  <Input type="number" value={editCampaign.max_submissions ?? ''} onChange={(e) => setEditCampaign({ ...editCampaign, max_submissions: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Max Earnings Per Creator</Label>
                  <Input type="number" value={editCampaign.max_earnings_per_creator ?? ''} onChange={(e) => setEditCampaign({ ...editCampaign, max_earnings_per_creator: Number(e.target.value) })} />
                </div>
              </div>

              <div>
                <Label>Platforms</Label>
                <div className="flex gap-3 mt-2">
                  {['Instagram','YouTube','TikTok'].map((p) => (
                    <label key={p} className="flex items-center gap-2">
                      <Checkbox checked={editCampaign.platforms?.includes(p)} onCheckedChange={() => togglePlatform(p, true)} />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <select className="w-full p-2 rounded-md border" value={editCampaign.status || 'active'} onChange={(e) => setEditCampaign({ ...editCampaign, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={editCampaign.start_date || ''} onChange={(e) => setEditCampaign({ ...editCampaign, start_date: e.target.value })} />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" value={editCampaign.end_date || ''} onChange={(e) => setEditCampaign({ ...editCampaign, end_date: e.target.value })} />
                </div>
              </div>

            {/* Editable budget_used */}
<div>
  <Label>Budget Used ($)</Label>
  <Input
    type="number"
    value={editCampaign.budget_used ?? 0}
    onChange={(e) =>
      setEditCampaign({
        ...editCampaign,
        // empty string -> 0, otherwise convert to number
        budget_used: e.target.value === "" ? 0 : Number(e.target.value),
      })
    }
  />
  <p className="text-xs text-muted-foreground mt-1">
    You can edit the amount already used (will be clamped to total budget on save).
  </p>
</div>


              <Button className="w-full" onClick={handleUpdate}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
