// src/components/ConnectAccountDialog.tsx

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiRequest } from "@/utils/api";
import { Users, AtSign } from 'lucide-react'; // AtSign icon add karein

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ConnectAccountDialog({ isOpen, onClose, onSuccess }: Props) {
    const [platform, setPlatform] = useState('');
    const [profileUrl, setProfileUrl] = useState('');
    const [username, setUsername] = useState(''); // <-- Yahan state add karein
    const [followersCount, setFollowersCount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        // Validation mein username check add karein
        if (!platform || !profileUrl || !followersCount || !username) {
            toast.error("Please fill all the fields.");
            return;
        }
        setIsLoading(true);
        try {
            await apiRequest('/api/accounts/initiate-verification', {
                method: 'POST',
                // Body mein username bhejein
                body: JSON.stringify({ platform, profileUrl, username, followersCount: parseInt(followersCount, 10) }),
            });
            toast.success("Account added successfully!");
            onSuccess();
            handleClose();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast.error(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Reset state mein username add karein
        setPlatform('');
        setProfileUrl('');
        setUsername('');
        setFollowersCount('');
        setIsLoading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Connect New Social Account</DialogTitle>
                    <DialogDescription>
                        Enter your social media profile details. This will be verified by our team.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-4">
                    <div>
                        <Label>Platform</Label>
                        <Select onValueChange={setPlatform} value={platform}>
                            <SelectTrigger><SelectValue placeholder="Select a platform..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                                <SelectItem value="YouTube">YouTube</SelectItem>
                                <SelectItem value="TikTok">TikTok</SelectItem>
                                <SelectItem value="Twitter">Twitter</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Username Input Field */}
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g., yourusername"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="profileUrl">Profile URL</Label>
                        <Input
                            id="profileUrl"
                            value={profileUrl}
                            onChange={(e) => setProfileUrl(e.target.value)}
                            placeholder="e.g., https://instagram.com/yourusername"
                        />
                    </div>
                    <div>
                        <Label htmlFor="followersCount">Follower Count</Label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="followersCount"
                                type="number"
                                value={followersCount}
                                onChange={(e) => setFollowersCount(e.target.value)}
                                placeholder="e.g., 5200"
                                className="pl-9"
                            />
                        </div>
                    </div>
                </div>
                
                <DialogFooter>
                    <Button variant="ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Adding Account..." : "Add Account"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}