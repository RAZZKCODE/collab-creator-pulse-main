import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, DollarSign, Users, Clock, TrendingUp } from "lucide-react";

interface CampaignCardProps {
  campaign: {
    id: string;
    title: string;
    description: string;
    budget: number;
    ratePerMillion: number;
    used: number;
    completion: number;
    platforms: string[];
    maxSubmissions: number;
    maxEarnings: number;
    status: 'active' | 'paused' | 'ended';
    brand: string;
    submissions?: number;
    earnings?: number;
  };
  variant?: 'explore' | 'creator' | 'brand';
}

export function CampaignCard({ campaign, variant = 'explore' }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'paused':
        return 'bg-warning text-warning-foreground';
      case 'ended':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPlatformBadge = (platform: string) => {
    const colors = {
      Instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
      YouTube: 'bg-red-500',
      TikTok: 'bg-black',
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <Card className="hover:shadow-elegant transition-smooth bg-gradient-card border-0 overflow-hidden group">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-smooth">
                {campaign.title}
              </h3>
              <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">by {campaign.brand}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${campaign.ratePerMillion}</div>
            <div className="text-xs text-muted-foreground">per million views</div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {campaign.description}
        </p>

        <div className="flex gap-1 flex-wrap">
          {campaign.platforms.map((platform) => (
            <Badge
              key={platform}
              variant="secondary"
              className={`text-white text-xs ${getPlatformBadge(platform)}`}
            >
              {platform}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {variant === 'creator' && campaign.earnings !== undefined && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">Earnings</span>
              </div>
              <div className="text-lg font-semibold text-success">${campaign.earnings}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Submissions</span>
              </div>
              <div className="text-lg font-semibold">{campaign.submissions || 0}</div>
            </div>
          </div>
        )}

        {variant === 'brand' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Budget Used</span>
              <span className="text-sm font-medium">{campaign.completion}%</span>
            </div>
            <Progress value={campaign.completion} className="h-2" />
            <div className="text-xs text-muted-foreground">
              ${campaign.used} of ${campaign.budget}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
            </div>
            <div className="text-xs text-muted-foreground">Max {campaign.maxSubmissions}</div>
            <div className="text-xs font-medium">submissions</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <DollarSign className="h-3 w-3" />
            </div>
            <div className="text-xs text-muted-foreground">Max ${campaign.maxEarnings}</div>
            <div className="text-xs font-medium">per creator</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Eye className="h-3 w-3" />
            </div>
            <div className="text-xs text-muted-foreground">Budget</div>
            <div className="text-xs font-medium">${campaign.budget}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {variant === 'explore' && (
          <Button className="w-full bg-gradient-primary hover:shadow-glow transition-smooth">
            Join Campaign
          </Button>
        )}
        {variant === 'creator' && (
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button size="sm" className="flex-1 bg-gradient-primary">
              Submit Content
            </Button>
          </div>
        )}
        {variant === 'brand' && (
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button size="sm" className="flex-1 bg-gradient-primary">
              Manage
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}