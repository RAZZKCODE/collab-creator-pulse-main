import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy submissions data
const submissionsData: Record<string, any[]> = {
  "1": [
    { id: 1, platform: "Instagram", link: "https://instagram.com/reel/abc1", views: 754, date: "08/30/2025" },
    { id: 2, platform: "Instagram", link: "https://instagram.com/reel/abc2", views: 21, date: "08/30/2025" },
    { id: 3, platform: "Instagram", link: "https://instagram.com/reel/abc3", views: 911, date: "08/30/2025" },
  ],
  "2": [
    { id: 1, platform: "YouTube", link: "https://youtube.com/watch?v=xyz", views: 1200, date: "08/28/2025" },
  ],
};

export default function CampaignOverview() {
  const { id } = useParams(); // campaign id
  const submissions = submissionsData[id || "1"] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Campaign Overview</h1>
        <p className="text-muted-foreground mt-1">
          View all submissions for this campaign
        </p>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submitted Content</CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Submission</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Submitted On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length > 0 ? (
                submissions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.platform}</TableCell>
                    <TableCell>
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Content
                      </a>
                    </TableCell>
                    <TableCell>{s.views}</TableCell>
                    <TableCell>{s.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No submissions yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
