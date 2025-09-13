import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  subtitle?: string;
  gradient?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  subtitle,
  gradient = false 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={`transition-smooth hover:shadow-elegant ${gradient ? 'bg-gradient-primary text-primary-foreground' : 'bg-gradient-card'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${gradient ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${gradient ? 'text-primary-foreground/80' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${gradient ? 'text-primary-foreground' : 'text-foreground'}`}>
          {value}
        </div>
        {(change || subtitle) && (
          <div className="flex items-center justify-between mt-2">
            {change && (
              <p className={`text-xs ${gradient ? 'text-primary-foreground/80' : getChangeColor()}`}>
                {change}
              </p>
            )}
            {subtitle && (
              <p className={`text-xs ${gradient ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}