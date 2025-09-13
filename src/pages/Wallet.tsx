import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  Gift, 
  Upload, 
  AlertCircle, 
  Clock, 
  ArrowDownLeft, 
  ArrowUpRight
} from "lucide-react";

// Mock data
const balance = {
  campaignBalance: 2.21,
  referralBalance: 0.0,
  minimumWithdrawal: 50,
};

const transactions = [
  { id: 1, type: "earning", description: "Campaign Earnings - Jammable", amount: 45.0, status: "completed", date: "2 days ago" },
  { id: 2, type: "payout", description: "Payout to PayPal", amount: -50.0, status: "processing", date: "5 days ago" },
  { id: 3, type: "referral", description: "Referral Bonus - New Creator", amount: 10.0, status: "completed", date: "1 week ago" },
];

export default function Balance() {
  const totalBalance = balance.campaignBalance + balance.referralBalance;

  const getTransactionIcon = (type: string) => {
    if (type === "earning" || type === "referral") {
      return <ArrowDownLeft className="h-4 w-4 text-success" />;
    }
    return <ArrowUpRight className="h-4 w-4 text-destructive" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "processing":
        return <Badge className="bg-warning text-warning-foreground">Processing</Badge>;
      case "failed":
        return <Badge className="bg-destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Balance</h1>
          <p className="text-muted-foreground mt-1">
            Track your campaign earnings and referral income
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="gradient" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Campaign Balance</p>
            <div className="flex items-center justify-between mt-1">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold">${balance.campaignBalance.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Referral Balance</p>
            <div className="flex items-center justify-between mt-1">
              <Gift className="h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold">${balance.referralBalance.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <div className="flex items-center justify-between mt-1">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold text-primary">${totalBalance.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Info */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Withdrawal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Minimum withdrawal amount is <strong>${balance.minimumWithdrawal}</strong>. 
            A 3% platform service fee is applied to all withdrawals to cover operational costs.
          </p>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                    {getStatusBadge(tx.status)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.amount > 0 ? "text-success" : "text-foreground"}`}>
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
