// src/pages/Signup.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE, parseError } from "@/utils/api";



export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // ✅ Add validation
    if (!email || !password || !username) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }
    
    try {
      console.log("🔍 Signup attempt:", { email, username });
      
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      console.log("📡 Response status:", res.status);

      if (!res.ok) {
        const err = await parseError(res);
        console.error("❌ Signup error response:", err);
        toast.error(err.error || "Signup failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("✅ Signup success:", data);
      
      const { accessToken, user } = data;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user || {}));
        localStorage.setItem("role", user?.is_admin ? "admin" : "creator");
      }

      toast.success("Account created 🎉");
      navigate("/");
    } catch (err) {
      console.error("❌ Signup network error:", err);
      toast.error(`Signup failed: ${err instanceof Error ? err.message : 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Sign up"}
            </Button>
          </form>
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
