import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { apiRequest } from "@/utils/api";
import { PlusCircle, RefreshCw, Trash2, Link as LinkIcon, Users, Heart, AlertCircle } from 'lucide-react';
import { FaInstagram, FaYoutube, FaTiktok, FaTwitter, FaFacebook } from 'react-icons/fa';
import { ConnectAccountDialog } from '@/components/ConnectAccountDialog';

type Platform = 'Instagram' | 'YouTube' | 'TikTok' | 'Twitter' | 'Facebook';

interface ConnectedAccount {
    id: number;
    platform: Platform;
    username: string;
    followers_count: number;
    engagement_rate: number;
    last_synced_at: string;
    status: 'pending' | 'verified' | 'failed';
}

const platformIcons: Record<Platform, React.ElementType> = {
    Instagram: FaInstagram,
    YouTube: FaYoutube,
    TikTok: FaTiktok,
    Twitter: FaTwitter,
    Facebook: FaFacebook,
};

const platformColors: Record<Platform, string> = {
    Instagram: 'text-[#E1306C]',
    YouTube: 'text-[#FF0000]',
    TikTok: 'text-[#000000] dark:text-[#FFFFFF]',
    Twitter: 'text-[#1DA1F2]',
    Facebook: 'text-[#1877F2]',
};

export default function Accounts() {
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await apiRequest('/api/accounts');
            setAccounts(data?.accounts || []);
        } catch (error) {
            console.error("❌ Failed to fetch accounts:", error);
            toast.error(`Failed to load accounts: ${error instanceof Error ? error.message : "Unknown error"}`);
            setAccounts([]); // Set to empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleDisconnect = async (id: number) => {
        try {
            await apiRequest(`/api/accounts/${id}`, { method: 'DELETE' });
            toast.success("Account disconnected successfully!");
            fetchAccounts(); // Refresh the list
        } catch (error) {
            toast.error(`Failed to disconnect account: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    return (
        <>
            <ConnectAccountDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={fetchAccounts} // Refresh list on success
            />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Connected Accounts</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your social media accounts to showcase your reach to brands.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={fetchAccounts} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Connect New Account
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <AccountsSkeleton />
                ) : accounts.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardHeader>
                            <CardTitle>No Accounts Connected</CardTitle>
                            <CardDescription>Connect your social media accounts to get started.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Connect an Account
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map(account => (
                            <AccountCard key={account.id} account={account} onDisconnect={handleDisconnect} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

const AccountCard = ({ account, onDisconnect }: { account: ConnectedAccount, onDisconnect: (id: number) => void }) => {
    const Icon = platformIcons[account.platform] || LinkIcon;
    const color = platformColors[account.platform] || 'text-foreground';

    return (
        <Card className={`bg-gradient-card flex flex-col transition-all hover:shadow-lg ${account.status === 'pending' ? 'border-amber-500/50' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                    <Icon className={`h-8 w-8 ${color}`} />
                    <div>
                        <CardTitle className="text-lg">{account.platform}</CardTitle>
                        <p className="text-sm text-muted-foreground">@{account.username}</p>
                    </div>
                </div>
                {account.status === 'verified' && <div className="w-2 h-2 rounded-full bg-success" title="Verified" />}
            </CardHeader>
            <CardContent className="flex-grow">
                {account.status === 'pending' && (
                    <div className="p-3 mb-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center text-xs text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4" /> Pending Verification
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-xl font-bold">{account.followers_count ? (account.followers_count / 1000).toFixed(1) + 'k' : 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div>
                        <Heart className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-xl font-bold">{account.engagement_rate ? account.engagement_rate + '%' : 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                </div>
            </CardContent>
            <div className="p-4 pt-0">
                <Button variant="destructive" className="w-full" onClick={() => onDisconnect(account.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Disconnect
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                    Last synced: {account.last_synced_at ? new Date(account.last_synced_at).toLocaleDateString() : 'Never'}
                </p>
            </div>
        </Card>
    );
};

const AccountsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-16 mx-auto" />
                            <Skeleton className="h-4 w-20 mx-auto" />
                        </div>
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-12 mx-auto" />
                            <Skeleton className="h-4 w-24 mx-auto" />
                        </div>
                    </div>
                </CardContent>
                <div className="p-4 pt-0">
                    <Skeleton className="h-9 w-full" />
                </div>
            </Card>
        ))}
    </div>
);